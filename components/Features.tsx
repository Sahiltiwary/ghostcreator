"use client";

import { motion } from "framer-motion";
import { Zap, Share2, Calendar } from "lucide-react";

const features = [
  {
    title: "Ghost Intelligence",
    description: "One-click AI video generation that captures your voice and style perfectly.",
    icon: Zap,
    color: "text-neon-cyan",
    glow: "hover:shadow-[0_0_30px_rgba(0,242,255,0.2)]",
  },
  {
    title: "Omni-Channel Sync",
    description: "Seamless posting to YouTube, Instagram, and TikTok with optimized metadata.",
    icon: Share2,
    color: "text-neon-purple",
    glow: "hover:shadow-[0_0_30px_rgba(188,19,254,0.2)]",
  },
  {
    title: "Shadow Scheduler",
    description: "Automated email and social scheduling that keeps your brand alive while you sleep.",
    icon: Calendar,
    color: "text-neon-cyan",
    glow: "hover:shadow-[0_0_30px_rgba(0,242,255,0.2)]",
  }
];

export default function Features() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className={`glass-card p-8 rounded-3xl transition-all duration-300 group ${feature.glow}`}
          >
            <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
