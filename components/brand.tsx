"use client";

import { Logo } from "@/components/ui/logo";

export function Brand() {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold leading-tight tracking-tighter text-slate-800">
            Health
          </h1>
          <h1 className="text-xl font-bold leading-tight tracking-tighter text-slate-800">
            Transformation
          </h1>
          <h1 className="text-xl font-bold leading-tight tracking-tighter text-slate-800">
            Review
          </h1>
        </div>
        <Logo />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Where Policy Meets Innovation
      </p>
    </div>
  );
}
