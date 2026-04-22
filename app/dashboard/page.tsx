"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Ghost,
  LayoutDashboard,
  Video,
  Calendar,
  BarChart3,
  Settings,
  Tv2,          // YouTube placeholder
  Cctv,         // Instagram placeholder
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [ghostMode, setGhostMode] = useState(false);
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
        <nav className="flex-1 px-4 py-6 space-y-1">
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
              Welcome back, Ghost Creator
            </p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 rounded-full",
              },
            }}
          />
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

          {/* CTA */}
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
            <button
              className="px-8 py-3 font-bold rounded-2xl transition-all active:scale-95"
              style={{
                background: accent,
                color: "#050505",
                boxShadow: `0 0 20px ${accent}60`,
              }}
            >
              Generate First Video
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
