"use client";
import { ContributionSelector } from "@/components/contribution-selector";

interface ContributionSelectorProps {
  role: "user" | "maintainer";
  onContinue: (contributions: string[]) => void;
}

export default function ProfilePage() {
  const handleContinue = () => {
    console.log("continued as something");
  };
  return <ContributionSelector role="user" onContinue={handleContinue} />;
}
