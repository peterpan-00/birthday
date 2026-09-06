import React from "react";
import { redirect } from "next/navigation";
import { checkAuthorization } from "@/lib/auth/authorization";
import { LoginClientPage } from "@/components/auth/LoginClientPage";

export default async function LoginPage() {
  const { isAuthenticated, isAuthorized } = await checkAuthorization();

  if (isAuthenticated) {
    redirect(isAuthorized ? "/music" : "/unauthorized");
  }

  return <LoginClientPage />;
}
