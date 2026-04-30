"use client";

import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Ghost,
  LayoutDashboard,
  Video as VideoIcon,
  Calendar,
  BarChart3,
  Tv2,
  Cctv,
  Zap,
  Plus,
  Play,
  Download,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
}

export default function VideosPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [ghostMode, setGhostMode] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/videos?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch videos from API");

      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    // 5-second polling for updates
    const interval = setInterval(() => {
      fetchVideos();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const accent = ghostMode ? "#bc13fe" : "#00f2ff";
  const accentAlpha = ghostMode
    ? "rgba(188,19,254,0.1)"
    : "rgba(0,242,255,0.1)";
  const accentGlow = ghostMode
    ? "0 0 18px rgba(188,19,254,0.5)"
    : "0 0 18px rgba(0,242,255,0.5)";

  return (
    <div className="min-h-screen flex" style={{ background: "#050505" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full w-64 flex flex-col border-r z-40"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center gap-2 px-6 py-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Ghost className="w-7 h-7" style={{ color: accent }} />
          <span className="text-lg font-black tracking-tighter text-white">
            GHOST <span style={{ color: accent }}>CREATOR</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 relative z-50">
          <Link
            href="/quasipoaru/create"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-black"
            style={{
              background: accent,
              boxShadow: `0 0 20px ${accent}60`,
            }}
          >
            <Plus className="w-5 h-5" />
            Create New Series
          </Link>
          {[
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: false },
            { icon: VideoIcon, label: "My Videos", href: "/dashboard/videos", active: true },
            { icon: Calendar, label: "Schedule", href: "/dashboard/schedule", active: false },
            { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", active: false },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? accentAlpha : "transparent",
                color: active ? accent : "rgba(255,255,255,0.5)",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Ghost Mode Toggle */}
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setGhostMode((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
            style={{
              background: ghostMode ? "rgba(188,19,254,0.08)" : "rgba(0,242,255,0.05)",
              borderColor: `${accent}40`,
              boxShadow: ghostMode ? accentGlow : "none",
            }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                Ghost Mode
              </span>
            </div>
            <div
              className="w-10 h-5 rounded-full relative transition-all"
              style={{
                background: ghostMode ? "#bc13fe" : "rgba(255,255,255,0.1)",
                boxShadow: ghostMode ? "0 0 10px rgba(188,19,254,0.6)" : "none",
              }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: ghostMode ? "calc(100% - 18px)" : "2px" }}
              />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 min-h-screen text-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">My Videos</h1>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              Manage your generated short-form videos here.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[400px] rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <VideoIcon className="w-16 h-16 mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
              <p className="text-white/50 mb-6 max-w-sm">
                Generate your first video from the dashboard to see it appear here.
              </p>
              <Link href="/dashboard">
                <button 
                  className="px-6 py-3 rounded-xl text-black font-bold"
                  style={{ background: accent, boxShadow: accentGlow }}
                >
                  Go to Dashboard
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-[9/16] w-full bg-black/50">
                    {video.status === 'processing' || !video.thumbnailUrl ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: accent }} />
                        <span className="text-sm font-semibold tracking-widest uppercase text-white/50">
                          Generating...
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="absolute bottom-0 w-full p-5 flex flex-col gap-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2 leading-tight shadow-sm">
                        {video.title}
                      </h3>
                      <p className="text-xs mt-1 text-white/60 font-medium">
                        {video.createdAt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {video.status === 'ready' && (
                        <>
                          <button
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
                            onClick={() => alert('Video playback coming soon!')}
                          >
                            <Play className="w-4 h-4" /> Play
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-black transition-colors backdrop-blur-md"
                            style={{ background: accent }}
                            onClick={() => alert('Download feature coming soon!')}
                          >
                            <Download className="w-4 h-4" /> Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
