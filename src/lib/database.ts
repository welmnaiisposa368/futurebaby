// Database schema and operations for FutureBabe

export interface User {
  id: string
  email: string
  created_at: string
  is_subscribed: boolean
  subscription_type?: 'free' | 'one-time' | 'monthly' | 'full-year'
  subscription_expires_at?: string
  credits: number // For one-time purchases
  total_spent: number
  plan_type?: 'one-time' | 'monthly' | 'full-year'
  full_year_unlocked?: boolean // For full-year plan users
}

export interface PaymentTransaction {
  id: string
  user_id: string
  paypal_transaction_id: string
  paypal_subscription_id?: string
  plan_type: 'one-time' | 'monthly' | 'full-year'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  updated_at: string
  metadata?: {
    paypal_order_id?: string
    paypal_payer_id?: string
    credits_granted?: number
    subscription_period?: string
    growth_stages_unlocked?: number
  }
}

export interface GenerationResult {
  id: string
  user_id: string
  baby_image_url: string
  baby_audio_url: string
  parent1_image_name?: string
  parent2_image_name?: string
  processing_time: number
  status: 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  metadata?: {
    image1_size?: number
    image2_size?: number
    image1_type?: string
    image2_type?: string
    ai_model_version?: string
    confidence_score?: number
  }
}

// Mock database storage (in production, this would be a real database)
class MockDatabase {
  private users: Map<string, User> = new Map()
  private generations: Map<string, GenerationResult> = new Map()
  private payments: Map<string, PaymentTransaction> = new Map()

  // Initialize with demo user
  constructor() {
    this.users.set('demo@futurebabe.xyz', {
      id: 'user_demo',
      email: 'demo@futurebabe.xyz',
      created_at: new Date().toISOString(),
      is_subscribed: false,
      subscription_type: 'free',
      credits: 0,
      total_spent: 0
    })
  }

