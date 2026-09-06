import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthStatus {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  userId: string | null;
  email: string | null;
}

function normalizeEmail(email?: string | null): string {
  return email ? email.trim().toLowerCase() : "";
}

function isGoogleAccount(user: NonNullable<Awaited<ReturnType<typeof currentUser>>>): boolean {
  return user.externalAccounts.some(
    (account) =>
      (account.provider === "oauth_google" ||
        account.provider === "google" ||
        account.provider === "google_oauth2") &&
      normalizeEmail(account.emailAddress) === normalizeEmail(user.primaryEmailAddress?.emailAddress)
  );
}

/**
 * Server-side authorization check.
 * Verifies Clerk authentication and checks user's verified primary email
 * against the strict two-account allowlist (ALLOWED_GOOGLE_ACCOUNT_1, ALLOWED_GOOGLE_ACCOUNT_2).
 */
export async function checkAuthorization(): Promise<AuthStatus> {
  unstable_noStore();

  try {
    const { userId } = await auth();
    if (!userId) {
      return { isAuthenticated: false, isAuthorized: false, userId: null, email: null };
    }

    const user = await currentUser();
    if (!user) {
      console.error("[Auth] Clerk session exists but user data is unavailable", { userId });
      return { isAuthenticated: true, isAuthorized: false, userId, email: null };
    }

    const userEmail = normalizeEmail(user.primaryEmailAddress?.emailAddress);
    const isVerified = user.primaryEmailAddress?.verification?.status === "verified";
    if (!userEmail || !isVerified || !isGoogleAccount(user)) {
      return { isAuthenticated: true, isAuthorized: false, userId, email: null };
    }

    const allowedEmails = [
      normalizeEmail(process.env.ALLOWED_GOOGLE_ACCOUNT_1),
      normalizeEmail(process.env.ALLOWED_GOOGLE_ACCOUNT_2),
    ];
    const isAuthorized = allowedEmails.every(Boolean) && allowedEmails.includes(userEmail);

    return { isAuthenticated: true, isAuthorized, userId, email: userEmail };
  } catch (error) {
    console.error("[Auth] Clerk authorization check failed", error);
    return { isAuthenticated: false, isAuthorized: false, userId: null, email: null };
  }
}

/** Redirects before a protected Server Component can render any private content. */
export async function requireAuthorization(): Promise<AuthStatus> {
  const status = await checkAuthorization();

  if (!status.isAuthenticated) {
    redirect("/login");
  }

  if (!status.isAuthorized) {
    redirect("/unauthorized");
  }

  return status;
}
