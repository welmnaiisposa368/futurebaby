-- FutureBabe Sample Data
-- Insert sample data for development and testing
-- Created: 2025-01-27

-- =====================================================
-- SAMPLE SUBSCRIPTION PLANS
-- =====================================================

INSERT INTO subscription_plans (name, description, price, currency, interval_type, interval_count, credits_per_period, stripe_price_id) VALUES
('Free Plan', 'Get started with 3 free baby generations', 0.00, 'USD', 'month', 1, 3, NULL),
('Premium Monthly', 'Unlimited baby generations with premium features', 9.99, 'USD', 'month', 1, NULL, 'price_premium_monthly'),
('Premium Yearly', 'Unlimited baby generations with premium features (save 20%)', 95.99, 'USD', 'year', 1, NULL, 'price_premium_yearly'),
('Pro Plan', 'Advanced AI models and priority processing', 19.99, 'USD', 'month', 1, NULL, 'price_pro_monthly');

-- =====================================================
-- SAMPLE USERS
-- =====================================================

-- Note: In production, passwords should be properly hashed using bcrypt
INSERT INTO users (email, name, password_hash, is_subscribed, subscription_status, credits_remaining, email_verified) VALUES
('demo@futurebabe.xyz', 'Demo User', '$2b$10$example_hash_here', FALSE, 'pending', 3, TRUE),
('premium@futurebabe.xyz', 'Premium User', '$2b$10$example_hash_here', TRUE, 'active', 999, TRUE),
('test@example.com', 'Test User', '$2b$10$example_hash_here', FALSE, 'pending', 1, TRUE);

-- =====================================================
-- SAMPLE USER PREFERENCES
-- =====================================================

INSERT INTO user_preferences (user_id, email_notifications, marketing_emails, generation_notifications, preferred_language, timezone)
SELECT 
    id,
    TRUE,
    FALSE,
    TRUE,
    'en',
    'UTC'
FROM users;

-- =====================================================
-- SAMPLE UPLOADS
-- =====================================================

INSERT INTO uploads (user_id, photo1_url, photo2_url, photo1_filename, photo2_filename, photo1_size, photo2_size, photo1_mime_type, photo2_mime_type)
SELECT 
    u.id,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    'parent1.jpg',
    'parent2.jpg',
    245760,
    198432,
    'image/jpeg',
    'image/jpeg'
FROM users u
WHERE u.email = 'demo@futurebabe.xyz';

-- =====================================================
-- SAMPLE GENERATIONS
-- =====================================================

INSERT INTO generations (user_id, upload_id, baby_image_url, baby_audio_url, status, processing_time_ms, quality_score, ai_model_version, completed_at)
SELECT 
    u.id,
    up.id,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    'https://www.soundjay.com/misc/sounds/baby-cry.mp3',
    'completed',
    15420,
    0.92,
    'v2.1.0',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM users u
JOIN uploads up ON u.id = up.user_id
WHERE u.email = 'demo@futurebabe.xyz';

-- Add a pending generation
INSERT INTO generations (user_id, upload_id, status, ai_model_version, started_at)
SELECT 
    u.id,
    up.id,
    'processing',
    'v2.1.0',
    CURRENT_TIMESTAMP - INTERVAL '5 minutes'
FROM users u
JOIN uploads up ON u.id = up.user_id
WHERE u.email = 'premium@futurebabe.xyz';

-- =====================================================
-- SAMPLE PAYMENTS
-- =====================================================

INSERT INTO payments (user_id, amount, currency, type, success, stripe_payment_id, payment_method, description, processed_at)
SELECT 
    u.id,
    9.99,
    'USD',
    'subscription',
    TRUE,
    'pi_example_payment_id_123',
    'card',
    'Premium Monthly Subscription',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users u
WHERE u.email = 'premium@futurebabe.xyz';

-- =====================================================
-- SAMPLE USER SUBSCRIPTIONS
-- =====================================================

INSERT INTO user_subscriptions (user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
SELECT 
    u.id,
    sp.id,
    'sub_example_subscription_123',
    'active',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '29 days'
FROM users u
JOIN subscription_plans sp ON sp.name = 'Premium Monthly'
WHERE u.email = 'premium@futurebabe.xyz';

-- =====================================================
-- SAMPLE BLOG POSTS
-- =====================================================

INSERT INTO blog_posts (slug, title, summary, content, cover_image_url, author_name, author_email, read_time_minutes, tags, is_published, published_at) VALUES
(
    'ai-baby-prediction-technology',
    'The Science Behind AI Baby Prediction Technology',
    'Discover how artificial intelligence analyzes genetic patterns and facial features to predict what your future baby might look like.',
    '<h2>Understanding AI Baby Prediction</h2><p>Artificial intelligence has revolutionized many aspects of our lives, and now it''s helping expectant parents visualize their future children...</p>',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    'Dr. Sarah Chen',
    'sarah@futurebabe.xyz',
    5,
    ARRAY['AI', 'Technology', 'Genetics', 'Pregnancy'],
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'preparing-for-parenthood-guide',
    'The Complete Guide to Preparing for Parenthood',
    'Essential tips and advice for expectant parents on preparing emotionally, financially, and practically for your new arrival.',
    '<h2>Getting Ready for Your Little One</h2><p>Becoming a parent is one of life''s most significant transitions...</p>',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=400&fit=crop',
    'Emily Rodriguez',
    'emily@futurebabe.xyz',
    7,
    ARRAY['Parenting', 'Pregnancy', 'Planning', 'Family'],
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '1 week'
);

-- =====================================================
-- SAMPLE USER SESSIONS
-- =====================================================

INSERT INTO user_sessions (user_id, session_token, refresh_token, expires_at, ip_address, user_agent)
SELECT 
    u.id,
    'session_' || encode(gen_random_bytes(32), 'hex'),
    'refresh_' || encode(gen_random_bytes(32), 'hex'),
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    '192.168.1.100'::inet,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
FROM users u
WHERE u.email = 'demo@futurebabe.xyz';

-- =====================================================
-- UPDATE STATISTICS
-- =====================================================

-- Update user generation counts based on completed generations
UPDATE users 
SET generation_count = (
    SELECT COUNT(*) 
    FROM generations 
    WHERE user_id = users.id AND status = 'completed'
),
last_generation_date = (
    SELECT MAX(completed_at) 
    FROM generations 
    WHERE user_id = users.id AND status = 'completed'
);

-- Update blog post view counts
UPDATE blog_posts 
SET view_count = floor(random() * 1000) + 50
WHERE is_published = TRUE;
