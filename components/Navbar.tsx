"use client";

import { motion } from "framer-motion";
import { Ghost, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDashboardRedirect = () => {
    setIsSyncing(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-card mx-8 mt-6 rounded-2xl"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Ghost className="w-8 h-8" style={{ color: "#00f2ff" }} />
        <span className="text-xl font-bold tracking-tighter text-white">
          GHOST <span style={{ color: "#00f2ff" }}>CREATOR</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
      </div>

      {/* CTA / Auth */}
      <div className="flex items-center gap-3">
        {isSignedIn ? (
          /* ── Signed In ───────────────────────────────────────────── */
          <>
            {/* Dashboard button with syncing tooltip */}
            <div className="relative flex flex-col items-center gap-1">
              <button
                onClick={handleDashboardRedirect}
                disabled={isSyncing}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-full border transition-all active:scale-95 disabled:cursor-wait"
                style={{
                  background: "transparent",
                  borderColor: isSyncing ? "rgba(0,242,255,0.3)" : "#00f2ff",
                  color: isSyncing ? "rgba(0,242,255,0.5)" : "#00f2ff",
                }}
                onMouseEnter={(e) =>
                  !isSyncing &&
                  (e.currentTarget.style.boxShadow =
                    "0 0 18px rgba(0,242,255,0.45)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "none")
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                {isSyncing ? "Hold on..." : "Dashboard"}
              </button>

              {isSyncing && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 text-[10px] font-medium whitespace-nowrap px-3 py-1 rounded-full"
                  style={{
                    color: "#00f2ff",
                    background: "rgba(0,242,255,0.07)",
                    border: "1px solid rgba(0,242,255,0.2)",
                    textShadow: "0 0 6px rgba(0,242,255,0.6)",
                    zIndex: 60,
                  }}
                >
                  Ruk ja bhai... 🏃‍♂️
                </motion.span>
              )}
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 rounded-full",
                  avatarBoxRing: "ring-[#00f2ff]/40",
                },
              }}
            />
          </>
        ) : (
          /* ── Signed Out ──────────────────────────────────────────── */
          <Link
            href="/sign-in"
            className="px-6 py-2 font-bold rounded-full transition-all active:scale-95"
            style={{ background: "#00f2ff", color: "#050505" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 20px rgba(0,242,255,0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
