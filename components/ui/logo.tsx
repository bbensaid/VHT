"use client";

import { Tangent } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center justify-center mb-2">
      <div className="bg-white rounded-lg">
        {/* <Rotate3d size={48} color="#324b0b" />  */}
        <Tangent
          size={36}
          color="#609707"
          strokeWidth={2}
          absoluteStrokeWidth
          className="rotate-45"
        />
      </div>
    </div>
  );
}
