import { cn } from "@/lib/utils";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  return <span className={cn("text-2xl", className)}>✻</span>;
}
