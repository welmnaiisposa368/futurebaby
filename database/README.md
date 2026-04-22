# FutureBabe Database Schema

This directory contains the PostgreSQL database schema and setup files for the FutureBabe application.

## Files

- `postgresql-schema.sql` - Complete database schema with tables, indexes, triggers, and views
- `sample-data.sql` - Sample data for development and testing
- `schema.sql` - Original Supabase-specific schema (legacy)

## Database Setup

### Prerequisites

- PostgreSQL 14+ installed
- Database user with CREATE privileges

### Quick Setup

1. **Create Database**
   ```sql
   CREATE DATABASE futurebabe;
   ```

2. **Run Schema**
   ```bash
   psql -d futurebabe -f postgresql-schema.sql
   ```

3. **Insert Sample Data (Optional)**
   ```bash
   psql -d futurebabe -f sample-data.sql
   ```

### Environment Variables

Set these environment variables in your application:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/futurebabe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=futurebabe
DB_USER=your_username
DB_PASSWORD=your_password
```

## Schema Overview

### Core Tables

#### Users
- **Purpose**: Store user accounts and subscription status
- **Key Fields**: email, name, password_hash, is_subscribed, credits_remaining
- **Features**: Email verification, password reset tokens, subscription tracking

#### Uploads
- **Purpose**: Store uploaded parent photos
- **Key Fields**: user_id, photo1_url, photo2_url, metadata
- **Features**: File size tracking, MIME type validation, metadata storage

#### Generations
- **Purpose**: Track AI baby generation requests and results
- **Key Fields**: user_id, upload_id, baby_image_url, baby_audio_url, status
- **Features**: Processing time tracking, quality scores, error handling

#### Payments
- **Purpose**: Track payment transactions
- **Key Fields**: user_id, amount, type, success, stripe_payment_id
- **Features**: Stripe integration, subscription and one-time payments

#### Blog Posts
- **Purpose**: Content management for blog
- **Key Fields**: slug, title, content, author_name, tags
- **Features**: SEO-friendly slugs, tag system, view counting

### Supporting Tables

- **user_sessions**: Authentication session management
- **user_preferences**: User settings and preferences
- **subscription_plans**: Available subscription tiers
- **user_subscriptions**: Active user subscriptions

### Custom Types

```sql
-- Payment types
CREATE TYPE payment_type AS ENUM ('one-time', 'subscription');

-- Subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- Generation status
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
```

### Key Features

#### Automatic Triggers
- **Updated timestamps**: Auto-update `updated_at` fields
- **Generation counting**: Auto-increment user generation counts
- **Subscription sync**: Auto-update user subscription status

#### Performance Indexes
- Email lookups (users)
- User-specific queries (uploads, generations, payments)
- Blog post SEO (slug, tags, published status)
- Session management (tokens, expiry)

#### Data Integrity
- Email format validation
- URL format validation
- Positive amount constraints
- Foreign key relationships with CASCADE deletes

### Views

#### user_dashboard_view
Aggregated user data for dashboard display:
```sql
SELECT * FROM user_dashboard_view WHERE id = $user_id;
```

#### generation_history_view
Complete generation history with upload details:
```sql
SELECT * FROM generation_history_view WHERE user_id = $user_id;
```

#### published_blog_posts_view
Published blog posts for public display:
```sql
SELECT * FROM published_blog_posts_view LIMIT 10;
```

## Common Queries

### User Management
```sql
-- Create new user
INSERT INTO users (email, name, password_hash) 
VALUES ('user@example.com', 'John Doe', '$2b$10$...');

-- Check subscription status
SELECT is_subscribed, subscription_expires_at 
FROM users WHERE email = 'user@example.com';

-- Update user credits
UPDATE users SET credits_remaining = credits_remaining - 1 
WHERE id = $user_id AND credits_remaining > 0;
```

### Generation Tracking
```sql
-- Create new generation
INSERT INTO generations (user_id, upload_id, status) 
VALUES ($user_id, $upload_id, 'pending');

-- Update generation status
UPDATE generations 
SET status = 'completed', 
    baby_image_url = $image_url,
    completed_at = CURRENT_TIMESTAMP,
    processing_time_ms = $processing_time
WHERE id = $generation_id;

-- Get user's generation history
SELECT * FROM generation_history_view 
WHERE user_id = $user_id 
ORDER BY created_at DESC;
```

### Payment Processing
```sql
-- Record successful payment
INSERT INTO payments (user_id, amount, type, success, stripe_payment_id)
VALUES ($user_id, 9.99, 'subscription', true, $stripe_id);

-- Get payment history
SELECT amount, type, success, created_at 
FROM payments 
WHERE user_id = $user_id 
ORDER BY created_at DESC;
```

## Maintenance

### Regular Tasks

1. **Clean expired sessions**
   ```sql
   SELECT cleanup_expired_sessions();
   ```

2. **Update blog view counts**
   ```sql
   UPDATE blog_posts SET view_count = view_count + 1 WHERE slug = $slug;
   ```

3. **Check subscription expiry**
   ```sql
   UPDATE users 
   SET is_subscribed = false, subscription_status = 'expired'
   WHERE subscription_expires_at < CURRENT_TIMESTAMP;
   ```

### Backup Strategy

```bash
# Full backup
pg_dump futurebabe > backup_$(date +%Y%m%d).sql

# Schema only
pg_dump --schema-only futurebabe > schema_backup.sql

# Data only
pg_dump --data-only futurebabe > data_backup.sql
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
2. **Session Management**: Implement token rotation and expiry
3. **Input Validation**: Validate all inputs before database insertion
4. **SQL Injection**: Use parameterized queries only
5. **Access Control**: Implement row-level security for multi-tenant scenarios

## Migration Strategy

When updating the schema:

1. Create migration files with timestamps
2. Test migrations on development data
3. Backup production before applying
4. Use transactions for rollback capability
5. Update application code to match schema changes

## Performance Monitoring

Monitor these key metrics:

- Query execution times
- Index usage statistics
- Connection pool utilization
- Table sizes and growth rates
- Lock contention and deadlocks

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
