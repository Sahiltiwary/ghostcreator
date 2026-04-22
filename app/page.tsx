"use client";

import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
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
            Ghost Create. <span className="text-neon-cyan">Auto Scale.</span>
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
            <button className="px-8 py-4 bg-neon-cyan text-midnight font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all active:scale-95">
              Start Building Now
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-95">
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
      <div className="relative z-10">
        <Features />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
