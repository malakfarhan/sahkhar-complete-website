import type { CarCategory } from "@/data/cars";

export interface AdminCar {
  id: number;
  name: string;
  nameEn: string;
  category: CarCategory | string; // ✅  Arabic category
  categoryEn: string;  // ✅  English category
  dailyPrice: number;
  seats: number;
  transmission: string;
  fuel: string;
  year: number;
  features: string[];
  image: string;
  available: boolean;
  active: boolean;

  bookingSummary?: {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};
recentBookings?: {
  id: string;
  status: string;
  pickupDate: string;
  dropoffDate: string;
}[];
}

export interface AdminLocation {
  id: string;
  city: string;
  cityEn: string;
  branch: string;
  branchEn: string;
  address: string;
  addressEn: string;
  phone: string;
  hours: string;
  hoursEn: string;
  isMain: boolean;
  lat: number;
  lng: number;
  mapUrl: string;
  mapEmbed: string;
  description: string;
  descriptionEn: string;
  services: string[];
  active: boolean;
}

export interface AdminSlide {
  id: number;
  bg: string;
  badge: string;
  badgeEn: string;
  heading: string;
  headingEn: string;
  sub: string;
  subEn: string;
  ctaLabel: string;
  ctaLabelEn: string;
  ctaHref: string;
  cta2Label: string;
  cta2LabelEn: string;
  active: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  email: string;
  notes: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  days: number;
  carId: string;
  carName: string;
  carCategory: string;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export type Tab = "cars" | "locations" | "slides" | "users" | "bookings" | "logs";

export const CAR_CATEGORIES: string[] = ["اقتصادية", "عائلية", "فاخرة", "SUV", "ميني باص"];
export const CAR_CATEGORIES_EN: string[] = ["Economy", "Family", "Luxury", "SUV", "Minibus"];

export const ARABIC_TO_ENGLISH_CATEGORY: Record<string, string> = {
  "اقتصادية": "Economy",
  "عائلية": "Family",
  "فاخرة": "Luxury",
  "SUV": "SUV",
  "ميني باص": "Minibus",
};

export const ENGLISH_TO_ARABIC_CATEGORY: Record<string, string> = {
  "Economy": "اقتصادية",
  "Family": "عائلية",
  "Luxury": "فاخرة",
  "SUV": "SUV",
  "Minibus": "ميني باص",
};