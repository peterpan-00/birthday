import React from "react";
import { requireAuthorization } from "@/lib/auth/authorization";
import { BirthdayClientExperience } from "@/components/birthday/BirthdayClientExperience";

export default async function BirthdayPage() {
  await requireAuthorization();

  return <BirthdayClientExperience />;
}
