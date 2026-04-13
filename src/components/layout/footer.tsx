import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/gallery", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/technology", label: "Technology" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0F1A2A", color: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="https://tactileterrain.ca/wp-content/uploads/2023/05/Logo-W2.svg"
              alt="Tactile Terrain"
              width={140}
              height={40}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-white/60 max-w-xs">
              Precision 3D topographic maps and immersive geographic installations.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
              Studio
            </h4>
            <p className="text-sm text-white/60">qathet region</p>
            <p className="text-sm text-white/60">Coastal British Columbia, Canada</p>
            <a
              href="https://tactileterrain.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6CB4D4] hover:text-[#8CCCE8] transition-colors mt-2 inline-block"
            >
              Visit our Etsy Store →
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Tactile Terrain. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
