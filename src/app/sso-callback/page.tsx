"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/** Completes Clerk's OAuth redirect before returning the visitor to /music. */
export default function SsoCallbackPage() {
  return <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/music" />;
}
