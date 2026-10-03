'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { Star, ShieldCheck, Calendar, Clock, MapPin, CheckCircle2, MessageSquare, AlertCircle, X, Radio } from 'lucide-react';

export default function MyBookingsPage() {
  const { bookings, markBookingCompleted, addReview } = useApp();

  // Active tracking booking selected (defaults to first confirmed booking)
  const confirmedBooking = bookings.find(b => b.status === 'Confirmed');
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(confirmedBooking?.id || null);

  // Rating Modal State
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);

  // Rating Form Inputs
  const [starRating, setStarRating] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [quality, setQuality] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [behavior, setBehavior] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const handleOpenReviewModal = (booking: Booking) => {
    setRatingBooking(booking);
    setStarRating(5);
    setPunctuality(5);
    setQuality(5);
    setCleanliness(5);
    setBehavior(5);
    setReviewComment('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingBooking) return;

    addReview({
      workerId: ratingBooking.workerId,
      rating: starRating,
      categoryRatings: {
        punctuality,
        quality,
        cleanliness,
        behavior,
      },
      serviceType: ratingBooking.serviceSubtype,
      comment: reviewComment || 'Great service! Arrived on time in Thrissur and completed the work cleanly.',
    });

    setRatingBooking(null);
  };

  const trackingTargetBooking = bookings.find(b => b.id === activeTrackingId) || confirmedBooking;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-[#2A2A2A]">My Bookings & Live Tracking</h1>
        <p className="text-xs text-[#8A8F8C] mt-1">Track worker arrival in real-time across Thrissur, Kerala and leave authentic two-way ratings.</p>
      </div>

      {/* SIMULATED LIVE WORKER TRACKING MAP SECTION */}
      {trackingTargetBooking && trackingTargetBooking.status === 'Confirmed' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#2A2A2A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#10B981] animate-pulse" /> Live Worker Arrival Tracking
            </h2>
            <span className="text-xs text-[#8A8F8C]">Booking #{trackingTargetBooking.id}</span>
          </div>

          <LiveTrackingMap
            workerName={trackingTargetBooking.workerName}
            workerCategory={trackingTargetBooking.workerCategory}
            workerPhoto={trackingTargetBooking.workerPhoto}
            customerAddress={trackingTargetBooking.address}
            customerCoords={trackingTargetBooking.coordinates || { lat: 10.5305, lng: 76.2045 }}
          />
        </section>
      )}

      {/* BOOKINGS LIST */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#2A2A2A]">All Booking Orders</h2>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs space-y-4">
            <Calendar className="w-12 h-12 text-[#8A8F8C] mx-auto" />
            <h3 className="text-lg font-bold text-[#2A2A2A]">No Bookings Found</h3>
            <p className="text-xs text-[#8A8F8C]">You have not booked any skilled professionals yet.</p>
            <Link
              href="/search"
              className="inline-block px-6 py-3 rounded-xl bg-[#1F4E45] text-white text-xs font-bold shadow-md"
            >
              Browse Skilled Workers
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all space-y-6 ${
                activeTrackingId === booking.id
                  ? 'border-[#1F4E45] ring-2 ring-[#1F4E45]/10 shadow-md'
                  : 'border-gray-200/80 shadow-sm'
              }`}
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <span className="text-xs font-bold text-[#8A8F8C] block">Booking #{booking.id}</span>
                  <span className="text-[11px] text-[#8A8F8C]">Created on {booking.createdAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'Confirmed'
                      ? 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                      : booking.status === 'Completed'
                      ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Status: {booking.status}
                  </span>

                  {/* SIMULATED STATUS SWITCHER BUTTON */}
                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => markBookingCompleted(booking.id)}
                      className="px-3 py-1 rounded-xl bg-[#1F4E45] text-white text-xs font-bold shadow-xs hover:bg-[#183F38] transition-colors"
                    >
                      ✓ Mark Service as Completed
                    </button>
                  )}
                </div>
              </div>

              {/* Booking Body */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  src={booking.workerPhoto}
                  alt={booking.workerName}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F4E45] bg-[#EAF3F0] px-2.5 py-0.5 rounded-md">
                      {booking.workerCategory}
                    </span>
                    <h3 className="text-lg font-bold text-[#2A2A2A]">{booking.workerName}</h3>
                  </div>

                  <p className="text-xs font-semibold text-[#2A2A2A]">
                    Sub-Service: <span className="text-[#8A8F8C]">{booking.serviceSubtype}</span>
                  </p>

                  <p className="text-xs text-[#8A8F8C]">
                    "{booking.jobDescription}"
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#8A8F8C] pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1F4E45]" /> {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1F4E45]" /> {booking.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1F4E45]" /> {booking.address}
                    </span>
                  </div>
                </div>

                {/* Amount & CTAs */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#8A8F8C] block">Total Amount</span>
                    <span className="text-2xl font-black text-[#2A2A2A]">₹{booking.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => setActiveTrackingId(booking.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          activeTrackingId === booking.id
                            ? 'bg-[#1F4E45] text-white border-[#1F4E45]'
                            : 'bg-white text-[#2A2A2A] border-gray-200 hover:bg-[#F7F7F5]'
                        }`}
                      >
                        📍 View Map
                      </button>
                    )}

                    <Link
                      href={`/chat?workerId=${booking.workerId}`}
                      className="px-3 py-2 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-bold text-[#2A2A2A] flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#1F4E45]" /> Chat
                    </Link>

                    {/* POST SERVICE REVIEW TRIGGER BUTTON */}
                    {booking.status === 'Completed' && (
                      <button
                        onClick={() => handleOpenReviewModal(booking)}
                        disabled={booking.reviewSubmitted}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-colors ${
                          booking.reviewSubmitted
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A]'
                        }`}
                      >
                        {booking.reviewSubmitted ? '✓ Rated & Reviewed' : '★ Rate & Review Worker'}
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* POST-SERVICE TWO-WAY RATING MODAL */}
      {ratingBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-[#2A2A2A]">Rate {ratingBooking.workerName}</h3>
                <p className="text-xs text-[#8A8F8C]">Post-Service Verified Rating ({ratingBooking.serviceSubtype})</p>
              </div>
              <button onClick={() => setRatingBooking(null)} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              
              {/* Overall Star Picker */}
              <div className="text-center space-y-2">
                <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block">Overall Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setStarRating(s)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${s <= starRating ? 'text-[#E8A33D] fill-[#E8A33D]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Evaluation Sliders */}
              <div className="bg-[#F7F7F5] rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A2A2A]">Punctuality: {punctuality}★</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={punctuality}
                    onChange={(e) => setPunctuality(Number(e.target.value))}
                    className="accent-[#1F4E45]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A2A2A]">Quality of Work: {quality}★</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="accent-[#1F4E45]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A2A2A]">Cleanliness & Cleanup: {cleanliness}★</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="accent-[#1F4E45]"
                  />
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">Write Your Customer Review</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience in Thrissur... (e.g. Arrived right on time, diagnosed the issue quickly, and cleaned up after work!)"
                  className="w-full p-4 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-medium text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1F4E45] hover:bg-[#183F38] text-white font-extrabold text-xs shadow-md"
              >
                Submit Verified Review
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
