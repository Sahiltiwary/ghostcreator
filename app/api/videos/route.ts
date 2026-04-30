import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!supabaseAdmin) {
      return new NextResponse("Database configuration error", { status: 500 });
    }

    // 1. Fetch user's series IDs
    const { data: userSeries, error: seriesError } = await supabaseAdmin
      .from("video_series")
      .select("id")
      .eq("user_id", userId);

    if (seriesError) {
      console.error("[VIDEOS_GET] Series fetch error:", seriesError);
      return new NextResponse("Database error", { status: 500 });
    }

    if (!userSeries || userSeries.length === 0) {
      return NextResponse.json([]);
    }

    const seriesIds = userSeries.map((s) => s.id);

    // 2. Fetch videos for those series
    const { data: videosData, error: videosError } = await supabaseAdmin
      .from("videos")
      .select("*")
      .in("series_id", seriesIds)
      .order("created_at", { ascending: false });

    if (videosError) {
      console.error("[VIDEOS_GET] Videos fetch error:", videosError);
      return new NextResponse("Database error", { status: 500 });
    }

    // 3. For each video, fetch the thumbnail (first image asset)
    const mappedVideos = [];
    
    for (const v of videosData || []) {
      const { data: assetsData } = await supabaseAdmin
        .from("video_assets")
        .select("url")
        .eq("video_id", v.id)
        .eq("asset_type", "image")
        .limit(1);

      mappedVideos.push({
        id: v.id,
        title: v.title,
        status: v.status,
        createdAt: new Date(v.created_at).toLocaleDateString(),
        thumbnailUrl: assetsData && assetsData.length > 0 ? assetsData[0].url : null,
        videoUrl: null, // Update when compilation is implemented
      });
    }

    return NextResponse.json(mappedVideos);
  } catch (error) {
    console.error("[VIDEOS_GET] Internal error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
