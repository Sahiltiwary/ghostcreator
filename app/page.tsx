"use client";

import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { openSignUp } = useClerk();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDashboardRedirect = () => {
    setIsSyncing(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6"
          >
            Ghost Create. <span style={{ color: "#00f2ff" }}>Auto Scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12"
          >
            The AI engine that builds your personal brand while you sleep.
            Generate, optimize, and schedule across all platforms in one click.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            {/* Hero CTA — wrapper keeps tooltip in flow without breaking layout */}
            <div className="relative flex flex-col items-center gap-3">
              <button
                onClick={() =>
                  isSignedIn ? handleDashboardRedirect() : openSignUp()
                }
                disabled={isSyncing}
                className="px-8 py-4 font-bold rounded-2xl transition-all active:scale-95 disabled:cursor-wait"
                style={{
                  background: isSyncing
                    ? "rgba(0,242,255,0.3)"
                    : "#00f2ff",
                  color: "#050505",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) =>
                  !isSyncing &&
                  (e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(0,242,255,0.5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "none")
                }
              >
                {isSyncing ? "Loading..." : isSignedIn ? "Go to Dashboard" : "Start Building Now"}
              </button>

              {/* Glowing tooltip — only visible when syncing */}
              {isSyncing && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-center max-w-xs"
                  style={{
                    color: "#00f2ff",
                    textShadow: "0 0 8px rgba(0,242,255,0.7)",
                  }}
                >
                  Ruk ja bhai, tujhe kaunsa paanwaale  nikalna hai? 🏃
                </motion.p>
              )}
            </div>

            <button
              className="px-8 py-4 font-bold rounded-2xl border transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
              }}
            >
              Watch Demo
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
          className="mt-[-100px]"
        >
          <Hero3D />
        </motion.div>
      </section>

      {/* Features Section */}
      <div id="features" className="relative z-10">
        <Features />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
