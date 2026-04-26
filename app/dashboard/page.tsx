"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Ghost,
  LayoutDashboard,
  Video,
  Calendar,
  BarChart3,
  Settings,
  Tv2,
  Cctv,
  Zap,
  Plus,
  MoreVertical,
  Edit2,
  Play,
  Pause,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Constants for styling
const VIDEO_STYLES: Record<string, string> = {
  ghibli: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=800&auto=format&fit=crop',
  cyberpunk: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
  pixar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  realism: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
  comics: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=800&auto=format&fit=crop'
};

export default function DashboardPage() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<{ name: string; credits: number } | null>(null);
  const [ghostMode, setGhostMode] = useState(false);
  const [userSeries, setUserSeries] = useState<any[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("name, credits")
          .eq("user_id", userId)
          .single();
        
        if (data) setUserData(data);
      };

      const fetchSeries = async () => {
        setLoadingSeries(true);
        try {
          const res = await fetch("/api/series");
          if (!res.ok) throw new Error("API error");
          
          const data = await res.json();
          if (data && Array.isArray(data)) {
            const mapped = data.map((s: any) => ({
              id: s.id,
              name: s.series_name,
              createdAt: new Date(s.created_at).toLocaleDateString(),
              thumbnail: VIDEO_STYLES[s.video_style_id] || VIDEO_STYLES.cyberpunk,
              status: s.status
            }));
            setUserSeries(mapped);
          }
        } catch (error) {
          console.error("Error fetching series:", error);
        } finally {
          setLoadingSeries(false);
        }
      };

      fetchUser();
      fetchSeries();
    }
  }, [userId]);

  const accent = ghostMode ? "#bc13fe" : "#00f2ff";
  const accentAlpha = ghostMode
    ? "rgba(188,19,254,0.1)"
    : "rgba(0,242,255,0.1)";
  const accentGlow = ghostMode
    ? "0 0 18px rgba(188,19,254,0.5)"
    : "0 0 18px rgba(0,242,255,0.5)";

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full w-64 flex flex-col border-r z-40"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-6 py-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Ghost className="w-7 h-7" style={{ color: accent }} />
          <span className="text-lg font-black tracking-tighter text-white">
            GHOST{" "}
            <span style={{ color: accent }}>CREATOR</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 relative z-50">
          {/* Create Button */}
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
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: true },
            { icon: Video, label: "My Videos", href: "/dashboard/videos" },
            { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
            { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
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

          <div
            className="pt-4 px-4 pb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Channels
          </div>

          {[
            { icon: Tv2, label: "YouTube", color: "#ff0000" },
            { icon: Cctv, label: "Instagram", color: "#e1306c" },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {label}
            </button>
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
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: accent }}
              >
                Ghost Mode
              </span>
            </div>
            {/* Pill toggle */}
            <div
              className="w-10 h-5 rounded-full relative transition-all"
              style={{
                background: ghostMode ? "#bc13fe" : "rgba(255,255,255,0.1)",
                boxShadow: ghostMode ? "0 0 10px rgba(188,19,254,0.6)" : "none",
              }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{
                  left: ghostMode ? "calc(100% - 18px)" : "2px",
                }}
              />
            </div>
          </button>
          <p
            className="text-[10px] mt-2 px-1 text-center"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {ghostMode ? "🟣 Purple stealth mode active" : "🔵 Cyan mode active"}
          </p>
        </div>

        {/* Settings */}
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="pl-64">
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b backdrop-blur-md"
          style={{
            background: "rgba(5,5,5,0.8)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Welcome back, {userData?.name || "Ghost Creator"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all"
              style={{ 
                borderColor: `${accent}30`, 
                background: accentAlpha, 
                color: accent,
                boxShadow: ghostMode ? `0 0 10px ${accent}20` : "none"
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              {userData?.credits ?? 0} Credits
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: `w-9 h-9 rounded-full ring-2 ring-[${accent}]/20 transition-all`,
                },
              }}
            />
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Videos Generated", value: "0", sub: "Get started below" },
              { label: "Platforms Connected", value: "0", sub: "Connect your channels" },
              { label: "Scheduled Posts", value: "0", sub: "Nothing queued yet" },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="p-6 rounded-2xl border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-sm mb-1"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </p>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Series Management Grid or Empty State */}
          {loadingSeries ? (
            <div className="flex justify-center p-12"><Ghost className="w-8 h-8 animate-bounce text-zinc-500" /></div>
          ) : userSeries.length === 0 ? (
            <div
              className="rounded-3xl p-10 text-center border"
              style={{
                background: ghostMode
                  ? "linear-gradient(135deg, rgba(188,19,254,0.05), rgba(0,242,255,0.05))"
                  : "linear-gradient(135deg, rgba(0,242,255,0.05), rgba(188,19,254,0.05))",
                borderColor: `${accent}26`,
              }}
            >
              <Ghost
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: accent }}
              />
              <h2 className="text-2xl font-black text-white mb-2">
                Your Ghost is Ready
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Create your first AI-generated video and let the Ghost handle the
                rest.
              </p>
              <Link
                href="/quasipoaru/create"
                className="inline-block px-8 py-3 font-bold rounded-2xl transition-all active:scale-95"
                style={{
                  background: accent,
                  color: "#050505",
                  boxShadow: `0 0 20px ${accent}60`,
                }}
              >
                Generate First Video
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSeries.map((series) => (
                <div key={series.id} className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden group transition-all shadow-lg flex flex-col"
                  style={{
                    boxShadow: ghostMode ? `0 0 0px ${accent}00` : `0 0 0px ${accent}00`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 30px ${accent}30`}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0px ${accent}00`}
                >
                  {/* Top half: 9:16 Thumbnail */}
                  <div className="relative w-full aspect-[9/16] max-h-[280px] overflow-hidden">
                    <img src={series.thumbnail} alt={series.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Top Right Quick Actions */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <Link href={`/quasipoaru/create?edit=${series.id}`} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white outline-none">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white min-w-[180px]">
                          <DropdownMenuItem asChild className="focus:bg-white/10 gap-2 cursor-pointer font-medium">
                            <Link href={`/quasipoaru/create?edit=${series.id}`}>
                              <Edit2 className="w-4 h-4" /> Edit Series
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/10 gap-2 cursor-pointer font-medium">
                            {series.status === "active" ? <Pause className="w-4 h-4 text-yellow-500" /> : <Play className="w-4 h-4 text-green-500" />} 
                            {series.status === "active" ? "Pause Automation" : "Resume Automation"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 focus:bg-red-500/20 focus:text-red-500 gap-2 cursor-pointer font-bold">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Details Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                      <h3 className="font-black text-xl truncate" style={{ color: accent }}>{series.name}</h3>
                      <p className="text-xs text-zinc-400 font-medium tracking-wide">Created: {series.createdAt}</p>
                    </div>
                  </div>

                  {/* Interactive Footer */}
                  <div className="p-4 bg-white/5 flex flex-col gap-2">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-black/50 hover:bg-white/10 transition-all text-sm font-semibold text-white">
                      <ImageIcon className="w-4 h-4" /> View Generated Clips
                    </button>
                    <button 
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-bold text-black group relative overflow-hidden"
                      style={{
                        background: accent,
                        boxShadow: `0 0 15px ${accent}40`,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 25px ${accent}80`}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 15px ${accent}40`}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Trigger Generation
                      </span>
                    </button>
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
