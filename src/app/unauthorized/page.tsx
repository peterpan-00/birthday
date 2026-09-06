"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldX, ArrowLeft } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();

  const handleBackToLogin = async () => {
    try {
      await signOut();
    } catch {}
    window.location.href = "/login";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-mau-plum/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-mau-surface/60 border border-mau-border/80 shadow-2xl backdrop-blur-2xl text-center z-10"
      >
        <div className="w-16 h-16 rounded-full bg-mau-plum/40 border border-mau-rose/30 flex items-center justify-center mx-auto mb-6 text-mau-rose shadow-lg">
          <ShieldX className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-mau-cream mb-3">
          Ooops… wrong door 😅
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-mau-lavender/80 mb-6">
          “This birthday universe is private.”
        </p>

        <p className="text-xs sm:text-sm text-mau-cream/60 font-sans leading-relaxed mb-8 max-w-xs mx-auto">
          This little digital corner was built specifically for Mau and her family.
        </p>

        <button
          onClick={handleBackToLogin}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-mau-rose hover:bg-mau-blush text-mau-dark font-sans font-semibold text-sm sm:text-base shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </button>
      </motion.div>
    </div>
  );
}
