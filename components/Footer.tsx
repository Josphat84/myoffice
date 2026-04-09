//Footer
//frontend/components/Footer.tsx

// components/Footer.tsx
'use client';

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-slate-900/90 to-slate-800/80 text-white border-t border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600/80 to-purple-600/80">
                <Database className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">MyOffice</span>
            </div>
            <p className="text-slate-300 text-sm">
              Database-driven office management platform
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Modules</h4>
            <ul className="space-y-2">
              <li><Link href="/employees" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Personnel</Link></li>
              <li><Link href="/leaves" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Leaves</Link></li>
              <li><Link href="/sheq_inspection" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">SHEQ Inspections</Link></li>
              <li><Link href="/work_stoppage" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Work Stoppage</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Other Products</h4>
            <ul className="space-y-2">
              <li><Link href="/roomRental" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Room Rental</Link></li>
              <li><Link href="/ecommerce" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">E-commerce</Link></li>
              <li><Link href="/restaurant" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Restaurant</Link></li>
              <li><Link href="/farm" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Farm</Link></li>
              <li><Link href="/stores" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Stores</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Privacy</Link></li>
              <li><Link href="/terms" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6 bg-slate-700" />
        
        <div className="text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MyOffice Management System is a product of Ozech Investments Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}