// ============================================================
// Shared TypeScript types for Fixxedj – used by all clients
// ============================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export enum Role {
  CUSTOMER = "customer",
  WORKER   = "worker",
  ADMIN    = "admin",
}

export enum BookingStatus {
  PENDING     = "pending",
  ACCEPTED    = "accepted",
  EN_ROUTE    = "en_route",
  IN_PROGRESS = "in_progress",
  COMPLETED   = "completed",
  CANCELLED   = "cancelled",
  DISPUTED    = "disputed",
  REFUNDED    = "refunded",
}

export enum PaymentStatus {
  PENDING  = "pending",
  CAPTURED = "captured",
  FAILED   = "failed",
  REFUNDED = "refunded",
}

// ---------------------------------------------------------------------------
// Core entity types
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  phone: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  bio?: string;
  experience_years: number;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  latitude?: number;
  longitude?: number;
  kyc_verified: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  base_price: number;
  duration_minutes: number;
  icon_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  worker_id?: string;
  service_id: string;
  status: BookingStatus;
  address: string;
  latitude?: number;
  longitude?: number;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  total_amount: number;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  payer_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripe_payment_intent_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  provider_id?: string;
  rating: number; // 1–5
  comment?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// API response wrappers
// ---------------------------------------------------------------------------
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: "bearer";
}