  // User operations
  async getUser(email: string): Promise<User | null> {
    return this.users.get(email) || null
  }

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      ...userData
    }
    this.users.set(user.email, user)
    return user
  }

  async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(email)
    if (!user) return null

    const updatedUser = { ...user, ...updates }
    this.users.set(email, updatedUser)
    return updatedUser
  }

  // Generation operations
  async saveGeneration(generationData: Omit<GenerationResult, 'created_at' | 'updated_at'>): Promise<GenerationResult> {
    const generation: GenerationResult = {
      ...generationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.generations.set(generation.id, generation)
    return generation
  }

  async getGeneration(id: string): Promise<GenerationResult | null> {
    return this.generations.get(id) || null
  }

  async getUserGenerations(userId: string, limit: number = 10): Promise<GenerationResult[]> {
    const userGenerations = Array.from(this.generations.values())
      .filter(gen => gen.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
    
    return userGenerations
  }

  async updateGeneration(id: string, updates: Partial<GenerationResult>): Promise<GenerationResult | null> {
    const generation = this.generations.get(id)
    if (!generation) return null

    const updatedGeneration = {
      ...generation,
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    this.generations.set(id, updatedGeneration)
    return updatedGeneration
  }

  async deleteGeneration(id: string): Promise<boolean> {
    return this.generations.delete(id)
  }

  // Payment operations
  async savePayment(paymentData: Omit<PaymentTransaction, 'created_at' | 'updated_at'>): Promise<PaymentTransaction> {
    const payment: PaymentTransaction = {
      ...paymentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.payments.set(payment.id, payment)
    return payment
  }

  async getPayment(id: string): Promise<PaymentTransaction | null> {
    return this.payments.get(id) || null
  }

  async getUserPayments(userId: string): Promise<PaymentTransaction[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  async updatePayment(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    const payment = this.payments.get(id)
    if (!payment) return null

    const updatedPayment = {
      ...payment,
      ...updates,
      updated_at: new Date().toISOString()
    }

    this.payments.set(id, updatedPayment)
    return updatedPayment
  }

  // User subscription operations
  async grantCredits(userId: string, credits: number): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return null

    const updatedUser = {
      ...user,
      credits: user.credits + credits
    }

    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async useCredit(userId: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user || user.credits <= 0) return null

    const updatedUser = {
      ...user,
      credits: user.credits - 1
    }

    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async activateSubscription(userId: string, type: 'monthly', expiresAt: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return null

    const updatedUser = {
      ...user,
      is_subscribed: true,
      subscription_type: type,
      subscription_expires_at: expiresAt,
      plan_type: type
    }

    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async activateFullYearPlan(userId: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return null

    const updatedUser = {
      ...user,
      plan_type: 'full-year' as const,
      full_year_unlocked: true,
      credits: user.credits + 12 // Grant 12 credits for all growth stages
    }

    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async activateOneTimePlan(userId: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return null

    const updatedUser = {
      ...user,
      plan_type: 'one-time' as const,
      credits: user.credits + 1 // Grant 1 credit
    }

    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async checkUserAccess(userId: string): Promise<{
    hasAccess: boolean,
    accessType: 'free' | 'credits' | 'subscription' | 'full-year',
    remaining?: number,
    planType?: string,
    fullYearUnlocked?: boolean
  }> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return { hasAccess: false, accessType: 'free' }

    // Check full-year plan
    if (user.full_year_unlocked) {
      return {
        hasAccess: true,
        accessType: 'full-year',
        remaining: user.credits,
        planType: user.plan_type,
        fullYearUnlocked: true
      }
    }

    // Check monthly subscription
    if (user.is_subscribed && user.subscription_expires_at) {
      const expiresAt = new Date(user.subscription_expires_at)
      if (expiresAt > new Date()) {
        return {
          hasAccess: true,
          accessType: 'subscription',
          planType: user.plan_type
        }
      }
    }

    // Check credits (one-time purchases)
    if (user.credits > 0) {
      return {
        hasAccess: true,
        accessType: 'credits',
        remaining: user.credits,
        planType: user.plan_type
      }
    }

    return { hasAccess: false, accessType: 'free' }
  }

  // Analytics operations
  async getGenerationStats(userId?: string): Promise<{
    total_generations: number
    successful_generations: number
    failed_generations: number
    average_processing_time: number
  }> {
    let generations = Array.from(this.generations.values())
    
    if (userId) {
      generations = generations.filter(gen => gen.user_id === userId)
    }

    const total = generations.length
    const successful = generations.filter(gen => gen.status === 'completed').length
    const failed = generations.filter(gen => gen.status === 'failed').length
    const avgProcessingTime = generations.length > 0 
      ? generations.reduce((sum, gen) => sum + gen.processing_time, 0) / generations.length 
      : 0

    return {
      total_generations: total,
      successful_generations: successful,
      failed_generations: failed,
      average_processing_time: Math.round(avgProcessingTime)
    }
  }

  // 更新用户订阅信息
  async updateUserSubscription(
    userId: string,
    subscriptionData: {
      subscription_type?: string
      subscription_status?: string
      expires_at?: Date
      credits_remaining?: number
      unlimited_generations?: boolean
      premium_features?: boolean
      paypal_payment_id?: string
      paypal_payment_type?: string
      last_payment_at?: string
    }
  ): Promise<User | null> {
    const user = this.users.get(userId)
    if (!user) return null

    // 更新用户数据
    const updatedUser = {
      ...user,
      ...subscriptionData,
      updated_at: new Date().toISOString()
    }

    this.users.set(userId, updatedUser)
    return updatedUser
  }
}

// Export singleton instance
export const db = new MockDatabase()

// Helper functions for common operations
export async function getCurrentUser(email: string = 'demo@futurebabe.xyz'): Promise<User | null> {
  return await db.getUser(email)
}

// 更新用户订阅信息
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    subscription_type?: string
    subscription_status?: string
    expires_at?: Date
    credits_remaining?: number
    unlimited_generations?: boolean
    premium_features?: boolean
    paypal_payment_id?: string
    paypal_payment_type?: string
    last_payment_at?: string
  }
): Promise<User | null> {
  return await db.updateUserSubscription(userId, subscriptionData)
}

export async function saveGenerationResult(
  generationData: {
    id: string
    baby_image_url: string
    baby_audio_url: string
    processing_time: number
    status: 'completed' | 'failed'
    metadata?: any
  },
  userId: string = 'user_demo'
): Promise<GenerationResult> {
  return await db.saveGeneration({
    ...generationData,
    user_id: userId
  })
}

export async function getUserGenerationHistory(userId: string = 'user_demo', limit: number = 10): Promise<GenerationResult[]> {
  return await db.getUserGenerations(userId, limit)
}

// Helper functions for payments
export async function savePaymentTransaction(paymentData: {
  id: string
  user_id: string
  paypal_transaction_id: string
  paypal_subscription_id?: string
  type: 'one-time' | 'subscription'
  amount: number
  currency: string
  status: 'completed'
  metadata?: any
}): Promise<PaymentTransaction> {
  return await db.savePayment(paymentData)
}

export async function getUserPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
  return await db.getUserPayments(userId)
}

export async function checkUserAccess(userId: string): Promise<{ hasAccess: boolean, accessType: 'free' | 'credits' | 'subscription', remaining?: number }> {
  return await db.checkUserAccess(userId)
}

export async function processOneTimePayment(userId: string): Promise<User | null> {
  return await db.activateOneTimePlan(userId)
}

export async function processMonthlySubscription(userId: string): Promise<User | null> {
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month from now
  return await db.activateSubscription(userId, 'monthly', expiresAt.toISOString())
}

export async function processFullYearPayment(userId: string): Promise<User | null> {
  return await db.activateFullYearPlan(userId)
}

export async function useGenerationCredit(userId: string): Promise<User | null> {
  return await db.useCredit(userId)
}

// SQL schema for production database (PostgreSQL/MySQL)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_type ENUM('free', 'one-time', 'monthly') DEFAULT 'free',
  subscription_expires_at TIMESTAMP NULL,
  credits INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  INDEX idx_email (email),
  INDEX idx_subscription (is_subscribed, subscription_expires_at),
  INDEX idx_credits (credits)
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  paypal_transaction_id VARCHAR(255) NOT NULL,
  paypal_subscription_id VARCHAR(255),
  type ENUM('one-time', 'subscription') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_paypal_transaction (paypal_transaction_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
);

-- Generation results table
CREATE TABLE generation_results (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  baby_image_url TEXT NOT NULL,
  baby_audio_url TEXT NOT NULL,
  parent1_image_name VARCHAR(255),
  parent2_image_name VARCHAR(255),
  processing_time INT NOT NULL,
  status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Generation analytics view
CREATE VIEW generation_analytics AS
SELECT 
  user_id,
  COUNT(*) as total_generations,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_generations,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_generations,
  AVG(processing_time) as average_processing_time,
  MAX(created_at) as last_generation_at
FROM generation_results 
GROUP BY user_id;
`
