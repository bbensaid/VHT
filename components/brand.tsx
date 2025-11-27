"use client";

import { Logo } from "@/components/ui/logo";

export function Brand() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <Logo />
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight text-[#3e6204]">
          Health Transformation Review
        </h1>
        <p className="text-sm text-[#3e6204]">Where Policy Meets Innovation</p>
      </div>
    </div>
  );
}
