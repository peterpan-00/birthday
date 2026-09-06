import { redirect } from "next/navigation";
import { checkAuthorization } from "@/lib/auth/authorization";

export default async function HomePage() {
  const { isAuthenticated, isAuthorized } = await checkAuthorization();

  if (!isAuthenticated) {
    redirect("/login");
  } else if (!isAuthorized) {
    redirect("/unauthorized");
  } else {
    redirect("/music");
  }
}

