"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/gallery", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/technology", label: "Technology" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled && "backdrop-blur-xl border-b border-white/10 shadow-lg"
        )}
        style={{ background: scrolled ? "rgba(15,26,42,0.95)" : "#0F1A2A" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          {/* Logo + brand text */}
          <Link href="/" className="relative z-50 flex items-center gap-3">
            <Image
              src="https://tactileterrain.ca/wp-content/uploads/2023/05/Logo-W2.svg"
              alt="Tactile Terrain"
              width={40}
              height={40}
              className="h-8 md:h-9 w-auto animate-[logoSpin_0.8s_ease-out_0.1s_both]"
              style={{ perspective: "400px" }}
              priority
            />
            <span className="text-white font-[family-name:var(--font-space-grotesk)] font-semibold text-base md:text-lg tracking-tight animate-[logoTextSlide_0.5s_ease-out_0.4s_both]">
              Tactile Terrain™
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button size="sm">Get in Touch</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 p-2 text-white"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#0F1A2A]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-[family-name:var(--font-space-grotesk)] font-medium text-white hover:text-[#6CB4D4] transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setMobileOpen(false)}>
          <Button size="lg">Get in Touch</Button>
        </Link>
      </div>
    </>
  );
}
