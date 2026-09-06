import { requireAuthorization } from "@/lib/auth/authorization";
import { AuthTestClient } from "@/components/auth/AuthTestClient";

export default async function AuthTestPage() {
  await requireAuthorization();
  return <AuthTestClient />;
}

