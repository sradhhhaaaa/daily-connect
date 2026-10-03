export type WorkerCategory = 'Electrician' | 'Plumber' | 'Painter' | 'Carpenter';

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface DayAvailability {
  dayName: string; // e.g. 'Today', 'Tomorrow', 'Mon, Oct 6'
  dateStr: string;
  slots: string[];
}

export interface Worker {
  id: string;
  name: string;
  category: WorkerCategory;
  rating: number;
  reviewCount: number;
  hourlyRate: number; // in INR
  experienceYears: number;
  distanceKm: number;
  locationName: string;
  availability: 'Available Today' | 'Available Tomorrow' | 'Booked';
  verified: boolean;
  photoUrl: string;
  bio: string;
  phone: string;
  specializations: string[];
  portfolio: PortfolioItem[];
  availabilitySchedule: DayAvailability[];
}

export interface CategoryRating {
  punctuality: number;
  quality: number;
  cleanliness: number;
  behavior: number;
}

export interface Review {
  id: string;
  workerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  categoryRatings: CategoryRating;
  date: string;
  serviceType: string;
  comment: string;
}

export interface ChatMessage {
  id: string;
  workerId: string;
  sender: 'customer' | 'worker';
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  workerCategory: WorkerCategory;
  workerPhoto: string;
  workerPhone: string;
  serviceCategory: WorkerCategory;
  serviceSubtype: string;
  jobDescription: string;
  date: string;
  timeSlot: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  hourlyRate: number;
  estimatedHours: number;
  baseAmount: number;
  inspectionFee: number;
  platformFee: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMethod: 'Pay Cash / UPI After Service' | 'Card / Online Payment';
  createdAt: string;
  reviewSubmitted?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  isLoggedIn: boolean;
}
