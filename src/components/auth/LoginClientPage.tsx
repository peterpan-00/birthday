"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";

export function LoginClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, isLoaded } = useSignIn();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!isLoaded) {
        setErrorMessage("Authentication service is loading. Please try again in a moment.");
        setIsLoading(false);
        return;
      }

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        // Clerk must complete the OAuth exchange on its callback route before the
        // visitor is sent into the private experience.
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/music",
      });
    } catch (err: any) {
      console.error("Clerk Google Sign-In error:", err);
      setErrorMessage(
        err.errors?.[0]?.message || "Unable to initiate Google sign-in. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden bg-mau-dark text-mau-cream">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-tr from-mau-plum/30 via-mau-purple/20 to-mau-rose/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* Main Glass Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md p-6 xs:p-8 sm:p-10 rounded-2xl xs:rounded-3xl bg-mau-surface/60 border border-mau-border/80 shadow-[0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center z-10"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 xs:px-4 py-1.5 rounded-full bg-mau-deep/80 border border-mau-rose/40 text-mau-rose text-[11px] xs:text-xs font-semibold tracking-widest uppercase mb-6 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-mau-gold animate-spin-slow" />
          <span>Private Universe</span>
          <Heart className="w-3.5 h-3.5 fill-mau-rose text-mau-rose" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-mau-cream via-mau-peach to-mau-rose mb-4 leading-tight">
          A little surprise for you, Mau 👀❤️
        </h1>

        {/* Supporting Text */}
        <p className="font-serif italic text-xs xs:text-sm sm:text-base text-mau-lavender/80 mb-6 xs:mb-8 leading-relaxed max-w-xs mx-auto">
          “This little world is only for the people who are supposed to see it.”
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-mau-rose/10 border border-mau-rose/30 text-mau-rose text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Login CTA */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          id="google-signin-button"
          className="w-full flex items-center justify-center gap-2.5 xs:gap-3 px-4 xs:px-6 py-3.5 xs:py-4 rounded-xl xs:rounded-2xl bg-mau-cream hover:bg-white text-mau-dark font-sans font-semibold text-xs xs:text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group cursor-pointer"
        >
          {/* Official Google 'G' icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoading ? "Connecting to Google…" : "Continue with Google"}</span>
          <ArrowRight className="w-4 h-4 text-mau-dark/60 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Privacy Note */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-mau-cream/40">
          <Lock className="w-3 h-3 text-mau-rose/70" />
          <span>Encrypted • Private Family Memory Sanctuary</span>
        </div>
      </motion.div>
    </div>
  );
}
