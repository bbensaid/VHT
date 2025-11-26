"use client";

import { Orbit } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3 px-4 pt-2 pb-2">
      <div className="bg-white p-2 rounded-lg border border-[#609707]">
        {/* <Rotate3d size={48} color="#324b0b" />  */}
        <Orbit size={48} color="#609707" strokeWidth={3} />
      </div>
    </div>
  );
}
