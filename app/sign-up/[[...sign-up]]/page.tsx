"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Neon glow orbs — purple-forward for sign-up */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #bc13fe, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00f2ff, transparent)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(188,19,254,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(188,19,254,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            GHOST <span style={{ color: "#00f2ff" }}>CREATOR</span>
          </h1>
        </div>

        {/* Custom flicker heading */}
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-center px-4"
          style={{
            color: "#00f2ff",
            textShadow:
              "0 0 8px rgba(0,242,255,0.9), 0 0 20px rgba(0,242,255,0.4)",
            animation: "flicker 3s infinite",
          }}
        >
          User login karle, system hang nahi hoga 😎
        </motion.h2>

        {/* Clerk Sign Up */}
        <SignUp
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#00f2ff",
              colorBackground: "#0a0a0f",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "#ffffff",
              borderRadius: "12px",
            },
            elements: {
              card: "shadow-[0_0_60px_rgba(188,19,254,0.1)] border border-white/10",
              formButtonPrimary:
                "hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all",
              footerActionLink: "text-[#00f2ff] hover:text-[#00f2ff]/80",
            },
          }}
          fallbackRedirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>

      {/* Flicker keyframe */}
      <style>{`
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
          99% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
