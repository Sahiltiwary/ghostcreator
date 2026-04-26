import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!supabaseAdmin) {
      return new NextResponse("Database configuration error", { status: 500 });
    }

    const body = await req.json();
    const {
      niche,
      customNiche,
      language,
      languageModel,
      voice,
      duration,
      topic,
      bgMusic,
      style,
      captionStyle,
      seriesName,
      platforms,
      scheduleTime,
    } = body;

    // Validate required fields
    if (!seriesName || !platforms || !scheduleTime) {
      return new NextResponse("Missing required deployment fields", { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from("video_series")
      .insert({
        user_id: userId,
        niche: niche,
        custom_niche: customNiche,
        language: language,
        language_model: languageModel,
        voice_id: voice,
        duration: duration,
        topic: topic,
        bg_music_id: bgMusic,
        video_style_id: style,
        caption_style_id: captionStyle,
        series_name: seriesName,
        platforms: platforms,
        schedule_time: scheduleTime,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) {
      console.error("[SERIES_POST] Supabase Error:", error);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERIES_POST] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!supabaseAdmin) {
      return new NextResponse("Database configuration error", { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Series ID is required", { status: 400 });
    }

    const body = await req.json();
    const {
      niche,
      customNiche,
      language,
      languageModel,
      voice,
      duration,
      topic,
      bgMusic,
      style,
      captionStyle,
      seriesName,
      platforms,
      scheduleTime,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("video_series")
      .update({
        niche: niche,
        custom_niche: customNiche,
        language: language,
        language_model: languageModel,
        voice_id: voice,
        duration: duration,
        topic: topic,
        bg_music_id: bgMusic,
        video_style_id: style,
        caption_style_id: captionStyle,
        series_name: seriesName,
        platforms: platforms,
        schedule_time: scheduleTime,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[SERIES_PUT] Supabase Error:", error);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERIES_PUT] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!supabaseAdmin) {
      return new NextResponse("Database configuration error", { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      // If no ID is provided, maybe they want to fetch all their series
      const { data, error } = await supabaseAdmin
        .from("video_series")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[SERIES_GET] Supabase Error:", error);
        return new NextResponse("Database error", { status: 500 });
      }

      return NextResponse.json(data);
    }

    // Fetch specific series
    const { data, error } = await supabaseAdmin
      .from("video_series")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("[SERIES_GET_ID] Supabase Error:", error);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERIES_GET] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
