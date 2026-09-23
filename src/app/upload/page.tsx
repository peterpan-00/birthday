import React from "react";
import { requireAuthorization } from "@/lib/auth/authorization";
import UploadClientPage from "./UploadClientPage";

/**
 * Server component: enforces Clerk authentication + allowlist authorization
 * before rendering the upload UI. Unauthenticated users are redirected to /login.
 * Unauthorized (not in allowlist) users are redirected to /unauthorized.
 */
export default async function UploadPage() {
  await requireAuthorization();
  return <UploadClientPage />;
}
