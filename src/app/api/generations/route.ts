import { NextRequest, NextResponse } from 'next/server'
import { getUserGenerationHistory, getCurrentUser } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId') || 'user_demo'

    // Validate limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Get current user (in production, extract from JWT token)
    const user = await getCurrentUser('demo@example.com')
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Get user's generation history
    const generations = await getUserGenerationHistory(user.id, limit)

    // Transform data for frontend
    const transformedGenerations = generations.map(gen => ({
      id: gen.id,
      babyImageURL: gen.baby_image_url,
      babyAudioURL: gen.baby_audio_url,
      created_at: gen.created_at,
      status: gen.status,
      processing_time: gen.processing_time,
      metadata: gen.metadata
    }))

    return NextResponse.json({
      generations: transformedGenerations,
      total: transformedGenerations.length,
      user_id: user.id
    }, { status: 200 })

  } catch (error) {
    console.error('Error in generations API:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch generation history'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
