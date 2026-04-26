"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Ghost, Sparkles, BookOpen, Fingerprint, 
  Search, Leaf, ArrowRight, ArrowLeft, CheckCircle2,
  User, UserPlus, Play, Square, Info, Mail,
  Zap, Clock, Film, Wand2, Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon fill="currentColor" className="text-zinc-900 group-hover:text-white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.11 7.4-2.22 2.14-5.4 3.09-8.42 2.39-2.92-.68-5.35-2.73-6.28-5.59-1.03-3.17.15-6.85 2.87-8.77 2.01-1.41 4.54-1.83 6.9-1.32v4.08c-1.14-.37-2.42-.4-3.51.1-1.16.53-2.01 1.57-2.3 2.8-.3 1.25.04 2.61.88 3.55.83.94 2.14 1.39 3.4 1.25 1.54-.17 2.81-1.37 3.24-2.85.25-.87.32-1.78.32-2.68V.02z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "from-[#00f2fe] to-[#fe0979]", glow: "shadow-[#fe0979]" },
  { id: "youtube", name: "YouTube", icon: YoutubeIcon, color: "from-red-500 to-red-700", glow: "shadow-red-600" },
  { id: "instagram", name: "Instagram", icon: InstagramIcon, color: "from-[#f09433] via-[#dc2743] to-[#bc1888]", glow: "shadow-[#dc2743]" },
  { id: "email", name: "Email List", icon: Mail, color: "from-blue-400 to-blue-600", glow: "shadow-blue-500" },
];

const AVAILABLE_NICHES = [
  { id: "scary_stories", title: "Scary Stories", description: "Bone-chilling tales for horror enthusiasts.", icon: Ghost },
  { id: "motivational", title: "Motivational", description: "High-energy content to spark inspiration.", icon: Sparkles },
  { id: "fun_facts", title: "Fun Facts", description: "Mind-blowing trivia that keeps viewers hooked.", icon: BookOpen },
  { id: "true_crime", title: "True Crime", description: "Deep dives into mysterious real-world cases.", icon: Fingerprint },
  { id: "daily_zen", title: "Daily Zen", description: "Calming mindfulness and productivity tips.", icon: Leaf },
];

export const Language = [
  { language: "English", countryCode: "US", countryFlag: "🇺🇸", modelName: "deepgram", modelLangCode: "en-US" }
];

export const DeepgramVoices = [
  { model: "deepgram", modelName: "aura-2-odysseus-en", preview: "aura-2-odysseus-en.wav", gender: "male" },
  { model: "deepgram", modelName: "aura-2-thalia-en", preview: "aura-2-thalia-en.wav", gender: "female" }
];

const BACKGROUND_MUSIC = [
  { id: "marketing", name: "Marketing Vibe", tag: "Marketing", url: "/previews/marketing-vibe.mp3" },
  { id: "trending", name: "Trending Reels", tag: "Trending", url: "/previews/trending.mp3" },
  { id: "cinematic", name: "Cinematic Epic", tag: "Cinematic", url: "/previews/cinematic.mp3" },
  { id: "phonk", name: "Basketball Phonk", tag: "Phonk", url: "/previews/phonk.mp3" },
  { id: "hiphop", name: "Dramatic Hip-Hop Jazz", tag: "Hip-Hop", url: "/previews/hiphop.mp3" },
];

const VIDEO_STYLES = [
  { 
    id: 'ghibli', 
    name: 'Anime Ghibli', 
    tag: 'Magical',
    url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    tag: 'Futuristic',
    url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'pixar', 
    name: '3D Pixar', 
    tag: 'Vibrant',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'realism', 
    name: 'Cinematic Realism', 
    tag: 'Dark',
    url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'comics', 
    name: 'Urban Comics', 
    tag: 'Action',
    url: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=800&auto=format&fit=crop' 
  }
];

