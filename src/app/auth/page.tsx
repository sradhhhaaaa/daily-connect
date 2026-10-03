'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, Mail, ArrowRight, Lock, User, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { loginUser } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  const [nameInput, setNameInput] = useState('');
  const [phoneOrEmailInput, setPhoneOrEmailInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmailInput.trim()) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(phoneOrEmailInput, mode === 'signup' ? nameInput : undefined);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Top Brand Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1F4E45] to-[#E8A33D]" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1F4E45] text-[#E8A33D] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A2A2A]">
            {mode === 'login' ? 'Welcome Back to Daily Connect' : 'Create Customer Account'}
          </h1>
          <p className="text-xs text-[#8A8F8C]">
            {mode === 'login' ? 'Sign in to access your bookings & chats' : 'Join thousands of households booking verified pros'}
          </p>
        </div>

        {/* Login / Signup Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#F7F7F5] rounded-xl border border-gray-200 text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setOtpSent(false); }}
            className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-[#1F4E45] shadow-xs' : 'text-[#8A8F8C]'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setOtpSent(false); }}
            className={`py-2 rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-[#1F4E45] shadow-xs' : 'text-[#8A8F8C]'}`}
          >
            Register
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8F8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-semibold text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-1.5">
                {authMethod === 'phone' ? 'Mobile Phone Number' : 'Email Address'}
              </label>
              <div className="relative">
                {authMethod === 'phone' ? (
                  <Phone className="w-4 h-4 text-[#8A8F8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                ) : (
                  <Mail className="w-4 h-4 text-[#8A8F8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type={authMethod === 'phone' ? 'tel' : 'email'}
                  required
                  value={phoneOrEmailInput}
                  onChange={(e) => setPhoneOrEmailInput(e.target.value)}
                  placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'priya.sharma@example.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs font-semibold text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthMethod(authMethod === 'phone' ? 'email' : 'phone')}
                className="text-[11px] font-bold text-[#1F4E45] hover:underline"
              >
                Use {authMethod === 'phone' ? 'Email Address' : 'Phone Number'} instead
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Get Verification OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            <div className="bg-[#EAF3F0] p-3 rounded-xl text-center text-xs text-[#1F4E45] font-semibold border border-[#2B6B5E]/20">
              OTP sent to <strong>{phoneOrEmailInput}</strong>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-1.5">Enter 4-Digit OTP</label>
              <input
                type="text"
                maxLength={4}
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full text-center tracking-widest text-lg font-black py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1F4E45] hover:bg-[#183F38] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E8A33D]" />
              <span>Verify & Continue</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
