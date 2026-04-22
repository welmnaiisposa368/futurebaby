import { supabase } from './supabase'
import { createGeneration, updateGeneration } from './database'

export interface GenerationRequest {
  partner1ImageUrl: string
  partner2ImageUrl: string
  userId: string
  options?: {
    style?: 'realistic' | 'cartoon' | 'artistic'
    age?: 'baby' | 'toddler' | 'child'
    gender?: 'auto' | 'male' | 'female'
  }
}

export interface GenerationResult {
  id: string
  imageUrl: string
  status: 'completed' | 'failed'
  error?: string
  metadata?: Record<string, any>
}

// Mock AI service - replace with actual AI API
class AIGenerationService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.example.com'
  }

  async generateBaby(request: GenerationRequest): Promise<GenerationResult> {
    // For now, this is a mock implementation
    // In production, this would call a real AI service like:
    // - Replicate API
    // - OpenAI DALL-E
    // - Midjourney API
    // - Custom trained model

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock successful generation
      const mockResult: GenerationResult = {
        id: `gen_${Date.now()}`,
        imageUrl: '/placeholder-baby.jpg', // This would be the actual generated image URL
        status: 'completed',
        metadata: {
          model: 'futurebaby-v1',
          style: request.options?.style || 'realistic',
          processingTime: 3000,
          timestamp: new Date().toISOString()
        }
      }

      return mockResult
    } catch (error) {
      return {
        id: `gen_${Date.now()}`,
        imageUrl: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async checkGenerationStatus(generationId: string): Promise<GenerationResult> {
    // Mock status check
    return {
      id: generationId,
      imageUrl: '/placeholder-baby.jpg',
      status: 'completed'
    }
  }
}

const aiService = new AIGenerationService()

// Main generation function that handles the complete workflow
export async function generateFutureBaby(
  userId: string,
  partner1ImageFile: File,
  partner2ImageFile: File,
  options?: GenerationRequest['options']
): Promise<{ generationId: string; error?: string }> {
  try {
    // Step 1: Upload images to storage
    const partner1Url = await uploadImageToStorage(partner1ImageFile, 'partner1')
    const partner2Url = await uploadImageToStorage(partner2ImageFile, 'partner2')

    if (!partner1Url || !partner2Url) {
      return { generationId: '', error: 'Failed to upload images' }
    }

    // Step 2: Create generation record in database
    const generation = await createGeneration(
      userId,
      partner1Url,
      partner2Url,
      { options }
    )

    if (!generation) {
      return { generationId: '', error: 'Failed to create generation record' }
    }

    // Step 3: Start AI processing (async)
    processGenerationAsync(generation.id, {
      partner1ImageUrl: partner1Url,
      partner2ImageUrl: partner2Url,
      userId,
      options
    })

    return { generationId: generation.id }
  } catch (error) {
    console.error('Error in generateFutureBaby:', error)
    return { 
      generationId: '', 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Async processing function
async function processGenerationAsync(
  generationId: string,
  request: GenerationRequest
) {
  try {
    // Update status to processing
    await updateGeneration(generationId, {
      status: 'processing',
      processing_started_at: new Date().toISOString()
    })

    // Call AI service
    const result = await aiService.generateBaby(request)

    // Update with result
    await updateGeneration(generationId, {
      status: result.status,
      result_image_url: result.imageUrl,
      processing_completed_at: new Date().toISOString(),
      error_message: result.error,
      metadata: result.metadata
    })

    // TODO: Send notification to user (email, push notification, etc.)
    
  } catch (error) {
    console.error('Error in processGenerationAsync:', error)
    
    // Update with error
    await updateGeneration(generationId, {
      status: 'failed',
      processing_completed_at: new Date().toISOString(),
      error_message: error instanceof Error ? error.message : 'Processing failed'
    })
  }
}

// Helper function to upload images to Supabase storage
async function uploadImageToStorage(
  file: File,
  prefix: string
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `generations/${prefix}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error)
    return null
  }
}

// Function to get generation status
export async function getGenerationStatus(generationId: string) {
  try {
    const generation = await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (generation.error) {
      return { error: 'Generation not found' }
    }

    return { generation: generation.data }
  } catch (error) {
    return { error: 'Failed to fetch generation status' }
  }
}

// Function to validate user can generate (has credits or subscription)
export async function canUserGenerate(userId: string): Promise<{ canGenerate: boolean; reason?: string }> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('credits_remaining, is_subscribed, subscription_expires_at')
      .eq('id', userId)
      .single()

    if (!user) {
      return { canGenerate: false, reason: 'User not found' }
    }

    // Check if user has active subscription
    if (user.is_subscribed && user.subscription_expires_at) {
      const expiresAt = new Date(user.subscription_expires_at)
      if (expiresAt > new Date()) {
        return { canGenerate: true }
      }
    }

    // Check if user has credits
    if (user.credits_remaining > 0) {
      return { canGenerate: true }
    }

    return { canGenerate: false, reason: 'No credits remaining. Please upgrade or purchase more credits.' }
  } catch (error) {
    return { canGenerate: false, reason: 'Failed to check user eligibility' }
  }
}
