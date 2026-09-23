"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, X, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export function ExperienceFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden bot field

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please write a gentle thought or message.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          section: "Memory Journey Footer",
          honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsSuccess(true);
        setMessage("");
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-20 sm:py-32 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Subtle ambient warm glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#D99CA5]/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto flex flex-col items-center"
      >
        <span className="font-serif text-xs tracking-[0.3em] text-[#D9BF8A] uppercase block mb-3">
          A little something?
        </span>

        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5E9DE] mb-4">
          How was your journey?
        </h3>

        <p className="text-sm sm:text-base text-[#D4C3B7] font-sans max-w-md mb-8 leading-relaxed">
          If you have a thought, a memory, or a gentle note you&apos;d like to share, we would love to hear from you.
        </p>

        {/* Modal Trigger Button */}
        <button
          type="button"
          onClick={handleOpen}
          id="open-feedback-modal-btn"
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#271E29] to-[#382A3B] border border-[#D9BF8A]/50 text-[#F5E9DE] text-xs sm:text-sm font-medium tracking-wider uppercase shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#D9BF8A] hover:shadow-[0_20px_45px_rgba(217,191,138,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-[#D9BF8A] group-hover:scale-110 transition-transform" />
          <span>Send Feedback</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D99CA5]" />
        </button>
      </motion.div>

      {/* ── Feedback Modal Dialog ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#19141B]/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-[#271E29] border border-[#F5E9DE]/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-8 text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full text-[#D4C3B7] hover:text-[#F5E9DE] hover:bg-[#F5E9DE]/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              {isSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#D9BF8A]/15 border border-[#D9BF8A]/40 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-[#D9BF8A]" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#F5E9DE] mb-2">
                    Your note has been sent ✦
                  </h4>
                  <p className="text-sm text-[#D4C3B7] max-w-xs mb-6">
                    Thank you so much for sharing your warm words and gentle thoughts.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D99CA5] to-[#E5B1A3] text-[#19141B] font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="font-serif text-xs tracking-widest text-[#D9BF8A] uppercase block mb-1">
                      Direct Feedback
                    </span>
                    <h4
                      id="feedback-dialog-title"
                      className="font-serif text-xl sm:text-2xl font-bold text-[#F5E9DE]"
                    >
                      Share your thoughts ✦
                    </h4>
                  </div>

                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_feedback_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-[#D4C3B7] mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mau or a friend"
                      maxLength={100}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#19141B] border border-[#F5E9DE]/15 !text-[#F5E9DE] text-[#F5E9DE] text-sm placeholder-[#F5E9DE]/30 focus:outline-none focus:ring-2 focus:ring-[#D99CA5]/50 focus:border-[#D99CA5] transition"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-[#D4C3B7] mb-1.5">
                      Your Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="so we can reply back"
                      maxLength={150}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#19141B] border border-[#F5E9DE]/15 !text-[#F5E9DE] text-[#F5E9DE] text-sm placeholder-[#F5E9DE]/30 focus:outline-none focus:ring-2 focus:ring-[#D99CA5]/50 focus:border-[#D99CA5] transition"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-[#D4C3B7] mb-1.5">
                      Message <span className="text-[#D99CA5]">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share a thought, a memory, or how this experience made you feel…"
                      rows={5}
                      required
                      maxLength={5000}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#19141B] border border-[#F5E9DE]/15 !text-[#F5E9DE] text-[#F5E9DE] text-sm placeholder-[#F5E9DE]/30 focus:outline-none focus:ring-2 focus:ring-[#D99CA5]/50 focus:border-[#D99CA5] resize-none leading-relaxed transition"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-xs font-sans text-[#D4C3B7] hover:text-[#F5E9DE] transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D99CA5] via-[#E5B1A3] to-[#D9BF8A] text-[#19141B] font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
