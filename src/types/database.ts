// FutureBabe Database Types
// TypeScript interfaces matching PostgreSQL schema
// Generated: 2025-01-27

// =====================================================
// ENUMS
// =====================================================

export type PaymentType = 'one-time' | 'subscription'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

// =====================================================
// CORE INTERFACES
// =====================================================

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  is_subscribed: boolean
  subscription_status: SubscriptionStatus
  subscription_expires_at?: Date
  last_generation_date?: Date
  generation_count: number
  credits_remaining: number
  avatar_url?: string
  email_verified: boolean
  email_verification_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  created_at: Date
  updated_at: Date
}

export interface Upload {
  id: string
  user_id: string
  photo1_url: string
  photo2_url: string
  photo1_filename?: string
  photo2_filename?: string
  photo1_size?: number
  photo2_size?: number
  photo1_mime_type?: string
  photo2_mime_type?: string
  metadata: Record<string, any>
  created_at: Date
}

export interface Generation {
  id: string
  user_id: string
  upload_id?: string
  baby_image_url?: string
  baby_audio_url?: string
  status: GenerationStatus
  processing_time_ms?: number
  error_message?: string
  ai_model_version?: string
  generation_params: Record<string, any>
  quality_score?: number
  created_at: Date
  started_at?: Date
  completed_at?: Date
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  type: PaymentType
  success: boolean
  stripe_payment_id?: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  payment_method?: string
  description?: string
  metadata: Record<string, any>
  created_at: Date
  processed_at?: Date
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary?: string
  content: string
  cover_image_url?: string
  author_name: string
  author_email?: string
  read_time_minutes?: number
  tags: string[]
  is_published: boolean
  view_count: number
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  refresh_token?: string
  expires_at: Date
  ip_address?: string
  user_agent?: string
  created_at: Date
  last_accessed_at: Date
}

export interface UserPreferences {
  id: string
  user_id: string
  email_notifications: boolean
  marketing_emails: boolean
  generation_notifications: boolean
  preferred_language: string
  timezone: string
  theme: string
  created_at: Date
  updated_at: Date
}

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  interval_type: string
  interval_count: number
  credits_per_period?: number
  stripe_price_id?: string
  is_active: boolean
  created_at: Date
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_subscription_id?: string
  status: SubscriptionStatus
  current_period_start?: Date
  current_period_end?: Date
  cancel_at_period_end: boolean
  created_at: Date
  updated_at: Date
}

// =====================================================
// VIEW INTERFACES
// =====================================================

export interface UserDashboardView {
  id: string
  email: string
  name: string
  is_subscribed: boolean
  subscription_status: SubscriptionStatus
  subscription_expires_at?: Date
  generation_count: number
  credits_remaining: number
  last_generation_date?: Date
  total_generations: number
  completed_generations: number
  pending_generations: number
}

export interface GenerationHistoryView {
  id: string
  user_id: string
  baby_image_url?: string
  baby_audio_url?: string
  status: GenerationStatus
  processing_time_ms?: number
  quality_score?: number
  created_at: Date
  completed_at?: Date
  photo1_url?: string
  photo2_url?: string
  photo1_filename?: string
  photo2_filename?: string
}

export interface PublishedBlogPostView {
  id: string
  slug: string
  title: string
  summary?: string
  cover_image_url?: string
  author_name: string
  read_time_minutes?: number
  tags: string[]
  view_count: number
  published_at?: Date
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateGenerationRequest {
  photo1_url: string
  photo2_url: string
  generation_params?: Record<string, any>
}

export interface UpdateGenerationRequest {
  status?: GenerationStatus
  baby_image_url?: string
  baby_audio_url?: string
  processing_time_ms?: number
  error_message?: string
  quality_score?: number
}

export interface CreatePaymentRequest {
  amount: number
  currency?: string
  type: PaymentType
  stripe_payment_id?: string
  payment_method?: string
  description?: string
}

export interface CreateBlogPostRequest {
  slug: string
  title: string
  summary?: string
  content: string
  cover_image_url?: string
  author_name: string
  author_email?: string
  read_time_minutes?: number
  tags?: string[]
  is_published?: boolean
}

export interface UpdateUserPreferencesRequest {
  email_notifications?: boolean
  marketing_emails?: boolean
  generation_notifications?: boolean
  preferred_language?: string
  timezone?: string
  theme?: string
}

// =====================================================
// DATABASE QUERY RESULT TYPES
// =====================================================

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface GenerationStats {
  total_generations: number
  completed_generations: number
  pending_generations: number
  failed_generations: number
  average_processing_time: number
  average_quality_score: number
}

export interface UserStats {
  total_users: number
  subscribed_users: number
  active_users_today: number
  active_users_week: number
  new_users_today: number
}

export interface PaymentStats {
  total_revenue: number
  monthly_revenue: number
  successful_payments: number
  failed_payments: number
  average_payment_amount: number
}

// =====================================================
// ERROR TYPES
// =====================================================

export interface DatabaseError {
  code: string
  message: string
  detail?: string
  hint?: string
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>
export type UpdateUser = Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>

export type CreateGeneration = Omit<Generation, 'id' | 'created_at' | 'started_at' | 'completed_at'>
export type UpdateGeneration = Partial<Omit<Generation, 'id' | 'user_id' | 'created_at'>>

export type CreatePayment = Omit<Payment, 'id' | 'created_at' | 'processed_at'>
export type UpdatePayment = Partial<Omit<Payment, 'id' | 'user_id' | 'created_at'>>

export type CreateBlogPost = Omit<BlogPost, 'id' | 'view_count' | 'created_at' | 'updated_at'>
export type UpdateBlogPost = Partial<Omit<BlogPost, 'id' | 'slug' | 'created_at' | 'updated_at'>>
