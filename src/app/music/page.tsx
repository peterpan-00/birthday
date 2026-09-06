import React from "react";
import { requireAuthorization } from "@/lib/auth/authorization";
import { MusicSelectionClientPage } from "@/components/music/MusicSelectionClientPage";

export default async function MusicSelectionPage() {
  await requireAuthorization();

  return <MusicSelectionClientPage />;
}
