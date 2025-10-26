"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-4 pl-2", className)}>
      {/* Text section with Tailwind color classes */}
      <div className="flex flex-col">
        <div className="flex flex-col">
          <span
            className="font-extrabold text-[22px] leading-tight tracking-tight"
            style={{ color: "#1a365d" }}
          >
            Health Transformation
          </span>
          <span
            className="font-extrabold text-[22px] leading-tight tracking-tight"
            style={{ color: "#2c5282" }}
          >
            Review
          </span>
        </div>
        <p
          className="text-[13px] font-medium tracking-wide"
          style={{ color: "#4a5568" }}
        >
          Where Policy Meets Innovation
        </p>
      </div>
    </div>
  );
}
