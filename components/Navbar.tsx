"use client";

import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-card mx-8 mt-6 rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <Ghost className="w-8 h-8 text-neon-cyan" />
        <span className="text-xl font-bold tracking-tighter text-white">
          GHOST <span className="text-neon-cyan">CREATOR</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="#" className="hover:text-neon-cyan transition-colors">Features</Link>
        <Link href="#" className="hover:text-neon-cyan transition-colors">Pricing</Link>
        <Link href="#" className="hover:text-neon-cyan transition-colors">Testimonials</Link>
        <Link href="#" className="hover:text-neon-cyan transition-colors">FAQ</Link>
      </div>

      <button className="px-6 py-2 bg-neon-cyan text-midnight font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all active:scale-95">
        Get Access
      </button>
    </motion.nav>
  );
}
