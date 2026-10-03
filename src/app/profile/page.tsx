'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { GoogleAddressPicker } from '../../components/GoogleAddressPicker';
import { ShieldCheck, Calendar, LogOut, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, bookings, updateUserAddress, logoutUser } = useApp();

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-[#2A2A2A]">You are logged out</h2>
        <Link href="/auth" className="inline-block px-6 py-3 rounded-xl bg-[#E8A33D] text-[#2A2A2A] font-bold text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1F4E45] text-[#E8A33D] flex items-center justify-center font-black text-2xl shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2A2A2A] flex items-center gap-2">
              {user.name}
              <ShieldCheck className="w-5 h-5 text-[#1F4E45]" />
            </h1>
            <p className="text-xs text-[#8A8F8C] mt-1">{user.phone} • {user.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logoutUser();
            router.push('/');
          }}
          className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs flex items-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saved Addresses with Google Address Picker Pinpoint Map */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#2A2A2A] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#1F4E45]" /> Pinpoint Primary Address (Thrissur, Kerala)
          </h3>
          
          <GoogleAddressPicker
            value={user.address}
            coordinates={user.coordinates}
            onChange={(addr, coords) => updateUserAddress(addr, coords)}
          />
        </div>

        {/* Account Quick Stats */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4 h-fit">
          <h3 className="text-base font-bold text-[#2A2A2A] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1F4E45]" /> Account Summary
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-[#8A8F8C]">Total Bookings</span>
              <span className="font-bold text-[#2A2A2A]">{bookings.length} Orders</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-[#8A8F8C]">Default Region</span>
              <span className="font-bold text-[#1F4E45]">Thrissur, Kerala</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-[#8A8F8C]">Safety Guarantee</span>
              <span className="font-bold text-[#10B981]">Active</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#8A8F8C]">Customer Status</span>
              <span className="font-bold text-[#E8A33D]">Verified Daily Connect User</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
