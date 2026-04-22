import { supabase } from './supabase'

// User Profile Operations
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_subscribed: boolean
  subscription_type: 'free' | 'premium' | 'pro'
  subscription_expires_at?: string
  credits_remaining: number
  total_generations: number
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  user_id: string
  partner1_image_url: string
  partner2_image_url: string
  result_image_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processing_started_at?: string
  processing_completed_at?: string
  error_message?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  plan_type: 'premium' | 'pro'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// User Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_uuid: userId })

  if (error) {
    console.error('Error fetching user stats:', error)
    return null
  }

  return data
}

// Generation Operations
export async function createGeneration(
  userId: string,
  partner1ImageUrl: string,
  partner2ImageUrl: string,
  metadata: Record<string, any> = {}
): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      partner1_image_url: partner1ImageUrl,
      partner2_image_url: partner2ImageUrl,
      metadata
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating generation:', error)
    return null
  }

  return data
}

export async function updateGeneration(
  generationId: string,
  updates: Partial<Generation>
): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .update(updates)
    .eq('id', generationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating generation:', error)
    return null
  }

  return data
}

export async function getUserGenerations(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Generation[]> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching user generations:', error)
    return []
  }

  return data || []
}

export async function getGeneration(generationId: string): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .single()

  if (error) {
    console.error('Error fetching generation:', error)
    return null
  }

  return data
}

// Subscription Operations
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }

  return data
}

export async function createSubscription(
  userId: string,
  subscriptionData: Partial<Subscription>
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      ...subscriptionData
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating subscription:', error)
    return null
  }

  return data
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription:', error)
    return null
  }

  return data
}

// Credit Operations
export async function deductUserCredits(userId: string, amount: number = 1): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      credits_remaining: supabase.raw(`credits_remaining - ${amount}`),
      total_generations: supabase.raw(`total_generations + 1`)
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error deducting user credits:', error)
    return false
  }

  return true
}

export async function addUserCredits(userId: string, amount: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      credits_remaining: supabase.raw(`credits_remaining + ${amount}`)
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error adding user credits:', error)
    return false
  }

  return true
}

// File Upload Operations
export async function uploadImage(
  file: File,
  bucket: string = 'images',
  folder: string = 'uploads'
): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrl
}

export async function deleteImage(
  fileName: string,
  bucket: string = 'images'
): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    console.error('Error deleting image:', error)
    return false
  }

  return true
}

// Feedback Operations
export async function createFeedback(
  userId: string,
  generationId: string | null,
  rating: number,
  comment: string,
  feedbackType: 'general' | 'bug_report' | 'feature_request' = 'general'
): Promise<boolean> {
  const { error } = await supabase
    .from('feedback')
    .insert({
      user_id: userId,
      generation_id: generationId,
      rating,
      comment,
      feedback_type: feedbackType
    })

  if (error) {
    console.error('Error creating feedback:', error)
    return false
  }

  return true
}
