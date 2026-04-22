-- FutureBabe PostgreSQL Database Schema
-- Comprehensive schema for standalone PostgreSQL deployment
-- Created: 2025-01-27

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE payment_type AS ENUM ('one-time', 'subscription');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    subscription_status subscription_status DEFAULT 'pending',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    last_generation_date TIMESTAMP WITH TIME ZONE,
    generation_count INTEGER DEFAULT 0,
    credits_remaining INTEGER DEFAULT 3,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_name CHECK (LENGTH(name) >= 2),
    CONSTRAINT valid_credits CHECK (credits_remaining >= 0),
    CONSTRAINT valid_generation_count CHECK (generation_count >= 0)
);

-- =====================================================
-- UPLOADS TABLE
-- =====================================================
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photo1_url TEXT NOT NULL,
    photo2_url TEXT NOT NULL,
    photo1_filename VARCHAR(255),
    photo2_filename VARCHAR(255),
    photo1_size INTEGER,
    photo2_size INTEGER,
    photo1_mime_type VARCHAR(100),
    photo2_mime_type VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_photo_urls CHECK (
        photo1_url ~ '^https?://' AND 
        photo2_url ~ '^https?://'
    ),
    CONSTRAINT valid_file_sizes CHECK (
        (photo1_size IS NULL OR photo1_size > 0) AND
        (photo2_size IS NULL OR photo2_size > 0)
    )
);

-- =====================================================
-- GENERATIONS TABLE
-- =====================================================
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    upload_id UUID REFERENCES uploads(id) ON DELETE SET NULL,
    baby_image_url TEXT,
    baby_audio_url TEXT,
    status generation_status DEFAULT 'pending',
    processing_time_ms INTEGER,
    error_message TEXT,
    ai_model_version VARCHAR(50),
    generation_params JSONB DEFAULT '{}',
    quality_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_baby_urls CHECK (
        (baby_image_url IS NULL OR baby_image_url ~ '^https?://') AND
        (baby_audio_url IS NULL OR baby_audio_url ~ '^https?://')
    ),
    CONSTRAINT valid_processing_time CHECK (processing_time_ms >= 0),
    CONSTRAINT valid_quality_score CHECK (quality_score >= 0 AND quality_score <= 1)
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    type payment_type NOT NULL,
    success BOOLEAN DEFAULT FALSE,
    stripe_payment_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    payment_method VARCHAR(50),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_currency CHECK (LENGTH(currency) = 3)
);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    read_time_minutes INTEGER,
    tags TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT valid_read_time CHECK (read_time_minutes > 0),
    CONSTRAINT valid_cover_image CHECK (
        cover_image_url IS NULL OR cover_image_url ~ '^https?://'
    ),
    CONSTRAINT valid_view_count CHECK (view_count >= 0)
);

-- =====================================================
-- USER SESSIONS TABLE
-- =====================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    generation_notifications BOOLEAN DEFAULT TRUE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- =====================================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    interval_type VARCHAR(20) NOT NULL, -- 'month', 'year'
    interval_count INTEGER DEFAULT 1,
    credits_per_period INTEGER,
    stripe_price_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_interval CHECK (interval_type IN ('month', 'year')),
    CONSTRAINT valid_interval_count CHECK (interval_count > 0)
);

-- =====================================================
-- USER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    status subscription_status DEFAULT 'pending',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(is_subscribed, subscription_status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- Uploads table indexes
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_created_at ON uploads(created_at);

-- Generations table indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at);
CREATE INDEX idx_generations_upload_id ON generations(upload_id);
CREATE INDEX idx_generations_completed_at ON generations(completed_at);

-- Payments table indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_type ON payments(type);
CREATE INDEX idx_payments_success ON payments(success);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX idx_payments_stripe_subscription_id ON payments(stripe_subscription_id);

-- Blog posts table indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_email);

-- User sessions table indexes
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Subscription plans table indexes
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_stripe_price_id ON subscription_plans(stripe_price_id);

-- User subscriptions table indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user generation count and last generation date
CREATE OR REPLACE FUNCTION update_user_generation_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE users
        SET generation_count = generation_count + 1,
            last_generation_date = NEW.completed_at
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generation_stats_trigger
    AFTER UPDATE ON generations
    FOR EACH ROW EXECUTE FUNCTION update_user_generation_stats();

-- Function to update user subscription status
CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's subscription status based on their active subscriptions
    UPDATE users
    SET is_subscribed = EXISTS(
        SELECT 1 FROM user_subscriptions
        WHERE user_id = NEW.user_id
        AND status = 'active'
        AND current_period_end > CURRENT_TIMESTAMP
    ),
    subscription_status = NEW.status,
    subscription_expires_at = NEW.current_period_end
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_status_trigger
    AFTER INSERT OR UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_user_subscription_status();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user dashboard data
CREATE VIEW user_dashboard_view AS
SELECT
    u.id,
    u.email,
    u.name,
    u.is_subscribed,
    u.subscription_status,
    u.subscription_expires_at,
    u.generation_count,
    u.credits_remaining,
    u.last_generation_date,
    COUNT(g.id) as total_generations,
    COUNT(CASE WHEN g.status = 'completed' THEN 1 END) as completed_generations,
    COUNT(CASE WHEN g.status = 'pending' THEN 1 END) as pending_generations
FROM users u
LEFT JOIN generations g ON u.id = g.user_id
GROUP BY u.id, u.email, u.name, u.is_subscribed, u.subscription_status,
         u.subscription_expires_at, u.generation_count, u.credits_remaining,
         u.last_generation_date;

-- View for generation history with upload details
CREATE VIEW generation_history_view AS
SELECT
    g.id,
    g.user_id,
    g.baby_image_url,
    g.baby_audio_url,
    g.status,
    g.processing_time_ms,
    g.quality_score,
    g.created_at,
    g.completed_at,
    u.photo1_url,
    u.photo2_url,
    u.photo1_filename,
    u.photo2_filename
FROM generations g
LEFT JOIN uploads u ON g.upload_id = u.id
ORDER BY g.created_at DESC;

-- View for published blog posts
CREATE VIEW published_blog_posts_view AS
SELECT
    id,
    slug,
    title,
    summary,
    cover_image_url,
    author_name,
    read_time_minutes,
    tags,
    view_count,
    published_at
FROM blog_posts
WHERE is_published = TRUE
ORDER BY published_at DESC;
