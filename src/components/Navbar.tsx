'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Search, MessageSquare, Calendar, User, LogOut, Menu, X, ChevronDown, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, bookings, messages, searchLocation, setSearchLocation, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  const unreadMessagesCount = messages.filter(m => m.sender === 'worker' && m.read).length ? 1 : 0;

  const locations = [
    'Ayyanthole, Thrissur',
    'Round South, Thrissur',
    'Punkunnam, Thrissur',
    'Ollur, Thrissur',
    'Viyyur, Thrissur',
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAF3F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#1F4E45] flex items-center justify-center text-[#E8A33D] shadow-md group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#2A2A2A] block leading-none">
                Daily<span className="text-[#1F4E45]">Connect</span>
              </span>
              <span className="text-[11px] font-medium text-[#8A8F8C] uppercase tracking-wider block mt-1">
                Verified Skilled Pros
              </span>
            </div>
          </Link>

          {/* Location Selector (Thrissur, Kerala) */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F5] border border-[#E5E7E5] text-xs font-medium text-[#2A2A2A] hover:bg-[#EAF3F0] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1F4E45]" />
              <span className="truncate max-w-[170px] font-semibold">{searchLocation}</span>
              <ChevronDown className="w-3 h-3 text-[#8A8F8C]" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-10 left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-[#8A8F8C] uppercase tracking-wider">
                  Select Thrissur Location
                </div>
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSearchLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F7F7F5] flex items-center justify-between ${
                      searchLocation === loc ? 'text-[#1F4E45] font-bold bg-[#EAF3F0]' : 'text-[#2A2A2A]'
                    }`}
                  >
                    <span>{loc}</span>
                    {searchLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#1F4E45]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/' ? 'text-[#1F4E45] font-bold' : 'text-[#2A2A2A] hover:text-[#1F4E45]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/search"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith('/search') ? 'text-[#1F4E45] font-bold' : 'text-[#2A2A2A] hover:text-[#1F4E45]'
              }`}
            >
              <Search className="w-4 h-4 text-[#8A8F8C]" />
              Find Skilled Workers
            </Link>

            <Link
              href="/chat"
              className={`text-sm font-semibold flex items-center gap-1.5 relative transition-colors ${
                pathname.startsWith('/chat') ? 'text-[#1F4E45] font-bold' : 'text-[#2A2A2A] hover:text-[#1F4E45]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#8A8F8C]" />
              In-App Chat
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-pulse" />
              )}
            </Link>

            <Link
              href="/my-bookings"
              className={`text-sm font-semibold flex items-center gap-1.5 relative transition-colors ${
                pathname.startsWith('/my-bookings') ? 'text-[#1F4E45] font-bold' : 'text-[#2A2A2A] hover:text-[#1F4E45]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#8A8F8C]" />
              My Bookings
              {activeBookingsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1F4E45] text-white rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* User Profile / Auth Action */}
          <div className="hidden lg:flex items-center gap-4">
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full border border-gray-200 hover:border-[#1F4E45] transition-colors"
                >
                  <span className="text-xs font-semibold text-[#2A2A2A]">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-[#1F4E45] text-white flex items-center justify-center text-xs font-bold shadow">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#2A2A2A]">{user.name}</p>
                      <p className="text-[11px] text-[#8A8F8C] truncate">{user.phone}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-[#2A2A2A] hover:bg-[#F7F7F5] flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#8A8F8C]" />
                      My Profile & Address
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-[#2A2A2A] hover:bg-[#F7F7F5] flex items-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#8A8F8C]" />
                      Booking History
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2.5 rounded-xl bg-[#E8A33D] text-[#2A2A2A] font-bold text-xs hover:bg-[#D6922C] transition-all duration-200 shadow-sm"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2A2A2A] hover:bg-[#F7F7F5]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-[#8A8F8C] uppercase mb-1">Location</p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F4E45]">
              <MapPin className="w-4 h-4 text-[#1F4E45]" />
              {searchLocation}
            </div>
          </div>

          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#2A2A2A] py-1"
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#2A2A2A] py-1 flex items-center justify-between"
            >
              <span>Search Workers</span>
              <Search className="w-4 h-4 text-[#8A8F8C]" />
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#2A2A2A] py-1 flex items-center justify-between"
            >
              <span>In-App Chat</span>
              <MessageSquare className="w-4 h-4 text-[#8A8F8C]" />
            </Link>
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#2A2A2A] py-1 flex items-center justify-between"
            >
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#1F4E45] text-white rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
