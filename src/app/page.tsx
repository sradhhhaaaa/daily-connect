'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { WorkerCategory } from '../types';
import { Search, MapPin, ShieldCheck, Star, Zap, Droplet, Paintbrush, Hammer, ArrowRight, MessageSquare, CheckCircle2, DollarSign, ThumbsUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { workers, searchCategory, setSearchCategory, searchLocation, setSearchLocation } = useApp();

  const [localCategory, setLocalCategory] = useState<WorkerCategory | 'All'>(searchCategory);
  const [localLocation, setLocalLocation] = useState<string>(searchLocation);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCategory(localCategory);
    setSearchLocation(localLocation);
    router.push('/search');
  };

  const categories = [
    { name: 'Electrician', icon: Zap, count: workers.filter(w => w.category === 'Electrician').length, desc: 'Wiring, MCBs, fixtures & smart setups' },
    { name: 'Plumber', icon: Droplet, count: workers.filter(w => w.category === 'Plumber').length, desc: 'Leakages, bathroom fittings & pipes' },
    { name: 'Painter', icon: Paintbrush, count: workers.filter(w => w.category === 'Painter').length, desc: 'Interior, Stucco textures & waterproofing' },
    { name: 'Carpenter', icon: Hammer, count: workers.filter(w => w.category === 'Carpenter').length, desc: 'Modular furniture, doors & custom wood' },
  ];

  const featuredWorkers = workers.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white via-[#F7F7F5] to-[#F7F7F5] pt-12 pb-20 overflow-hidden border-b border-[#EAF3F0]">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1F4E45_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Trust Pill Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF3F0] text-[#1F4E45] border border-[#2B6B5E]/20 text-xs font-bold shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F4E45]" />
              <span>100% Background-Verified Skilled Pros in Thrissur, Kerala</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2A2A2A] leading-[1.15]"
            >
              Connecting Homes with <span className="text-[#1F4E45] underline decoration-[#E8A33D] decoration-wavy decoration-2">Skilled Hands</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#8A8F8C] max-w-2xl mx-auto leading-relaxed"
            >
              Book trusted local electricians, plumbers, painters, and carpenters in Thrissur. Transparent hourly rates, instant chat, and live route tracking.
            </motion.p>

            {/* FRONT AND CENTER HERO SEARCH BAR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-200/80 max-w-2xl mx-auto"
            >
              <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-3">
                
                {/* Category Dropdown */}
                <div className="w-full sm:w-1/2 flex items-center gap-2 px-3 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200">
                  <WrenchIcon className="w-4 h-4 text-[#1F4E45] shrink-0" />
                  <select
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value as WorkerCategory | 'All')}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#2A2A2A] focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Skilled Services</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Painter">Painter</option>
                    <option value="Carpenter">Carpenter</option>
                  </select>
                </div>

                {/* Location Input with Kerala Placeholder */}
                <div className="w-full sm:w-1/2 flex items-center gap-2 px-3 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200">
                  <MapPin className="w-4 h-4 text-[#1F4E45] shrink-0" />
                  <input
                    type="text"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    placeholder="e.g., Ayyanthole, Thrissur"
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#2A2A2A] placeholder-[#8A8F8C] focus:outline-none"
                  />
                </div>

                {/* Submit Search CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </form>

              {/* Quick Thrissur Location Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-semibold text-[#8A8F8C]">
                <span>Popular Thrissur Hubs:</span>
                <button onClick={() => { setSearchLocation('Ayyanthole, Thrissur'); router.push('/search'); }} className="px-2.5 py-1 rounded-md bg-[#F7F7F5] hover:bg-[#EAF3F0] hover:text-[#1F4E45] transition-colors">📍 Ayyanthole</button>
                <button onClick={() => { setSearchLocation('Round South, Thrissur'); router.push('/search'); }} className="px-2.5 py-1 rounded-md bg-[#F7F7F5] hover:bg-[#EAF3F0] hover:text-[#1F4E45] transition-colors">📍 Round South</button>
                <button onClick={() => { setSearchLocation('Punkunnam, Thrissur'); router.push('/search'); }} className="px-2.5 py-1 rounded-md bg-[#F7F7F5] hover:bg-[#EAF3F0] hover:text-[#1F4E45] transition-colors">📍 Punkunnam</button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1F4E45] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#183F38]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-emerald-800/60">
            
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8A33D] text-[#1F4E45] flex items-center justify-center font-bold shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Verified Thrissur Pros</h3>
                <p className="text-xs text-emerald-100/80 mt-1">100% Aadhaar & background checked local professionals.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-[#E8A33D] text-[#1F4E45] flex items-center justify-center font-bold shrink-0 shadow-md">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Transparent Pricing</h3>
                <p className="text-xs text-emerald-100/80 mt-1">Upfront hourly rates. No hidden fees or unexpected surge charges.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-[#E8A33D] text-[#1F4E45] flex items-center justify-center font-bold shrink-0 shadow-md">
                <ThumbsUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Live Route Tracking</h3>
                <p className="text-xs text-emerald-100/80 mt-1">Directions API route animation with live ETA countdown to your doorstep.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2A]">Explore Skilled Categories</h2>
            <p className="text-xs sm:text-sm text-[#8A8F8C] mt-1">Find top-rated technicians available in your Thrissur neighborhood</p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-[#1F4E45] hover:text-[#183F38] flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  setSearchCategory(cat.name as WorkerCategory);
                  router.push('/search');
                }}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#1F4E45] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF3F0] text-[#1F4E45] flex items-center justify-center mb-4 group-hover:bg-[#1F4E45] group-hover:text-white transition-colors duration-200">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2A2A2A] group-hover:text-[#1F4E45] transition-colors">{cat.name}s</h3>
                  <p className="text-xs text-[#8A8F8C] mt-2 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-[#1F4E45] bg-[#EAF3F0] px-2.5 py-1 rounded-full">
                    {cat.count} Available Near You
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8A8F8C] group-hover:text-[#1F4E45] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider bg-[#FDF6EA] px-3 py-1 rounded-full border border-[#E8A33D]/20">
              Simple & Fast
            </span>
            <h2 className="text-3xl font-extrabold text-[#2A2A2A] mt-3">How Daily Connect Works</h2>
            <p className="text-xs sm:text-sm text-[#8A8F8C] mt-2">Get your home repair handled in 3 effortless steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="bg-[#F7F7F5] rounded-2xl p-8 border border-gray-200 text-center relative group hover:border-[#1F4E45] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#1F4E45] text-[#E8A33D] font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">Search & Compare</h3>
              <p className="text-xs text-[#8A8F8C] leading-relaxed">
                Filter verified electricians, plumbers, painters, and carpenters in Thrissur by hourly rate, distance, and genuine customer star ratings.
              </p>
            </div>

            <div className="bg-[#F7F7F5] rounded-2xl p-8 border border-gray-200 text-center relative group hover:border-[#1F4E45] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#1F4E45] text-[#E8A33D] font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">Chat & Pinpoint Address</h3>
              <p className="text-xs text-[#8A8F8C] leading-relaxed">
                Use built-in real-time chat to share issue descriptions and Google Places Autocomplete + Draggable Pin Map to drop your exact door pin.
              </p>
            </div>

            <div className="bg-[#F7F7F5] rounded-2xl p-8 border border-gray-200 text-center relative group hover:border-[#1F4E45] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#1F4E45] text-[#E8A33D] font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">Track & Review</h3>
              <p className="text-xs text-[#8A8F8C] leading-relaxed">
                Watch worker live route movement on Google Maps with ETA countdown. Pay after service completion and submit your authentic review.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED TOP-RATED WORKERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2A]">Top Rated Professionals in Thrissur</h2>
            <p className="text-xs sm:text-sm text-[#8A8F8C] mt-1">Highly rated skilled workers ready for immediate booking</p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-[#1F4E45] hover:text-[#183F38] flex items-center gap-1"
          >
            <span>See All Workers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={worker.photoUrl}
                    alt={worker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#1F4E45] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E8A33D]" /> Verified
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#2A2A2A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#E8A33D] fill-[#E8A33D]" /> {worker.rating}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1F4E45] bg-[#EAF3F0] px-2 py-0.5 rounded-md">
                      {worker.category}
                    </span>
                    <span className="text-xs font-semibold text-[#8A8F8C]">{worker.locationName.split(',')[0]}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#2A2A2A] group-hover:text-[#1F4E45] transition-colors">
                    {worker.name}
                  </h3>

                  <p className="text-xs text-[#8A8F8C] line-clamp-2 leading-relaxed">
                    {worker.bio}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <div>
                      <span className="text-xs text-[#8A8F8C] block">Hourly Rate</span>
                      <span className="text-base font-extrabold text-[#2A2A2A]">₹{worker.hourlyRate}<span className="text-xs font-medium text-[#8A8F8C]">/hr</span></span>
                    </div>
                    <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                      {worker.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F7F7F5] border-t border-gray-100 grid grid-cols-2 gap-2">
                <Link
                  href={`/chat?workerId=${worker.id}`}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-[#2A2A2A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#1F4E45]" /> Chat
                </Link>
                <Link
                  href={`/worker/${worker.id}`}
                  className="px-3 py-2 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] text-xs font-bold text-center transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
