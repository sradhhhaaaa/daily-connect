'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { ShieldCheck, Star, MapPin, Clock, Calendar, MessageSquare, ArrowLeft, CheckCircle2, Award, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

export default function WorkerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params?.id as string;
  const { workers, reviews } = useApp();

  const worker = workers.find(w => w.id === workerId) || workers[0];
  const workerReviews = reviews.filter(r => r.workerId === worker.id);

  // Active tab state: 'overview' | 'portfolio' | 'reviews' | 'schedule'
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'schedule'>('overview');
  
  // Lightbox modal state
  const [selectedImage, setSelectedImage] = useState<{ title: string; url: string; desc: string } | null>(null);

  // Rating breakdown math
  const fiveStars = workerReviews.filter(r => r.rating === 5).length;
  const fourStars = workerReviews.filter(r => r.rating === 4).length;
  const totalRev = workerReviews.length || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#8A8F8C] hover:text-[#1F4E45] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* WORKER HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#1F4E45] via-[#2B6B5E] to-[#E8A33D]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border-2 border-white shadow-md">
              <img
                src={worker.photoUrl}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1F4E45] text-white p-1 rounded-full shadow">
                <ShieldCheck className="w-4 h-4 text-[#E8A33D]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#1F4E45] bg-[#EAF3F0] px-3 py-1 rounded-full uppercase tracking-wider">
                  {worker.category}
                </span>
                <span className="text-xs font-semibold text-[#10B981] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Pro
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2A]">
                {worker.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#8A8F8C]">
                <span className="flex items-center gap-1 text-[#2A2A2A] font-bold bg-[#FDF6EA] px-2.5 py-1 rounded-full border border-[#E8A33D]/30">
                  <Star className="w-3.5 h-3.5 text-[#E8A33D] fill-[#E8A33D]" /> {worker.rating}
                  <span className="text-[#8A8F8C] font-normal">({worker.reviewCount} customer reviews)</span>
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1F4E45]" /> {worker.locationName} ({worker.distanceKm} km away)
                </span>

                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#1F4E45]" /> {worker.experienceYears} Years Exp
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Primary CTAs */}
          <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 gap-4">
            <div className="text-left md:text-right">
              <span className="text-xs text-[#8A8F8C] block">Standard Rate</span>
              <span className="text-3xl font-black text-[#2A2A2A]">
                ₹{worker.hourlyRate}<span className="text-xs font-medium text-[#8A8F8C]">/hr</span>
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href={`/chat?workerId=${worker.id}`}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 hover:bg-[#EAF3F0] text-[#2A2A2A] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#1F4E45]" /> Message
              </Link>
              <Link
                href={`/book/${worker.id}`}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-xs text-center transition-colors shadow-md"
              >
                Book Now
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* PROFILE TAB NAVIGATION */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview & Skills' },
            { key: 'portfolio', label: `Portfolio (${worker.portfolio.length})` },
            { key: 'reviews', label: `Customer Reviews (${workerReviews.length})` },
            { key: 'schedule', label: 'Availability Calendar' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 text-xs sm:text-sm font-extrabold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#1F4E45] text-[#1F4E45]'
                  : 'border-transparent text-[#8A8F8C] hover:text-[#2A2A2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT AREAS */}
      <div>
        
        {/* TAB 1: OVERVIEW & SKILLS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-[#2A2A2A]">About {worker.name}</h3>
                <p className="text-xs sm:text-sm text-[#8A8F8C] leading-relaxed">
                  {worker.bio}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#2A2A2A]">Specializations & Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {worker.specializations.map(spec => (
                    <div key={spec} className="flex items-center gap-2 p-3 rounded-xl bg-[#F7F7F5] border border-gray-200/60 text-xs font-semibold text-[#2A2A2A]">
                      <CheckCircle2 className="w-4 h-4 text-[#1F4E45] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Stats Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#2A2A2A]">Performance Metrics</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#8A8F8C]">Jobs Completed</span>
                  <span className="font-bold text-[#2A2A2A]">{worker.reviewCount * 2}+ Projects</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#8A8F8C]">Response Time</span>
                  <span className="font-bold text-[#10B981]">&lt; 15 mins</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#8A8F8C]">On-Time Arrival</span>
                  <span className="font-bold text-[#2A2A2A]">98% Track Record</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#8A8F8C]">Service Guarantee</span>
                  <span className="font-bold text-[#1F4E45]">30-Day Re-work Free</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO GALLERY & LIGHTBOX */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#2A2A2A]">Completed Projects Gallery</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worker.portfolio.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage({ title: item.title, url: item.imageUrl, desc: item.description })}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1">
                      <ImageIcon className="w-4 h-4" /> View Fullscreen
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-sm font-bold text-[#2A2A2A]">{item.title}</h4>
                    <p className="text-xs text-[#8A8F8C] line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER REVIEWS & TWO-WAY RATINGS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Overall Rating Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6 h-fit">
              <div className="text-center space-y-2">
                <span className="text-5xl font-black text-[#2A2A2A]">{worker.rating}</span>
                <div className="flex items-center justify-center gap-1 text-[#E8A33D]">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#8A8F8C]">Based on {workerReviews.length} verified ratings</p>
              </div>

              {/* Aspect Ratings */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Punctuality</span>
                    <span>4.9 / 5</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1F4E45] h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Work Quality</span>
                    <span>4.95 / 5</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1F4E45] h-full rounded-full" style={{ width: '99%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Cleanliness</span>
                    <span>4.85 / 5</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1F4E45] h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-[#2A2A2A]">Verified Customer Reviews</h3>

              {workerReviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-xs text-[#8A8F8C]">
                  No reviews submitted yet for this worker.
                </div>
              ) : (
                workerReviews.map(rev => (
                  <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1F4E45] text-white flex items-center justify-center font-bold text-xs">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#2A2A2A]">{rev.customerName}</h4>
                          <span className="text-[11px] text-[#8A8F8C]">{rev.serviceType} • {rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-[#FDF6EA] px-2.5 py-1 rounded-full text-xs font-bold text-[#2A2A2A] border border-[#E8A33D]/30">
                        <Star className="w-3.5 h-3.5 text-[#E8A33D] fill-[#E8A33D]" /> {rev.rating}.0
                      </div>
                    </div>

                    <p className="text-xs text-[#2A2A2A] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 4: AVAILABILITY CALENDAR PREVIEW */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#2A2A2A]">Weekly Slot Schedule</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {worker.availabilitySchedule.map(day => (
                <div key={day.dateStr} className="bg-[#F7F7F5] rounded-xl p-4 border border-gray-200 space-y-3">
                  <div className="pb-2 border-b border-gray-200">
                    <span className="text-sm font-bold text-[#1F4E45] block">{day.dayName}</span>
                    <span className="text-xs text-[#8A8F8C]">{day.dateStr}</span>
                  </div>

                  <div className="space-y-2">
                    {day.slots.map(slot => (
                      <Link
                        key={slot}
                        href={`/book/${worker.id}?date=${encodeURIComponent(day.dateStr)}&slot=${encodeURIComponent(slot)}`}
                        className="w-full block text-center py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#2A2A2A] hover:bg-[#1F4E45] hover:text-white transition-colors"
                      >
                        {slot}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-80 bg-gray-900">
              <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-bold text-[#2A2A2A]">{selectedImage.title}</h3>
              <p className="text-xs text-[#8A8F8C] leading-relaxed">{selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
