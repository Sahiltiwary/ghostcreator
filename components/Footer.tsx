"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-24 pb-12 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-bold mb-6 tracking-tighter">GHOST CREATOR</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Building the next generation of personal branding through AI automation.
          </p>
        </div>
        
        <div>
          <h5 className="text-white font-medium mb-6">Product</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-medium mb-6">Company</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-neon-cyan transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-medium mb-6">Support</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">API Docs</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5">
        <div className="text-xs text-gray-600">
          Built by Sahil. © 2024 Ghost Creator Inc.
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_10px_#39ff14]" 
          />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status: Online</span>
        </div>
      </div>
    </footer>
  );
}
