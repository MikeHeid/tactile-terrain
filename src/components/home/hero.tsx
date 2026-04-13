"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TerrainHero } from "@/components/three/terrain-hero";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  tagline: string;
}

export function Hero({ tagline }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ background: "#0F1A2A", color: "#ffffff" }}>
      {/* Static gradient background — always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0F1A2A] to-[#162A3E]" />

      {/* WebGL terrain — renders on top if available */}
      <TerrainHero />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F1A2A]/30 to-[#0F1A2A]/70 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        <p className="text-[#6CB4D4] text-sm uppercase tracking-[0.3em] mb-6 font-medium">
          Precision Topographic Cartography
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)] text-white">
          {tagline}
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
          <Link href="/gallery">
            <Button size="lg">Explore Our Work</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );
}
