'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, Mail, MapPin, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F4E45] text-white pt-16 pb-12 border-t border-[#183F38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8A33D] flex items-center justify-center text-[#1F4E45]">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Daily<span className="text-[#E8A33D]">Connect</span>
              </span>
            </div>
            
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
              Daily Connect bridges Kerala households with background-checked, verified local skilled professionals — electricians, plumbers, painters, and carpenters in Thrissur.
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#E8A33D] pt-2">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Award className="w-4 h-4" /> 100% Background Verified
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                Transparent Pricing
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li><Link href="/search?category=Electrician" className="hover:text-white transition-colors">Electricians</Link></li>
              <li><Link href="/search?category=Plumber" className="hover:text-white transition-colors">Plumbers</Link></li>
              <li><Link href="/search?category=Painter" className="hover:text-white transition-colors">Painters</Link></li>
              <li><Link href="/search?category=Carpenter" className="hover:text-white transition-colors">Carpenters</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li><Link href="/my-bookings" className="hover:text-white transition-colors">Track Bookings</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">Worker Chat Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Safety Guarantee</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider mb-4">Thrissur Helpline</h4>
            <div className="space-y-3 text-xs text-emerald-100/80">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#E8A33D]" />
                <span>+91 1800 200 9900 (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8A33D]" />
                <span>thrissur@dailyconnect.in</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8A33D]" />
                <span>Swaraj Round South, Thrissur, Kerala - 680001</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-100/60">
          <p>© {new Date().getFullYear()} Daily Connect Kerala Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Worker Verification Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
