'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { GoogleAddressPicker } from '../../../components/GoogleAddressPicker';
import { ShieldCheck, Calendar, Clock, MapPin, CheckCircle, ArrowRight, ArrowLeft, Check } from 'lucide-react';

function BookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const workerId = params?.workerId as string;
  const initialDate = searchParams.get('date') || 'Oct 3, 2026';
  const initialSlot = searchParams.get('slot') || '02:00 PM - 04:00 PM';

  const { workers, user, createBooking } = useApp();
  const worker = workers.find(w => w.id === workerId) || workers[0];

  // Wizard Step State: 1 | 2 | 3 | 4
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [serviceSubtype, setServiceSubtype] = useState<string>(worker.specializations[0] || 'General Service');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [bookingAddress, setBookingAddress] = useState<string>(user.address);
  const [bookingCoords, setBookingCoords] = useState<{ lat: number; lng: number }>(user.coordinates || { lat: 10.5305, lng: 76.2045 });

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialSlot);
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<'Pay Cash / UPI After Service' | 'Card / Online Payment'>('Pay Cash / UPI After Service');

  // Completed Booking State
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Financial Calculations
  const baseAmount = worker.hourlyRate * estimatedHours;
  const inspectionFee = 0; // Waived
  const platformFee = 29;
  const totalAmount = baseAmount + inspectionFee + platformFee;

  const handleNextStep = () => {
    if (step === 1 && !jobDescription.trim()) {
      alert('Please enter a short description of the job before proceeding.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitBooking = () => {
    const booking = createBooking({
      workerId: worker.id,
      workerName: worker.name,
      workerCategory: worker.category,
      workerPhoto: worker.photoUrl,
      workerPhone: worker.phone,
      serviceCategory: worker.category,
      serviceSubtype,
      jobDescription,
      date: selectedDate,
      timeSlot: selectedSlot,
      address: bookingAddress,
      coordinates: bookingCoords,
      hourlyRate: worker.hourlyRate,
      estimatedHours,
      baseAmount,
      inspectionFee,
      platformFee,
      totalAmount,
      paymentMethod,
    });

    setConfirmedBookingId(booking.id);
    setStep(4);
  };

  return (
    <div className="space-y-8">
      {/* HEADER PROGRESS INDICATOR */}
      {step < 4 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#8A8F8C]">
            <span className={step >= 1 ? 'text-[#1F4E45]' : ''}>1. Service & Pinpoint Address</span>
            <span className={step >= 2 ? 'text-[#1F4E45]' : ''}>2. Date & Time</span>
            <span className={step >= 3 ? 'text-[#1F4E45]' : ''}>3. Price & Payment</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1F4E45] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: SERVICE DETAILS & GOOGLE ADDRESS PICKER */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <img src={worker.photoUrl} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h2 className="text-xl font-extrabold text-[#2A2A2A]">Book {worker.name}</h2>
              <p className="text-xs text-[#1F4E45] font-semibold">{worker.category} • ₹{worker.hourlyRate}/hr ({worker.locationName})</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">
                Select Service Sub-Category
              </label>
              <select
                value={serviceSubtype}
                onChange={(e) => setServiceSubtype(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-bold text-[#2A2A2A] focus:outline-none"
              >
                {worker.specializations.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">
                Describe Your Issue / Job Requirement
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. Living room MCB tripping whenever AC is switched on. Need immediate inspection and fuse check in Ayyanthole."
                className="w-full p-4 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs sm:text-sm font-medium text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
              />
            </div>

            {/* GOOGLE PLACES AUTOCOMPLETE + DRAGGABLE PIN MAP */}
            <div className="pt-2 border-t border-gray-100">
              <GoogleAddressPicker
                value={bookingAddress}
                coordinates={bookingCoords}
                onChange={(addr, coords) => {
                  setBookingAddress(addr);
                  setBookingCoords(coords);
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-xs flex items-center gap-2"
            >
              Next: Select Slot <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: DATE & TIME PICKER */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6"
        >
          <h2 className="text-xl font-extrabold text-[#2A2A2A]">Select Date & Time Slot</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">Available Days</label>
              <div className="grid grid-cols-3 gap-3">
                {['Oct 3, 2026', 'Oct 4, 2026', 'Oct 5, 2026'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedDate === d
                        ? 'bg-[#1F4E45] text-white border-[#1F4E45]'
                        : 'bg-[#F7F7F5] text-[#2A2A2A] border-gray-200 hover:bg-[#EAF3F0]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">Time Slot Grid</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['09:00 AM - 11:00 AM', '11:30 AM - 01:30 PM', '02:00 PM - 04:00 PM', '04:30 PM - 06:30 PM'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedSlot === s
                        ? 'bg-[#E8A33D] text-[#2A2A2A] border-[#E8A33D]'
                        : 'bg-white text-[#2A2A2A] border-gray-200 hover:bg-[#F7F7F5]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">Estimated Job Duration</label>
              <select
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-bold text-[#2A2A2A]"
              >
                <option value={1}>1 Hour (Quick Repair)</option>
                <option value={2}>2 Hours (Standard Service - Recommended)</option>
                <option value={3}>3 Hours (Detailed Work)</option>
                <option value={4}>4 Hours (Full Day Partial)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handlePrevStep}
              className="px-5 py-3 rounded-xl bg-[#F7F7F5] text-[#2A2A2A] font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-xs flex items-center gap-2"
            >
              Next: Pricing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: PRICE CONFIRMATION & PAYMENT */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6"
        >
          <h2 className="text-xl font-extrabold text-[#2A2A2A]">Review Order & Price Breakdown</h2>

          <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Base Rate (₹{worker.hourlyRate} × {estimatedHours} hrs)</span>
              <span className="font-bold text-[#2A2A2A]">₹{baseAmount}</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Visiting / Inspection Charge</span>
              <span className="font-bold text-[#10B981]">FREE (First Order)</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Safety & Platform Guarantee Fee</span>
              <span className="font-bold text-[#2A2A2A]">₹{platformFee}</span>
            </div>

            <div className="flex items-center justify-between text-base pt-2 font-black text-[#2A2A2A]">
              <span>Total Amount Payable</span>
              <span className="text-[#1F4E45] text-2xl">₹{totalAmount}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-2">Payment Option</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('Pay Cash / UPI After Service')}
                className={`p-4 rounded-xl text-left border text-xs font-bold transition-colors ${
                  paymentMethod === 'Pay Cash / UPI After Service'
                    ? 'bg-[#EAF3F0] text-[#1F4E45] border-[#1F4E45]'
                    : 'bg-white text-[#2A2A2A] border-gray-200'
                }`}
              >
                💳 Pay Cash / UPI After Service
                <span className="block text-[10px] font-normal text-[#8A8F8C] mt-1">Pay worker directly after service completion</span>
              </button>

              <button
                onClick={() => setPaymentMethod('Card / Online Payment')}
                className={`p-4 rounded-xl text-left border text-xs font-bold transition-colors ${
                  paymentMethod === 'Card / Online Payment'
                    ? 'bg-[#EAF3F0] text-[#1F4E45] border-[#1F4E45]'
                    : 'bg-white text-[#2A2A2A] border-gray-200'
                }`}
              >
                🔒 Instant Online Payment
                <span className="block text-[10px] font-normal text-[#8A8F8C] mt-1">Secure payment via UPI, Credit/Debit card</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handlePrevStep}
              className="px-5 py-3 rounded-xl bg-[#F7F7F5] text-[#2A2A2A] font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmitBooking}
              className="px-8 py-3.5 rounded-xl bg-[#1F4E45] hover:bg-[#183F38] text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              Confirm Booking <Check className="w-4 h-4 text-[#E8A33D]" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: ORDER CONFIRMED SCREEN */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#EAF3F0] text-[#1F4E45] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider bg-[#FDF6EA] px-3 py-1 rounded-full border border-[#E8A33D]/30">
              Booking Confirmed
            </span>
            <h1 className="text-3xl font-black text-[#2A2A2A]">Booking ID #{confirmedBookingId}</h1>
            <p className="text-xs text-[#8A8F8C]">
              {worker.name} will arrive at your address in <strong className="text-[#2A2A2A]">{bookingAddress.split(',')[0]}</strong> on <strong className="text-[#2A2A2A]">{selectedDate}</strong> between <strong className="text-[#2A2A2A]">{selectedSlot}</strong>.
            </p>
          </div>

          <div className="bg-[#F7F7F5] p-6 rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Service Worker</span>
              <span className="font-bold text-[#2A2A2A]">{worker.name} ({worker.category})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Service Address</span>
              <span className="font-bold text-[#2A2A2A] truncate max-w-[200px]">{bookingAddress}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-[#8A8F8C]">Total Amount</span>
              <span className="font-bold text-[#1F4E45]">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8A8F8C]">Live Tracking</span>
              <span className="font-bold text-[#10B981]">Active on My Bookings Screen</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/my-bookings"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1F4E45] text-white font-extrabold text-xs shadow-md"
            >
              View Live Tracking & My Bookings
            </Link>
            <Link
              href={`/chat?workerId=${worker.id}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F7F7F5] border border-gray-200 text-[#2A2A2A] font-bold text-xs"
            >
              Chat With {worker.name}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function BookingFlowPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<div className="p-12 text-center text-xs text-[#8A8F8C]">Loading booking wizard...</div>}>
        <BookingContent />
      </Suspense>
    </div>
  );
}
