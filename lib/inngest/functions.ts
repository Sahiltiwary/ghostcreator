import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { 
    id: "hello-world", 
    triggers: [{ event: "test/hello.world" }] 
  },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    
    return {
      message: "Hello World! Your Inngest setup is working.",
      eventData: event.data
    };
  }
);

export const generateVideo = inngest.createFunction(
  { 
    id: "generate-video",
    triggers: [{ event: "series.generate.video" }] 
  },
  async ({ event, step }) => {
    const { seriesId } = event.data;

    // Step 1: Fetch Series Data from Supabase
    const series = await step.run("fetch-series-data", async () => {
      // Lazy import supabase to avoid client-side leakage issues
      const { supabaseAdmin } = await import("../supabase");
      if (!supabaseAdmin) throw new Error("Supabase Admin not initialized");

      const { data, error } = await supabaseAdmin
        .from("video_series")
        .select("*")
        .eq("id", seriesId)
        .single();

      if (error || !data) {
        throw new Error(`Failed to fetch series data: ${error?.message}`);
      }
      return data;
    });

    // Step 2: Generate Video Script using AI
    const script = await step.run("generate-video-script", async () => {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment variables.");

      const genAI = new GoogleGenerativeAI(apiKey);
      // NOTE: gemini-2.5-flash is our stable fallback. We now use gemini-3.1-flash-lite-preview.
      let model;
      try {
        model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      } catch (e) {
        console.warn("Primary model gemini-3.1-flash-lite-preview unavailable, falling back to gemini-2.5-flash", e);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      }

      // Determine number of scenes based on video duration
      const durationSec = parseInt(series.duration) || 30;
      let sceneCount: number;
      if (durationSec <= 45) {
        sceneCount = Math.floor(Math.random() * 2) + 4; // 4-5 scenes for 30-40s
      } else if (durationSec <= 75) {
        sceneCount = Math.floor(Math.random() * 2) + 5; // 5-6 scenes for 60-70s
      } else {
        sceneCount = Math.floor(Math.random() * 2) + 8; // 8-9 scenes for 90s
      }

      const niche = series.niche === "custom" ? series.custom_niche : series.niche;
      const videoStyle = series.video_style_id;
      const topic = series.topic || "an interesting topic";
      const language = series.language || "English";

      const prompt = `You are a professional short-form video scriptwriter for a ${videoStyle}-style video.

Generate a compelling ${durationSec}-second video about "${topic}" in the "${niche}" niche.

The script MUST be written in ${language}.
It must sound completely natural, conversational, and engaging — as if a real human is speaking directly to the viewer. Use short sentences, natural pauses, and avoid robotic phrasing. This will be converted to a voiceover using text-to-speech, so never use markdown, bullet points, or special symbols in the script.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "title": "A catchy, concise video title (max 8 words)",
  "script": "The full natural-sounding voiceover script here. Written as one continuous paragraph of spoken words. No special characters.",
  "scenes": [
    {
      "sceneNumber": 1,
      "imagePrompt": "A highly detailed, photorealistic image prompt for an AI image generator. Describe the visual scene specifically: subject, action, lighting, mood, camera angle. Style: ${videoStyle}. No text in image."
    }
  ]
}

Generate exactly ${sceneCount} scenes. Each scene should match the pacing and flow of the script segment it represents.`;

      let result;
      let retries = 3;
      while (retries > 0) {
        try {
          result = await model.generateContent(prompt);
          break; // success, exit retry loop
        } catch (e: any) {
          console.error(`Gemini generation failed. Retries left: ${retries - 1}`, e);
          retries--;
          if (retries === 0) throw e;
          // Wait 10 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }

      if (!result) throw new Error("Failed to generate content after retries");

      const responseText = result.response.text().trim();

      // Robustly parse JSON — strip markdown code fences if present
      const jsonText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      let parsed: { title: string; script: string; scenes: { sceneNumber: number; imagePrompt: string }[] };
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        throw new Error(`Gemini returned invalid JSON. Raw response: ${responseText.substring(0, 300)}`);
      }

      if (!parsed.title || !parsed.script || !Array.isArray(parsed.scenes)) {
        throw new Error("Gemini response is missing required fields (title, script, scenes).");
      }

      return {
        title: parsed.title,
        script: parsed.script,
        scenes: parsed.scenes,
        sceneCount: parsed.scenes.length,
        durationSec,
      };
    });

    // Step 2.5: Initialize Video Record in Database
    const initialVideo = await step.run("initialize-video-record", async () => {
      const { supabaseAdmin } = await import("../supabase");
      if (!supabaseAdmin) throw new Error("Supabase Admin not initialized");

      const { data: video, error: videoError } = await supabaseAdmin
        .from("videos")
        .insert({
          series_id: seriesId,
          title: script.title,
          script: script.script,
          status: "processing"
        })
        .select("id")
        .single();

      if (videoError || !video) {
        throw new Error(`Failed to initialize video record: ${videoError?.message}`);
      }

      return { videoId: video.id };
    });

    // Step 3: Generate Voice using Deepgram TTS
    const voice = await step.run("generate-voice-tts", async () => {
      const { DeepgramClient } = await import("@deepgram/sdk");
      const apiKey = process.env.DEEPGRAM_API_KEY;
      if (!apiKey) throw new Error("DEEPGRAM_API_KEY is not set in environment variables.");

      const deepgram = new DeepgramClient({ apiKey });

      // Use the voice model from the series data, or default to aura-2-thalia-en
      const voiceModel = series.voice_id || "aura-2-thalia-en";

      const response = await deepgram.speak.v1.audio.generate(
        { text: script.script, model: voiceModel }
      );

      // Get the audio stream and convert to a Buffer
      // Get the audio stream and convert to a Buffer
      const stream = response.stream?.();
      if (!stream) throw new Error("Deepgram did not return an audio stream.");

      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      const audioBuffer = Buffer.concat(chunks);

      // Upload voiceover to Supabase Storage (voiceovers bucket)
      const { supabaseAdmin } = await import("../supabase");
      if (!supabaseAdmin) throw new Error("Supabase Admin not initialized");

      // Use series name (or seriesId) for folder and .mp3 extension
      const voiceFileName = `${series.series_name || seriesId}/voiceover_${Date.now()}.mp3`;

      // Retry upload up to 3 attempts
      let uploadError: any = null;
      let attempts = 3;
      while (attempts > 0) {
        const { error } = await supabaseAdmin.storage
          .from("voiceovers")
          .upload(voiceFileName, audioBuffer, {
            contentType: "audio/mpeg",
            upsert: true,
          });
        if (!error) {
          uploadError = null;
          break;
        }
        console.error(`Supabase voiceover upload failed (${attempts - 1} retries left):`, error);
        uploadError = error;
        attempts--;
        if (attempts > 0) await new Promise((r) => setTimeout(r, 5000));
      }
      if (uploadError) throw new Error(`Failed to upload voiceover: ${uploadError.message}`);

      const { data: urlData } = supabaseAdmin.storage.from("voiceovers").getPublicUrl(voiceFileName);
      return { audioUrl: urlData.publicUrl, fileName: voiceFileName };
    });

    // Step 4: Generate Caption using Model
    const captions = await step.run("generate-captions-deepgram", async () => {
      const { DeepgramClient } = await import("@deepgram/sdk");
      const { srt } = await import("@deepgram/captions");
      const fs = await import("fs/promises");
      const path = await import("path");

      const apiKey = process.env.DEEPGRAM_API_KEY;
      if (!apiKey) throw new Error("DEEPGRAM_API_KEY is not set in environment variables.");

      const deepgram = new DeepgramClient({ apiKey });

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          const result = await deepgram.listen.v1.media.transcribeUrl({
            url: voice.audioUrl,
            model: "nova-2",
            smart_format: true,
            utterances: true,
            punctuate: true,
          }) as any;
          response = result;
          break; // success, exit retry loop
        } catch (e: any) {
          console.error(`Deepgram transcription failed. Retries left: ${retries - 1}`, e);
          retries--;
          if (retries === 0) throw e;
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }

      if (!response || !('results' in response)) throw new Error("Failed to generate transcription after retries or received invalid response");

      // Extract words for viral-style word-by-word animations
      const words = response.results?.channels[0]?.alternatives[0]?.words || [];
      
      // Generate SRT string
      const srtContent = srt(response);

      // Save files to output directory
      const outputDir = path.join(process.cwd(), "output");
      await fs.mkdir(outputDir, { recursive: true });
      
      const baseFilename = `transcription_${Date.now()}`;
      await fs.writeFile(path.join(outputDir, `${baseFilename}.json`), JSON.stringify({ words }, null, 2));
      await fs.writeFile(path.join(outputDir, `${baseFilename}.srt`), srtContent);

      return { srt: srtContent, words, jsonPath: `${baseFilename}.json`, srtPath: `${baseFilename}.srt` };
    });

    // Step 5: Generate Images at generated data from step 2
    const images = await step.run("generate-images", async () => {
      const Replicate = (await import("replicate")).default;
      const { supabaseAdmin } = await import("../supabase");
      if (!supabaseAdmin) throw new Error("Supabase Admin not initialized");

      const replicateToken = process.env.REPLICATE_API_TOKEN;
      if (!replicateToken) throw new Error("REPLICATE_API_TOKEN is missing in environment variables.");
      const replicate = new Replicate({ auth: replicateToken });

      const sceneData: { url: string; prompt: string }[] = [];

      // Ensure the scene_images bucket exists
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.find(b => b.name === "scene_images");
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket("scene_images", { public: true });
      }

      for (let i = 0; i < script.scenes.length; i++) {
        const scene = script.scenes[i];
        const input = {
          prompt: scene.imagePrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
        };

        let output: any;
        let attempts = 3;
        while (attempts > 0) {
          try {
            output = await replicate.run("bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe", { input });
            break;
          } catch (e) {
            attempts--;
            if (attempts === 0) throw e;
            await new Promise((r) => setTimeout(r, 5000));
          }
        }

        if (!output || !output[0]) throw new Error(`Failed to generate image for scene ${i + 1}`);
        
        // Output can be an array of FileOutput objects with a url() method, or an array of strings in some older versions.
        const imgUrl = typeof output[0] === 'string' ? output[0] : output[0].url();
        const imgRes = await fetch(imgUrl);
        if (!imgRes.ok) throw new Error(`Failed to fetch image ${i + 1} from Replicate`);
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase
        const fileName = `${series.series_name || seriesId}/scene_${i + 1}_${Date.now()}.png`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from("scene_images")
          .upload(fileName, buffer, { contentType: "image/png", upsert: true });

        if (uploadError) throw new Error(`Failed to upload scene image ${i + 1}: ${uploadError.message}`);

        const { data: urlData } = supabaseAdmin.storage.from("scene_images").getPublicUrl(fileName);
        sceneData.push({ url: urlData.publicUrl, prompt: scene.imagePrompt });
      }

      return { sceneData };
    });

    // Step 6: Save everything to database
    await step.run("save-everything-to-database", async () => {
      const { supabaseAdmin } = await import("../supabase");
      if (!supabaseAdmin) throw new Error("Supabase Admin not initialized");

      const { error: videoError } = await supabaseAdmin
        .from("videos")
        .update({
          status: "ready"
        })
        .eq("id", initialVideo.videoId);

      if (videoError) {
        throw new Error(`Failed to save video to database: ${videoError.message}`);
      }

      const assets = [];

      // 1. Audio
      assets.push({
        video_id: initialVideo.videoId,
        asset_type: 'audio',
        url: voice.audioUrl,
      });

      // 2. SRT and Captions
      assets.push({
        video_id: initialVideo.videoId,
        asset_type: 'srt',
        url: captions.srtPath,
        metadata: { words: captions.words }
      });

      // 3. Images
      for (const img of images.sceneData) {
        assets.push({
          video_id: initialVideo.videoId,
          asset_type: 'image',
          url: img.url,
          prompt: img.prompt,
        });
      }

      const { error: assetsError } = await supabaseAdmin
        .from("video_assets")
        .insert(assets);

      if (assetsError) {
        throw new Error(`Failed to save video assets to database: ${assetsError.message}`);
      }

      return { status: "success", videoId: initialVideo.videoId };
    });

    return { success: true, seriesId };
  }
);
