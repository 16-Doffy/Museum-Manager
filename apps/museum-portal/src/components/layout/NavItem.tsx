"use client";

import React from "react";

interface NavItemProps {
  label: string;
  active?: boolean;
}

export default function NavItem({ label, active }: NavItemProps) {
  return (
    <div
      className={`px-3 py-2 rounded flex items-center gap-3 cursor-pointer ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
        {label[0]}
      </div>
      <div className="font-medium">{label}</div>
    </div>
  );
}
