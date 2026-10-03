'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Worker, Review, ChatMessage, Booking, UserProfile, WorkerCategory, CategoryRating } from '../types';
import { INITIAL_WORKERS, INITIAL_REVIEWS, INITIAL_MESSAGES, INITIAL_BOOKINGS } from '../data/mockData';

interface AppContextType {
  workers: Worker[];
  reviews: Review[];
  messages: ChatMessage[];
  bookings: Booking[];
  user: UserProfile;
  searchCategory: WorkerCategory | 'All';
  searchLocation: string;
  searchQuery: string;
  activeChatWorkerId: string | null;
  isTypingWorkerId: string | null;
  
  setSearchCategory: (cat: WorkerCategory | 'All') => void;
  setSearchLocation: (loc: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveChatWorkerId: (id: string | null) => void;
  updateUserAddress: (address: string, coordinates?: { lat: number; lng: number }) => void;
  
  addReview: (reviewData: {
    workerId: string;
    rating: number;
    categoryRatings: CategoryRating;
    serviceType: string;
    comment: string;
  }) => void;
  
  sendMessage: (workerId: string, text: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'reviewSubmitted'>) => Booking;
  markBookingCompleted: (bookingId: string) => void;
  loginUser: (phoneOrEmail: string, name?: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  
  const [searchCategory, setSearchCategory] = useState<WorkerCategory | 'All'>('All');
  const [searchLocation, setSearchLocation] = useState<string>('Ayyanthole, Thrissur');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activeChatWorkerId, setActiveChatWorkerId] = useState<string | null>('w1');
  const [isTypingWorkerId, setIsTypingWorkerId] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>({
    name: 'Priya Sharma',
    phone: '+91 98765 00000',
    email: 'priya.sharma@example.com',
    address: 'Flat 3B, Sobha City, Puzhakkal, Ayyanthole, Thrissur, Kerala - 680003',
    coordinates: { lat: 10.5305, lng: 76.2045 },
    isLoggedIn: true,
  });

  const updateUserAddress = (address: string, coordinates?: { lat: number; lng: number }) => {
    setUser(prev => ({
      ...prev,
      address,
      coordinates: coordinates || prev.coordinates,
    }));
  };

  const addReview = ({
    workerId,
    rating,
    categoryRatings,
    serviceType,
    comment,
  }: {
    workerId: string;
    rating: number;
    categoryRatings: CategoryRating;
    serviceType: string;
    comment: string;
  }) => {
    const newReview: Review = {
      id: `r_${Date.now()}`,
      workerId,
      customerName: user.name,
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating,
      categoryRatings,
      date: 'Just now',
      serviceType,
      comment,
    };

    setReviews(prev => [newReview, ...prev]);

    setWorkers(prev =>
      prev.map(w => {
        if (w.id === workerId) {
          const workerReviews = [...reviews.filter(r => r.workerId === workerId), newReview];
          const avg = workerReviews.reduce((acc, r) => acc + r.rating, 0) / workerReviews.length;
          return {
            ...w,
            rating: parseFloat(avg.toFixed(2)),
            reviewCount: w.reviewCount + 1,
          };
        }
        return w;
      })
    );

    setBookings(prev =>
      prev.map(b => (b.workerId === workerId && b.status === 'Completed' ? { ...b, reviewSubmitted: true } : b))
    );
  };

  const sendMessage = (workerId: string, text: string) => {
    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      workerId,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setIsTypingWorkerId(workerId);
    }, 1000);

    setTimeout(() => {
      setIsTypingWorkerId(null);
      const worker = workers.find(w => w.id === workerId);
      const cat = worker?.category || 'Worker';
      
      let replyText = `Namaskaram! Thanks for getting in touch. I am available to handle your ${cat.toLowerCase()} work in Thrissur.`;
      
      const lower = text.toLowerCase();
      if (lower.includes('today') || lower.includes('time') || lower.includes('free') || lower.includes('when')) {
        replyText = `Yes, I am available today in Thrissur! I can reach your location at ${searchLocation} within 30-45 minutes. Would you like to confirm the booking slot?`;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('charge')) {
        replyText = `My standard rate is ₹${worker?.hourlyRate || 350}/hour. For a standard inspection and repair, it usually takes 1 to 2 hours.`;
      } else if (lower.includes('photo') || lower.includes('leak') || lower.includes('mcb') || lower.includes('issue')) {
        replyText = `Got it! Please feel free to share photos of the site/issue so I can bring the exact spare parts and tools needed.`;
      } else {
        replyText = `Sounds good! I have noted your requirements. Click 'Book Now' to confirm your slot and I will arrive at your address with my toolkit as scheduled.`;
      }

      const workerMsg: ChatMessage = {
        id: `m_w_${Date.now()}`,
        workerId,
        sender: 'worker',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };

      setMessages(prev => [...prev, workerMsg]);
    }, 2800);
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'reviewSubmitted'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `DC-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Confirmed',
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      reviewSubmitted: false,
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const markBookingCompleted = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'Completed' } : b))
    );
  };

  const loginUser = (phoneOrEmail: string, name?: string) => {
    setUser({
      name: name || 'Priya Sharma',
      phone: phoneOrEmail.includes('@') ? '+91 98765 00000' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'priya.sharma@example.com',
      address: 'Flat 3B, Sobha City, Puzhakkal, Ayyanthole, Thrissur, Kerala - 680003',
      coordinates: { lat: 10.5305, lng: 76.2045 },
      isLoggedIn: true,
    });
  };

  const logoutUser = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  return (
    <AppContext.Provider
      value={{
        workers,
        reviews,
        messages,
        bookings,
        user,
        searchCategory,
        searchLocation,
        searchQuery,
        activeChatWorkerId,
        isTypingWorkerId,
        setSearchCategory,
        setSearchLocation,
        setSearchQuery,
        setActiveChatWorkerId,
        updateUserAddress,
        addReview,
        sendMessage,
        createBooking,
        markBookingCompleted,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
