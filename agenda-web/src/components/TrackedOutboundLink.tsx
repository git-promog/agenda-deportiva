"use client";

import { ExternalLink } from "lucide-react";
import { trackOutboundClick } from "@/lib/analytics";
import type { ReactNode } from "react";

interface TrackedOutboundLinkProps {
  href: string;
  destination: string;
  label: string;
  className?: string;
  children: ReactNode;
}

export default function TrackedOutboundLink({
  href,
  destination,
  label,
  className,
  children,
}: TrackedOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={() => trackOutboundClick(destination, { label })}
    >
      {children}
      <ExternalLink size={14} />
    </a>
  );
}
