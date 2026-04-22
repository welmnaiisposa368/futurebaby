-- FutureBabe Database Schema
-- This file contains all the SQL commands to set up the database structure

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create users profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_type TEXT DEFAULT 'free', -- 'free', 'one-time', 'monthly', 'yearly'
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  subscription_started_at TIMESTAMP WITH TIME ZONE, -- When subscription started
  credits_remaining INTEGER DEFAULT 0, -- Pay-as-you-go credits
  monthly_generations_used INTEGER DEFAULT 0, -- Track monthly usage for monthly plan
  monthly_reset_date TIMESTAMP WITH TIME ZONE, -- When monthly counter resets
  current_baby_month INTEGER DEFAULT 1, -- Current growth stage (1-12) for monthly subscribers
  baby_name TEXT, -- Optional baby name set by user
  next_unlock_date TIMESTAMP WITH TIME ZONE, -- When next month unlocks for monthly plan
  total_generations INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00, -- Track total spending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generations table to store AI generation history
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  partner1_image_url TEXT NOT NULL,
  partner2_image_url TEXT NOT NULL,
  result_image_url TEXT,
  result_voice_url TEXT, -- Baby voice message URL
  baby_age_months INTEGER DEFAULT 1, -- Which month stage (1-12)
  baby_message_to_parents TEXT, -- AI-generated message from baby to parents
  baby_diary_entry TEXT, -- AI-generated baby diary entry
  generation_type TEXT DEFAULT 'standard', -- 'standard', 'growth_stage', 'monthly_update'
  is_monthly_unlock BOOLEAN DEFAULT FALSE, -- True if this unlocked a new month
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  payment_type TEXT, -- 'credits', 'one-time', 'monthly', 'yearly'
  credits_used INTEGER DEFAULT 1, -- How many credits this generation used
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}', -- Store additional data like AI model used, parameters, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table for payment tracking
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  paypal_subscription_id TEXT UNIQUE,
  paypal_payer_id TEXT,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid', 'completed'
  plan_type TEXT NOT NULL, -- 'one-time', 'monthly', 'yearly'
  amount DECIMAL(10,2) NOT NULL, -- Amount paid
  currency TEXT DEFAULT 'USD',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_purchases table for pay-as-you-go tracking
CREATE TABLE IF NOT EXISTS public.credit_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  paypal_payment_id TEXT UNIQUE NOT NULL,
  paypal_payer_id TEXT,
  credits_purchased INTEGER NOT NULL, -- Number of credits bought
  amount_paid DECIMAL(10,2) NOT NULL, -- Amount paid
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table for user feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES public.generations(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  feedback_type TEXT DEFAULT 'general', -- 'general', 'bug_report', 'feature_request'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON public.users(is_subscribed, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON public.generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generations_updated_at BEFORE UPDATE ON public.generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Users can only see and edit their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only see their own generations
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations" ON public.generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations" ON public.generations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_generations', COALESCE(COUNT(g.id), 0),
    'completed_generations', COALESCE(COUNT(g.id) FILTER (WHERE g.status = 'completed'), 0),
    'pending_generations', COALESCE(COUNT(g.id) FILTER (WHERE g.status IN ('pending', 'processing')), 0),
    'credits_remaining', COALESCE(u.credits_remaining, 0),
    'is_subscribed', COALESCE(u.is_subscribed, false),
    'subscription_type', COALESCE(u.subscription_type, 'free')
  ) INTO result
  FROM public.users u
  LEFT JOIN public.generations g ON u.id = g.user_id
  WHERE u.id = user_uuid
  GROUP BY u.id, u.credits_remaining, u.is_subscribed, u.subscription_type;
  
  RETURN COALESCE(result, '{"error": "User not found"}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
