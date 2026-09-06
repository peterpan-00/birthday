"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";

export function AuthTestClient() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mau-dark text-mau-cream">
        <p className="text-sm font-sans animate-pulse">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-mau-dark text-mau-cream font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl bg-mau-surface/60 border border-mau-border/80 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="text-3xl">🎉</div>
        <h1 className="text-xl font-bold text-emerald-400">Google authentication successful ✅</h1>
        <div className="p-4 rounded-xl bg-mau-deep/60 border border-mau-border/40 text-left text-xs space-y-2">
          <p>
            <span className="text-mau-lavender/60">Logged in as:</span>{" "}
            <span className="font-semibold text-mau-cream">{user?.primaryEmailAddress?.emailAddress ?? "Authenticated user"}</span>
          </p>
          <p>
            <span className="text-mau-lavender/60">Name:</span>{" "}
            <span className="font-semibold text-mau-cream">{user?.fullName ?? "User"}</span>
          </p>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: "/login" })}
          className="w-full py-3 rounded-xl bg-mau-rose text-mau-dark font-bold text-sm hover:bg-mau-blush transition shadow-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}