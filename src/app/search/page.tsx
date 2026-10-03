'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { WorkerCategory, Worker } from '../../types';
import { Search, Filter, Star, ShieldCheck, MapPin, MessageSquare, ArrowUpDown, RefreshCw, SlidersHorizontal, X } from 'lucide-react';

export default function SearchPage() {
  const { workers, searchCategory, setSearchCategory, searchLocation, searchQuery, setSearchQuery } = useApp();

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | 'All'>(searchCategory);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [todayOnly, setTodayOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');

  // Async Skeleton Loading simulation state
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Trigger loading effect on filter changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let result = [...workers];

      if (selectedCategory !== 'All') {
        result = result.filter(w => w.category === selectedCategory);
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        result = result.filter(w => 
          w.name.toLowerCase().includes(q) || 
          w.category.toLowerCase().includes(q) ||
          w.bio.toLowerCase().includes(q) ||
          w.specializations.some(s => s.toLowerCase().includes(q))
        );
      }

      result = result.filter(w => w.hourlyRate <= maxPrice);
      result = result.filter(w => w.distanceKm <= maxDistance);
      result = result.filter(w => w.rating >= minRating);

      if (todayOnly) {
        result = result.filter(w => w.availability === 'Available Today');
      }

      // Sorting
      if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price') {
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
      } else if (sortBy === 'distance') {
        result.sort((a, b) => a.distanceKm - b.distanceKm);
      }

      setFilteredWorkers(result);
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [workers, selectedCategory, searchQuery, maxPrice, maxDistance, minRating, todayOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(500);
    setMaxDistance(10);
    setMinRating(4.0);
    setTodayOnly(false);
    setSortBy('rating');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2A2A2A]">Find Verified Skilled Workers</h1>
          <p className="text-xs text-[#8A8F8C] mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1F4E45]" /> Showing available professionals around <span className="font-semibold text-[#2A2A2A]">{searchLocation}</span>
          </p>
        </div>

        {/* Live Search Input */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#8A8F8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by worker name, skill, or problem..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-medium text-[#2A2A2A] placeholder-[#8A8F8C] focus:outline-none focus:border-[#1F4E45]"
          />
        </div>
      </div>

      {/* Main Grid: Sticky Sidebar + Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* DESKTOP STICKY FILTER SIDEBAR */}
        <aside className="hidden lg:block sticky top-28 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#2A2A2A]">
              <SlidersHorizontal className="w-4 h-4 text-[#1F4E45]" /> Filter Results
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#8A8F8C] hover:text-[#1F4E45] flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block">Category</label>
            <div className="space-y-1.5">
              {(['All', 'Electrician', 'Plumber', 'Painter', 'Carpenter'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1F4E45] text-white'
                      : 'bg-[#F7F7F5] text-[#2A2A2A] hover:bg-[#EAF3F0]'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Skilled Pros' : `${cat}s`}</span>
                  <span className="text-[10px] opacity-80">
                    {cat === 'All' ? workers.length : workers.filter(w => w.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-[#2A2A2A]">
              <span>Max Hourly Rate</span>
              <span className="text-[#1F4E45]">₹{maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min={250}
              max={600}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1F4E45] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A8F8C]">
              <span>₹250</span>
              <span>₹600</span>
            </div>
          </div>

          {/* Distance Radius Slider */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-[#2A2A2A]">
              <span>Max Distance Radius</span>
              <span className="text-[#1F4E45]">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[#1F4E45] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A8F8C]">
              <span>1 km</span>
              <span>15 km</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block">Minimum Rating</label>
            <div className="grid grid-cols-3 gap-2">
              {[4.0, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border transition-colors ${
                    minRating === r
                      ? 'bg-[#E8A33D] text-[#2A2A2A] border-[#E8A33D]'
                      : 'bg-white text-[#2A2A2A] border-gray-200 hover:bg-[#F7F7F5]'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" /> {r}+
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-[#2A2A2A]">Available Today Only</span>
              <input
                type="checkbox"
                checked={todayOnly}
                onChange={(e) => setTodayOnly(e.target.checked)}
                className="w-4 h-4 accent-[#1F4E45] rounded cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* WORKER RESULTS CONTAINER */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar: Mobile filter button + Sort dropdown */}
          <div className="bg-white rounded-xl p-3 border border-gray-200/80 flex items-center justify-between">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-gray-200 text-xs font-bold text-[#2A2A2A]"
            >
              <Filter className="w-3.5 h-3.5 text-[#1F4E45]" /> Filters
            </button>

            <span className="text-xs font-semibold text-[#8A8F8C]">
              Showing <strong className="text-[#2A2A2A]">{filteredWorkers.length}</strong> verified professionals
            </span>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#8A8F8C] hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F7F7F5] border border-gray-200 text-xs font-bold text-[#2A2A2A] rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="rating">Rating (High to Low)</option>
                  <option value="price">Hourly Rate (Low to High)</option>
                  <option value="distance">Distance (Nearest First)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SKELETON LOADING STATE */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-6 animate-pulse">
                  <div className="w-24 h-24 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded w-full pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkers.length === 0 ? (
            /* EMPTY STATE VIEW */
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-[#FDF6EA] text-[#E8A33D] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#2A2A2A]">No Skilled Workers Match Your Filters</h3>
              <p className="text-xs text-[#8A8F8C] leading-relaxed">
                Try broadening your radius, increasing maximum price range, or clearing category filters to view more local technicians.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#1F4E45] text-white text-xs font-bold shadow-md hover:bg-[#183F38] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* WORKER CARDS LIST */
            <div className="space-y-4">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#1F4E45] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
                >
                  {/* Left: Photo & Info */}
                  <div className="flex items-start gap-4 sm:gap-5 flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={worker.photoUrl}
                        alt={worker.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 left-1 bg-[#1F4E45] text-white p-1 rounded-full shadow">
                        <ShieldCheck className="w-3 h-3 text-[#E8A33D]" />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4E45] bg-[#EAF3F0] px-2 py-0.5 rounded-md">
                          {worker.category}
                        </span>
                        <span className="text-xs font-semibold text-[#8A8F8C]">• {worker.experienceYears} yrs exp</span>
                        <span className="text-xs font-semibold text-[#8A8F8C]">• {worker.distanceKm} km away</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#2A2A2A] group-hover:text-[#1F4E45] transition-colors flex items-center gap-2">
                        {worker.name}
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2A2A2A] bg-[#FDF6EA] px-2 py-0.5 rounded-full border border-[#E8A33D]/30">
                          <Star className="w-3 h-3 text-[#E8A33D] fill-[#E8A33D]" /> {worker.rating}
                          <span className="text-[10px] text-[#8A8F8C]">({worker.reviewCount})</span>
                        </span>
                      </h3>

                      <p className="text-xs text-[#8A8F8C] line-clamp-2 leading-relaxed">
                        {worker.bio}
                      </p>

                      {/* Specialization Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {worker.specializations.slice(0, 3).map(spec => (
                          <span key={spec} className="text-[10px] font-medium text-[#2A2A2A] bg-[#F7F7F5] px-2 py-0.5 rounded-md">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Rate, Availability & Actions */}
                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-xl font-extrabold text-[#2A2A2A] block">
                        ₹{worker.hourlyRate}<span className="text-xs font-normal text-[#8A8F8C]">/hr</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                        worker.availability === 'Available Today'
                          ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                          : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                      }`}>
                        {worker.availability}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/chat?workerId=${worker.id}`}
                        className="px-3 py-2 rounded-xl bg-[#F7F7F5] border border-gray-200 hover:bg-[#EAF3F0] text-[#2A2A2A] text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#1F4E45]" /> Chat
                      </Link>
                      <Link
                        href={`/worker/${worker.id}`}
                        className="px-4 py-2 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] text-xs font-extrabold transition-colors shadow-xs"
                      >
                        View & Book
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM SHEET FILTERS MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-md bg-white h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#2A2A2A]">Filter Skilled Pros</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2A2A2A]">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {(['All', 'Electrician', 'Plumber', 'Painter', 'Carpenter'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border ${
                      selectedCategory === cat
                        ? 'bg-[#1F4E45] text-white border-[#1F4E45]'
                        : 'bg-[#F7F7F5] text-[#2A2A2A] border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Slider Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Hourly Rate</span>
                  <span>₹{maxPrice}/hr</span>
                </div>
                <input
                  type="range"
                  min={250}
                  max={600}
                  step={25}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1F4E45] mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Distance</span>
                  <span>{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-[#1F4E45] mt-2"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#E8A33D] text-[#2A2A2A] font-extrabold text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
