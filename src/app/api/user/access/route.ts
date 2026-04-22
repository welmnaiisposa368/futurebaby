import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserAccess } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get current user (in production, extract from JWT token)
    const user = await getCurrentUser('demo@example.com')
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Check user access
    const accessInfo = await checkUserAccess(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        is_subscribed: user.is_subscribed,
        subscription_type: user.subscription_type,
        subscription_expires_at: user.subscription_expires_at,
        total_spent: user.total_spent
      },
      access: accessInfo
    })

  } catch (error) {
    console.error('User access check error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to check user access'
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
