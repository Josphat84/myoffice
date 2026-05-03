// components/Footer.tsx
'use client';

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-[#1e3a52]/80 backdrop-blur-md text-white border-t border-white/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#86BBD8] text-[#1e3a52] font-bold text-sm font-heading">
                O
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight font-heading">MyOffice</div>
                <div className="text-xs text-[#86BBD8]">by Ozech</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#9ab8cc]">
              Organise your business information elegantly — from personnel and assets to operations and compliance.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[#86BBD8]">
              Core Modules
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "Personnel", href: "/employees" },
                { label: "Assets", href: "/equipment" },
                { label: "Inventory", href: "/inventory" },
                { label: "Maintenance", href: "/maintenance" },
                { label: "Leaves", href: "/leaves" },
                { label: "SHEQ Inspections", href: "/sheq_inspection" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#9ab8cc] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Products */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[#86BBD8]">
              Other Products
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "Room Rental", href: "/roomRental" },
                { label: "Restaurant", href: "/restaurant" },
                { label: "Church", href: "/church" },
                { label: "Stores", href: "/stores" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#9ab8cc] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[#86BBD8]">
              Company
            </h4>
            <ul className="space-y-1.5 mb-4">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#9ab8cc] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-3 rounded-lg bg-[#86BBD8]/10 border border-[#86BBD8]/20">
              <p className="font-medium text-xs text-[#86BBD8] mb-1">Our Commitment</p>
              <p className="text-xs text-[#9ab8cc] leading-relaxed italic">
                "We organise information and present it elegantly."
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6a90aa]">
            © {new Date().getFullYear()} MyOffice is a product of Ozech Investments Pvt Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[#6a90aa]">
            Doing the Very Best · High Level of Polish · Lasting Impact
          </p>
        </div>
      </div>
    </footer>
  );
}
