-- 定价系统数据库迁移脚本
-- 在Supabase SQL编辑器中运行此脚本

-- 更新用户表，添加订阅和积分字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(20) DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_generations_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_generations_limit INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS paypal_subscription_id VARCHAR(255);

-- 创建订阅记录表
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('onetime', 'monthly', 'yearly')),
  amount DECIMAL(10,2) NOT NULL,
  paypal_subscription_id VARCHAR(255),
  paypal_order_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建积分交易记录表
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  credits_amount INTEGER NOT NULL,
  cost DECIMAL(10,2),
  paypal_order_id VARCHAR(255),
  description TEXT,
  generation_id UUID REFERENCES generations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新generations表，添加消费类型
ALTER TABLE generations ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'credits' CHECK (payment_type IN ('credits', 'subscription', 'free'));
ALTER TABLE generations ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_generations_payment_type ON generations(payment_type);

-- 启用行级安全策略
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- 创建函数：检查用户生成权限
CREATE OR REPLACE FUNCTION check_user_generation_access(user_uuid UUID)
RETURNS TABLE(
  has_access BOOLEAN,
  access_type VARCHAR(20),
  remaining_credits INTEGER,
  remaining_monthly_generations INTEGER
) AS $$
DECLARE
  user_record RECORD;
  active_subscription RECORD;
BEGIN
  -- 获取用户信息
  SELECT * INTO user_record FROM users WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'none'::VARCHAR(20), 0, 0;
    RETURN;
  END IF;
  
  -- 检查活跃订阅
  SELECT * INTO active_subscription 
  FROM subscriptions 
  WHERE user_id = user_uuid 
    AND status = 'active' 
    AND (end_date IS NULL OR end_date > NOW())
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- 如果有活跃订阅
  IF FOUND THEN
    IF active_subscription.plan_type = 'monthly' THEN
      -- 检查月度限制
      IF user_record.monthly_generations_used < user_record.monthly_generations_limit THEN
        RETURN QUERY SELECT true, 'subscription'::VARCHAR(20), user_record.credits, 
                           (user_record.monthly_generations_limit - user_record.monthly_generations_used);
      ELSE
        RETURN QUERY SELECT false, 'monthly_limit_reached'::VARCHAR(20), user_record.credits, 0;
      END IF;
    ELSE
      -- yearly 或 onetime 订阅
      RETURN QUERY SELECT true, 'subscription'::VARCHAR(20), user_record.credits, -1;
    END IF;
    RETURN;
  END IF;
  
  -- 检查积分
  IF user_record.credits > 0 THEN
    RETURN QUERY SELECT true, 'credits'::VARCHAR(20), user_record.credits, 0;
    RETURN;
  END IF;
  
  -- 没有访问权限
  RETURN QUERY SELECT false, 'no_access'::VARCHAR(20), 0, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：使用生成额度
CREATE OR REPLACE FUNCTION use_generation_quota(user_uuid UUID, gen_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  access_info RECORD;
  active_subscription RECORD;
BEGIN
  -- 检查访问权限
  SELECT * INTO access_info FROM check_user_generation_access(user_uuid);
  
  IF NOT access_info.has_access THEN
    RETURN false;
  END IF;
  
  -- 根据访问类型扣除额度
  IF access_info.access_type = 'credits' THEN
    -- 扣除积分
    UPDATE users SET credits = credits - 1 WHERE id = user_uuid;
    
    -- 记录积分使用
    INSERT INTO credit_transactions (user_id, transaction_type, credits_amount, description, generation_id)
    VALUES (user_uuid, 'usage', -1, 'Used for baby generation', gen_id);
    
    -- 更新generation记录
    UPDATE generations SET payment_type = 'credits' WHERE id = gen_id;
    
  ELSIF access_info.access_type = 'subscription' THEN
    -- 获取活跃订阅
    SELECT * INTO active_subscription 
    FROM subscriptions 
    WHERE user_id = user_uuid AND status = 'active' 
    ORDER BY created_at DESC LIMIT 1;
    
    IF active_subscription.plan_type = 'monthly' THEN
      -- 增加月度使用计数
      UPDATE users SET monthly_generations_used = monthly_generations_used + 1 WHERE id = user_uuid;
    END IF;
    
    -- 更新generation记录
    UPDATE generations SET payment_type = 'subscription', subscription_id = active_subscription.id WHERE id = gen_id;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：重置月度计数器（每月1号运行）
CREATE OR REPLACE FUNCTION reset_monthly_counters()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET monthly_generations_used = 0 
  WHERE subscription_status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 插入默认定价配置（可选）
INSERT INTO public.app_config (key, value) VALUES 
  ('pricing_onetime', '5.90'),
  ('pricing_monthly', '12.90'),
  ('pricing_yearly', '39.90'),
  ('pricing_credits_2', '8.90'),
  ('pricing_credits_5', '19.90'),
  ('pricing_credits_10', '39.90')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