const CAPTION_CONFIGS = [
  { id: "hormozi", name: "The Hormozi", tag: "Viral" },
  { id: "minimalist", name: "The Minimalist", tag: "Clean" },
  { id: "cyber", name: "The Cyber-Glow", tag: "Neon" },
  { id: "beast", name: "The Beast Mode", tag: "Aggressive" },
  { id: "typewriter", name: "The Typewriter", tag: "Classic" },
  { id: "gradient", name: "The Gradient Pop", tag: "Modern" },
];

const CaptionPreview = ({ styleId }: { styleId: string }) => {
  const words = "This is how your story will look.".split(" ");
  const letters = "This is how your story will look.".split("");

  const [key, setKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setKey(k => k + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  if (styleId === "hormozi") {
    return (
      <div key={key} className="flex flex-wrap justify-center gap-1.5 items-center w-full">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2, type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "font-black text-xl md:text-2xl uppercase",
              i % 2 === 0 ? "text-yellow-400" : "text-white"
            )}
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.8)" }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  if (styleId === "minimalist") {
    return (
      <div key={key} className="flex flex-wrap justify-center gap-1 items-center w-full">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2, duration: 0.5, ease: "easeOut" }}
            className="font-sans font-medium text-white text-lg md:text-xl"
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  if (styleId === "cyber") {
    return (
      <div key={key} className="flex flex-wrap justify-center gap-2 items-center w-full">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ x: -10, opacity: 0, skewX: 20 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ delay: i * 0.2, duration: 0.2 }}
            className="font-black text-cyan-400 text-xl md:text-2xl uppercase italic drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  if (styleId === "beast") {
    return (
      <div key={key} className="flex flex-wrap justify-center gap-2 items-center w-full">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: [0, -2, 2, -2, 0] }}
            transition={{ 
              scale: { delay: i * 0.3, duration: 0.2 }, 
              opacity: { delay: i * 0.3, duration: 0.1 },
              x: { delay: i * 0.3 + 0.2, duration: 0.2, repeat: 2 } 
            }}
            className="font-black text-red-600 text-2xl md:text-3xl uppercase tracking-tighter"
            style={{ WebkitTextStroke: "1px black" }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  if (styleId === "typewriter") {
    return (
      <div key={key} className="flex flex-wrap justify-center items-center w-full">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.1 }}
            className="font-mono text-green-400 text-lg md:text-xl whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-2 md:w-3 h-5 md:h-6 bg-green-400 ml-1"
        />
      </div>
    );
  }

  if (styleId === "gradient") {
    return (
      <div key={key} className="flex flex-wrap justify-center gap-2 items-center w-full">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, type: "spring", stiffness: 200, damping: 10 }}
            className="font-black text-xl md:text-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  return null;
};

