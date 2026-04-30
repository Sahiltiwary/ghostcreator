import { inngest } from "@/lib/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { seriesId } = body;

    if (!seriesId) {
      return new NextResponse("Missing seriesId", { status: 400 });
    }

    // Trigger the Inngest background video generation pipeline
    await inngest.send({
      name: "series.generate.video",
      data: { seriesId },
    });

    return NextResponse.json({ success: true, message: "Video generation started" });
  } catch (error: any) {
    console.error("[GENERATE_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
