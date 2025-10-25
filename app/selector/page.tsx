"use client";
import { ContributionSelector } from "@/components/contribution-selector";
import { RoleSelector } from "@/components/role-selector";
import { useState } from "react";

interface ContributionSelectorProps {
  role: "user" | "maintainer";
  onContinue: (contributions: string[]) => void;
}

export default function ProfilePage() {
  const handleRoleSelect = (role: "user" | "maintainer") => {
    console.log("Selected role:", role);
    // You can now render ContributionSelector or navigate
  };

  const handleContinue = () => {
    console.log("continued as something");
  };
  return <RoleSelector onRoleSelect={handleRoleSelect} />;
}