export default function CreateVideo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);

  useEffect(() => {
    // Shared audio instance to prevent "Zombie Sound" (overlapping audio)
    if (!audioRef.current && typeof window !== "undefined") {
      audioRef.current = new Audio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ─── Shared audio stop helper ────────────────────────────────────────────
  // MUST null handlers BEFORE clearing src to prevent the previous onerror
  // from firing and showing a false "FAILED TO LOAD" error.
  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.onerror = null;
    audioRef.current.oncanplaythrough = null;
    audioRef.current.onended = null;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = "";
    audioRef.current.load(); // abort any pending network request
  };

  useEffect(() => {
    // Kill any playing audio when switching steps
    stopAudio();
    setPlayingPreview(null);
    setPlayingMusic(null);
  }, [currentStep]);

  const playPreview = (previewFile: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isPlayingThis = playingPreview === previewFile;

    // Force Stop — clears all handlers first to prevent false errors
    stopAudio();
    setPlayingMusic(null);
    setPlayingPreview(null);

    if (isPlayingThis) return;
    
    setPlayingPreview(previewFile);
    setAudioError(null);
    
    const audioPath = `/previews/${previewFile}`;
    const fullUrl = window.location.origin + audioPath;

    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleError = () => {
      console.error(`[Audio Error] MISSING FILE: ${fullUrl}`);
      setPlayingPreview(null);
      setAudioError(previewFile);
      setTimeout(() => setAudioError(null), 2000);
    };

    audio.onerror = handleError;
    audio.oncanplaythrough = () => {
      audio.play().catch(handleError);
    };
    audio.onended = () => {
      setPlayingPreview(null);
    };

    audio.src = audioPath;
    audio.load();
  };

  const playMusic = (musicUrl: string, musicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isPlayingThis = playingMusic === musicId;

    // Force Stop — clears all handlers first to prevent false errors
    stopAudio();
    setPlayingPreview(null);
    setPlayingMusic(null);

    if (isPlayingThis) return;

    setPlayingMusic(musicId);
    
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleMusicError = () => {
      console.error(`[Music Error] FAILED TO LOAD: ${musicUrl}`);
      setPlayingMusic(null);
    };

    audio.onerror = handleMusicError;
    audio.oncanplaythrough = () => {
      audio.play().catch(err => {
        console.error("Music playback execution failed", err);
        handleMusicError();
      });
    };
    audio.onended = () => {
      setPlayingMusic(null);
    };

    audio.src = musicUrl;
    audio.load();
  };

  const [formData, setFormData] = useState({
    niche: "",
    customNiche: "",
    language: "English",
    languageModel: "deepgram",
    voice: "",
    duration: "",
    topic: "",
    bgMusic: "",
    style: "",
    captionStyle: "",
    seriesName: "",
    platforms: [] as string[],
    scheduleTime: "",
  });

  const handleNextStep = () => {
    if (currentStep === 6) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#8b5cf6', '#bc13fe']
      });
    }
    if (currentStep < 7) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      if (formData.niche === "custom") {
        return formData.customNiche.trim().length > 0;
      }
      return formData.niche.length > 0;
    }
    if (currentStep === 2) {
      return formData.language.length > 0 && formData.voice.length > 0;
    }
    if (currentStep === 3) {
      return formData.duration.length > 0 && formData.topic.trim().length >= 5 && formData.bgMusic.length > 0;
    }
    if (currentStep === 4) {
      return formData.style.length > 0;
    }
    if (currentStep === 5) {
      return formData.captionStyle.length > 0;
    }
    if (currentStep === 6) {
      return formData.seriesName.trim().length > 0 && formData.platforms.length > 0 && formData.scheduleTime.length > 0;
    }
    // Add validation for other steps later
    return true;
  };

  const variants = {
    enter: (direction: number) => ({
      scale: 0,
      rotate: direction > 0 ? -25 : 25,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 1,
    },
    exit: (direction: number) => ({
      scale: 0,
      rotate: direction > 0 ? 25 : -25,
      opacity: 0,
      filter: "blur(4px)",
      zIndex: 0,
    }),
  };

  const getStatusDisplay = () => {
    const nicheStr = formData.niche === "custom" && formData.customNiche
      ? formData.customNiche.substring(0, 10).toUpperCase()
      : formData.niche ? formData.niche.toUpperCase() : "PENDING";

    if (currentStep === 1) return `STATUS: ${nicheStr}`;
    
    // Simplified to English Only
    const langStr = "ENGLISH";
    const voiceStr = formData.voice ? formData.voice.replace('aura-2-', '').replace('-en', '').toUpperCase() : "PENDING";
    
    if (currentStep === 2) return `${nicheStr} | ${langStr} | ${voiceStr}`;

    const durationStr = formData.duration ? formData.duration.toUpperCase() : "PENDING";

    if (currentStep === 3) {
      const selectedMusic = BACKGROUND_MUSIC.find(m => m.id === formData.bgMusic);
      const musicStr = selectedMusic ? selectedMusic.name.toUpperCase() : "PENDING";
      return `${nicheStr} | ${langStr} | ${voiceStr} | ${durationStr} | ${musicStr}`;
    }

    if (currentStep === 4) {
      const selectedMusic = BACKGROUND_MUSIC.find(m => m.id === formData.bgMusic);
      const musicStr = selectedMusic ? selectedMusic.name.toUpperCase() : "PENDING";
      const selectedStyle = VIDEO_STYLES.find(s => s.id === formData.style);
      const styleStr = selectedStyle ? selectedStyle.name.toUpperCase() : "PENDING";
      return `${nicheStr} | ${langStr} | ${voiceStr} | ${durationStr} | ${musicStr} | ${styleStr}`;
    }

    if (currentStep >= 5) {
      const selectedStyle = VIDEO_STYLES.find(s => s.id === formData.style);
      const styleStr = selectedStyle ? selectedStyle.name.toUpperCase() : "PENDING";
      const selectedCaption = CAPTION_CONFIGS.find(c => c.id === formData.captionStyle);
      const captionStr = selectedCaption ? `CAPTION: ${selectedCaption.name.toUpperCase()}` : "CAPTION: PENDING";
      return `${nicheStr} | ${voiceStr} | ${styleStr} | ${captionStr}`;
    }

    return "STATUS: OK";
  };

  // Switch tabs -> handle niche reset if switching back and forth
  const handleTabChange = (val: string) => {
    if (val === "custom") {
      setFormData(prev => ({ ...prev, niche: "custom" }));
    } else if (formData.niche === "custom") {
      setFormData(prev => ({ ...prev, niche: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-zinc-950 to-black text-white selection:bg-cyan-500/30 relative">
      
      {/* Grain Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen"
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
        }} 
      />
      {/* Sticky Header / Stepper */}
      <header className="absolute top-0 left-0 right-0 z-50 pt-8 px-8 bg-black/80 backdrop-blur-md pb-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const isActive = currentStep >= step;
              return (
                <div key={step} className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div
                    className={cn(
                      "absolute top-0 left-0 h-full w-full rounded-full transition-colors duration-500",
                      isActive ? "bg-[#8b5cf6]" : "bg-transparent"
                    )}
                    style={{
                      boxShadow: isActive ? "0 0 15px rgba(139,92,246,0.5)" : "none",
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center pt-32 pb-32 px-6">
        <div className="w-full max-w-4xl relative flex flex-col">
          <AnimatePresence custom={direction} mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Choose Your Niche</h1>
                  <p className="text-white/50 text-lg">Step 1: Define the core theme for your AI-generated videos.</p>
                </div>

                <Tabs 
                  defaultValue="available" 
                  className="w-full flex-1 flex flex-col min-h-0"
                  onValueChange={handleTabChange}
                >
                  <div className="flex justify-center w-full mb-6">
                    <TabsList className="shrink-0 flex w-[400px] h-12 bg-white/5 border border-white/10 p-1 rounded-full mx-auto">
                      <TabsTrigger
                        value="available"
                        className="flex-1 h-full flex items-center justify-center rounded-full transition-all font-semibold data-[state=active]:bg-cyan-400/10 data-[state=active]:text-cyan-400"
                      >
                        Available Niche
                      </TabsTrigger>
                      <TabsTrigger
                        value="custom"
                        className="flex-1 h-full flex items-center justify-center rounded-full transition-all font-semibold data-[state=active]:bg-cyan-400/10 data-[state=active]:text-cyan-400"
                      >
                        Custom Niche
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 min-h-0">
                    <TabsContent value="available" className="h-full m-0 focus-visible:outline-none">
                      <ScrollArea className="h-[450px] w-full rounded-2xl">
                        <div className="grid grid-cols-2 gap-6 p-2 pb-4">
                          {AVAILABLE_NICHES.map((niche) => {
                            const isSelected = formData.niche === niche.id;
                            const Icon = niche.icon;
                            
                            return (
                              <div
                                key={niche.id}
                                onClick={() => setFormData({ ...formData, niche: niche.id })}
                                className={cn(
                                  "p-4 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col h-[140px] border-2 border-transparent relative overflow-hidden group box-border outline-none backdrop-blur-md",
                                  isSelected 
                                    ? "bg-cyan-400/10 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]" 
                                    : "bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-white/10"
                                )}
                              >
                                {/* Icon top-left */}
                                <div className={cn(
                                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all mb-2",
                                  isSelected ? "bg-cyan-400 text-black" : "bg-zinc-800 text-white/70 group-hover:text-white"
                                )}>
                                  <Icon className="w-4 h-4" />
                                </div>

                                {/* Text */}
                                <h3 className={cn(
                                  "text-sm font-bold mb-0.5 transition-colors",
                                  isSelected ? "text-cyan-400" : "text-white"
                                )}>
                                  {niche.title}
                                </h3>
                                <p className="text-white/40 text-[10px] leading-snug line-clamp-2">
                                  {niche.description}
                                </p>

                                {/* Check overlay */}
                                {isSelected && (
                                  <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-3 right-3 text-cyan-400"
                                  >
                                    <CheckCircle2 className="w-5 h-5 fill-cyan-400/20" />
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="custom" className="h-full m-0 focus-visible:outline-none">
                      <div className="h-[450px] bg-zinc-900/20 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden border-2 border-transparent box-border">
                        <div className="flex flex-col items-center justify-center flex-1">
                          <div className="w-16 h-16 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                            <Search className="w-8 h-8" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">Custom Niche Setup</h3>
                          <p className="text-white/50 mb-8 max-w-md">
                            Define a completely custom content category. The AI will adapt its generation specifically for your prompts.
                          </p>
                        </div>
                        
                        <div className="w-full max-w-lg relative pb-4">
                          <Textarea 
                            placeholder="e.g. Vintage Tech Restoration, Japanese Woodworking..."
                            className="w-full min-h-[140px] resize-none bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-cyan-400 transition-all shadow-none box-border outline-none"
                            value={formData.customNiche}
                            maxLength={100}
                            onChange={(e) => setFormData({ ...formData, customNiche: e.target.value })}
                          />
                          <div className="absolute bottom-8 right-8 text-xs font-mono text-white/40">
                            {formData.customNiche.length}/100
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Language & Voice</h1>
                  <p className="text-white/50 text-lg">Step 2: Define how your AI speaks.</p>
                </div>
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-8">
                  <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-3 mb-2">
                      <span className="text-4xl">🇺🇸</span>
                      <h3 className="text-3xl font-black text-[#8b5cf6] tracking-tight uppercase">Select Your Narrator</h3>
                      <p className="text-white/40 text-sm">Professional English AI Voice Models</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                      {DeepgramVoices.map((voice) => {
                        const isSelected = formData.voice === voice.modelName;
                        const isPlaying = playingPreview === voice.preview;
                        
                        return (
                          <div
                            key={voice.modelName}
                            onClick={() => setFormData({ ...formData, language: "English", languageModel: "deepgram", voice: voice.modelName })}
                            className={cn(
                              "p-6 rounded-3xl cursor-pointer transition-all duration-300 flex items-center justify-between border-2 border-transparent relative overflow-hidden group box-border outline-none backdrop-blur-md min-h-[120px]",
                              isSelected 
                                ? "bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-[0_0_30px_rgba(139,92,246,0.3)]" 
                                : "bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-white/10"
                            )}
                          >
                            <div className="flex flex-col gap-1">
                              <h3 className={cn(
                                "text-2xl font-black capitalize transition-colors tracking-tight",
                                isSelected ? "text-[#8b5cf6]" : "text-white"
                              )}>
                                {voice.modelName.replace('aura-2-', '').replace('-en', '').replace(/-/g, ' ')}
                              </h3>
                              <p className="text-white/40 text-xs uppercase font-mono tracking-widest flex items-center gap-2">
                                <span className={cn(isSelected ? "text-cyan-400" : "text-white/60")}>{voice.gender}</span>
                                <span className="opacity-20">|</span> 
                                <span className="opacity-60">{voice.model}</span>
                              </p>
                            </div>
                            
                            <button 
                              className={cn(
                                "w-14 h-14 rounded-full transition-all flex items-center justify-center shrink-0 border-2 z-10",
                                isPlaying 
                                  ? "bg-cyan-400/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse" 
                                  : audioError === voice.preview
                                    ? "bg-red-500/20 text-red-500 border-red-500"
                                    : "bg-white/5 border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5"
                              )}
                              onClick={(e) => playPreview(voice.preview, e)}
                            >
                              {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Duration & Topic</h1>
                  <p className="text-white/50 text-lg">Step 3: Define length, content focus, and background music.</p>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                  {/* Duration Selection */}
                  <div className="shrink-0">
                    <h3 className="text-base font-bold mb-3 text-white/60 uppercase tracking-widest">Video Length</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "30s", label: "30 Seconds", icon: Zap },
                        { id: "60s", label: "60 Seconds", icon: Clock },
                        { id: "90s", label: "90 Seconds", icon: Film }
                      ].map((dur) => {
                        const isSelected = formData.duration === dur.id;
                        const Icon = dur.icon;
                        return (
                          <div
                            key={dur.id}
                            onClick={() => setFormData({ ...formData, duration: dur.id })}
                            className={cn(
                              "p-3 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2 box-border relative overflow-hidden backdrop-blur-md",
                              isSelected 
                                ? "bg-cyan-400/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-cyan-400" 
                                : "bg-zinc-900/40 border-transparent hover:bg-zinc-900/60 hover:border-white/10 text-white"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-bold text-xs">{dur.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div className="shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-white/60 uppercase tracking-widest">Video Topic</h3>
                      <button 
                        onClick={() => {
                          const topicMap: Record<string, string[]> = {
                            scary_stories: [
                              "A spine-chilling documentary about the abandoned mines of Dhanbad", 
                              "A horror story about a haunted hostel in Bhopal", 
                              "A midnight train ride that never reaches its destination"
                            ],
                            motivational: ["How to build an unbreakable mindset in 30 days", "The secret routine of highly successful people", "Overcoming burnout when you feel completely lost"],
                            fun_facts: ["10 mind-blowing facts about the human body", "Weirdest historical events that actually happened", "Bizarre animals that look like aliens"],
                            true_crime: ["The unsolved mystery of the disappearing lighthouse keepers", "A deep dive into the most baffling art heist", "The internet's most cryptic unsolved puzzle"],
                            daily_zen: ["A 5-minute meditation script for instant calm", "How to create a peaceful morning routine", "The philosophy of wabi-sabi for modern life"],
                            custom: ["A fascinating documentary-style breakdown", "An engaging and educational narrative", "A captivating story with a surprising twist"]
                          };
                          const ideas = topicMap[formData.niche] || topicMap.custom;
                          setFormData({ ...formData, topic: ideas[Math.floor(Math.random() * ideas.length)] });
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-semibold bg-[#8b5cf6]/20 text-[#8b5cf6] px-3 py-1.5 rounded-lg hover:bg-[#8b5cf6]/30 transition-colors border border-[#8b5cf6]/30"
                      >
                        ✨ Magic Suggest
                      </button>
                    </div>
                    <Textarea 
                      placeholder="e.g. Discuss the weirdest facts about space, focusing on black holes..."
                      className="w-full h-24 resize-none bg-black/40 border-2 border-[#8b5cf6]/30 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-cyan-400 focus-visible:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all box-border outline-none backdrop-blur-md"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>

                  {/* Background Music Section */}
                  <div className="shrink-0">
                    <h3 className="text-base font-bold mb-3 text-white/60 uppercase tracking-widest">Select Background Music</h3>
                    <div className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-2">
                      <div className="flex flex-col gap-2">
                        {BACKGROUND_MUSIC.map((music) => {
                          const isSelected = formData.bgMusic === music.id;
                          const isPlaying = playingMusic === music.id;
                          return (
                            <div
                              key={music.id}
                              onClick={() => setFormData({ ...formData, bgMusic: music.id })}
                              className={cn(
                                "p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-between border-2 box-border relative overflow-hidden",
                                isSelected 
                                  ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                                  : "bg-black/20 border-transparent hover:bg-black/40 hover:border-white/5"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "p-2 rounded-md",
                                  isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/40"
                                )}>
                                  <Music className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <h4 className={cn(
                                    "text-sm font-bold tracking-tight",
                                    isSelected ? "text-cyan-400" : "text-white"
                                  )}>{music.name}</h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-tighter border border-purple-500/30">
                                      {music.tag}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                onClick={(e) => playMusic(music.url, music.id, e)}
                                className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0",
                                  isPlaying 
                                    ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                                    : "bg-white/5 border-white/10 text-white/40 hover:border-cyan-500 hover:text-cyan-500"
                                )}
                              >
                                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Video Style</h1>
                  <p className="text-white/50 text-lg">Step 4: Select the visual aesthetic for your AI generated video.</p>
                </div>

                <div className="w-full">
                  {/* Horizontal Scrollable 9:16 Cards */}
                  <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-cyan-500/40 hover:scrollbar-thumb-cyan-500 w-full px-2">
                    {VIDEO_STYLES.map((style) => {
                      const isSelected = formData.style === style.id;
                      return (
                        <div
                          key={style.id}
                          onClick={() => setFormData({ ...formData, style: style.id })}
                          className={cn(
                            "relative shrink-0 w-[200px] sm:w-[240px] cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 group",
                            "aspect-[9/16]",
                            isSelected
                              ? "border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-[1.03]"
                              : "border-2 border-transparent hover:scale-105 hover:rotate-1 hover:border-white/20"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={style.url}
                            alt={style.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                          
                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10">
                              <CheckCircle2 className="w-5 h-5 text-black fill-current" />
                            </div>
                          )}
                          
                          {/* Name & Tag */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                            <p className={cn(
                              "text-xl font-black leading-tight mb-2",
                              isSelected ? "text-cyan-400" : "text-white group-hover:text-cyan-300"
                            )}>{style.name}</p>
                            <span className="text-[10px] px-2 py-1 rounded-md bg-purple-500/30 text-purple-300 border border-purple-500/40 uppercase font-bold tracking-widest">
                              {style.tag}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Caption Style</h1>
                  <p className="text-white/50 text-lg">Step 5: Select the animated typography for your script.</p>
                </div>

                <div className="w-full max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                    {CAPTION_CONFIGS.map((caption) => {
                      const isSelected = formData.captionStyle === caption.id;
                      const bgStyle = VIDEO_STYLES.find(s => s.id === formData.style);
                      const bgUrl = bgStyle ? bgStyle.url : "";

                      return (
                        <div
                          key={caption.id}
                          onClick={() => setFormData({ ...formData, captionStyle: caption.id })}
                          className={cn(
                            "relative shrink-0 w-full cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 group min-h-[160px] flex flex-col",
                            isSelected
                              ? "border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]"
                              : "border-2 border-white/10 hover:border-white/30"
                          )}
                        >
                          {/* Blurred Background from Step 4 */}
                          {bgUrl && (
                            <div className="absolute inset-0 z-0">
                              <img src={bgUrl} alt="Background Preview" className="w-full h-full object-cover opacity-30" />
                              <div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>
                            </div>
                          )}

                          {/* Top Tag & Checkmark */}
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                                <CheckCircle2 className="w-3 h-3 text-black fill-current" />
                              </div>
                            )}
                          </div>

                          <div className="absolute top-3 left-3 z-20">
                            <span className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-bold tracking-widest">
                              {caption.tag}
                            </span>
                          </div>

                          {/* Animated Text Preview */}
                          <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                            <CaptionPreview styleId={caption.id} />
                          </div>

                          {/* Footer Info */}
                          <div className="relative z-20 p-3 bg-black/60 border-t border-white/10 flex items-center justify-center text-center">
                            <h3 className={cn(
                              "font-bold text-sm tracking-widest uppercase",
                              isSelected ? "text-cyan-400" : "text-white"
                            )}>{caption.name}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col relative z-10"
              >
                <div className="mb-8 text-center md:text-left shrink-0">
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Series Deployment</h1>
                  <p className="text-white/50 text-lg">Step 6: Name your series and schedule its release.</p>
                </div>

                <div className="flex-1 min-h-0 flex flex-col gap-6">
                  {/* Glassmorphism Container */}
                  <div className="bg-black/40 backdrop-blur-xl border border-[#8b5cf6]/30 rounded-3xl p-8 flex flex-col gap-8 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                    
                    {/* Series Name */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-[#8b5cf6]" /> Series Name
                      </h3>
                      <input 
                        type="text"
                        placeholder="e.g. Daily Motivation Ghost"
                        value={formData.seriesName}
                        onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/20 transition-all font-semibold"
                      />
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#8b5cf6]" /> Select Platforms
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {PLATFORMS.map((platform) => {
                          const isSelected = formData.platforms.includes(platform.id);
                          return (
                            <button
                              key={platform.id}
                              onClick={() => {
                                const newPlatforms = isSelected 
                                  ? formData.platforms.filter(p => p !== platform.id)
                                  : [...formData.platforms, platform.id];
                                setFormData({ ...formData, platforms: newPlatforms });
                              }}
                              className={cn(
                                "px-5 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group border-2",
                                isSelected 
                                  ? `border-transparent text-white ${platform.glow}/50 shadow-[0_0_20px_var(--tw-shadow-color)]`
                                  : "border-white/10 text-white/50 hover:border-white/30 bg-white/5"
                              )}
                            >
                              {isSelected && (
                                <div className={cn("absolute inset-0 bg-gradient-to-r opacity-80", platform.color)} />
                              )}
                              <span className="relative z-10 flex items-center gap-2">
                                <platform.icon className="w-5 h-5" />
                                {platform.name}
                                {isSelected && <CheckCircle2 className="w-4 h-4 ml-1" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Schedule Time */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8b5cf6]" /> Schedule Publish Time
                      </h3>
                      <input 
                        type="time"
                        value={formData.scheduleTime}
                        onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                        className="bg-white/5 border-2 border-white/10 rounded-xl px-5 py-3 text-white text-lg focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/20 transition-all font-mono"
                      />
                      
                      {/* Info Box */}
                      <div className="mt-4 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="relative flex shrink-0 mt-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <Info className="w-5 h-5 text-blue-400 relative" />
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          <strong className="text-blue-400 font-semibold">System Note:</strong> Video will be generated & rendered 3-6 hours before the scheduled publish time to ensure maximum quality and network delivery.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="step-7"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full flex flex-col items-center justify-center relative z-10 py-20"
              >
                <div className="flex flex-col items-center justify-center text-center max-w-lg">
                  <div className="w-24 h-24 border-4 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(139,92,246,0.5)]"></div>
                  <h1 className="text-4xl font-black mb-4 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Series Scheduled Successfully!</h1>
                  <p className="text-white/50 text-lg">
                    The Ghost AI engine is now synthesizing your script, rendering visuals, and mixing audio. It will automatically publish at your scheduled time.
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Add more steps as needed... */}
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Footer Navigation */}
      {currentStep < 7 && (
        <footer className="absolute bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="hidden md:block">
              <span className="font-mono text-xs tracking-widest text-[#8b5cf6] bg-[#8b5cf6]/10 px-5 py-2.5 rounded-full border border-[#8b5cf6]/20 shadow-[0_0_10px_rgba(139,92,246,0.2)] uppercase">
                {getStatusDisplay()}
              </span>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!isStepValid()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative group overflow-hidden",
                currentStep === 6 
                  ? "bg-[#8b5cf6] hover:bg-[#9d74f7] shadow-[0_0_20px_rgba(139,92,246,0.4)]" 
                  : "bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:hover:bg-cyan-400"
              )}
            >
              {currentStep === 6 && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {currentStep === 6 ? "Schedule Series" : (currentStep === 5 ? "Finalize Series" : "Continue")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
