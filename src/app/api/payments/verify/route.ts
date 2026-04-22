import { NextRequest, NextResponse } from 'next/server'
import { processPayPalPayment, isPayPalConfigured } from '@/lib/paypal-service'
import { getCurrentUser, updateUserSubscription } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // 检查 PayPal 配置
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      paymentType, // 'order' 或 'subscription'
      paymentId,   // orderID 或 subscriptionID
      planType,    // 'one-time', 'monthly', 'yearly', 'credits-2', 'credits-5', 'credits-10'
      userEmail
    } = body

    // 验证必需参数
    if (!paymentType || !paymentId || !planType || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // 验证用户存在
    const user = await getCurrentUser(userEmail)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 处理 PayPal 支付验证
    const result = await processPayPalPayment(
      paymentType as 'order' | 'subscription',
      paymentId,
      planType,
      userEmail
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      )
    }

    // 更新用户订阅状态
    const updatedUser = await updateUserSubscription(user.id, {
      subscription_type: result.updates.subscription_type,
      subscription_status: result.updates.subscription_status,
      expires_at: result.updates.expires_at,
      credits_remaining: result.updates.credits_remaining || user.credits_remaining,
      unlimited_generations: result.updates.unlimited_generations || false,
      premium_features: result.updates.premium_features || false,
      paypal_payment_id: paymentId,
      paypal_payment_type: paymentType,
      last_payment_at: new Date().toISOString()
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user subscription' },
        { status: 500 }
      )
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription updated',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        subscription_type: updatedUser.subscription_type,
        subscription_status: updatedUser.subscription_status,
        expires_at: updatedUser.expires_at,
        credits_remaining: updatedUser.credits_remaining,
        unlimited_generations: updatedUser.unlimited_generations,
        premium_features: updatedUser.premium_features
      },
      paymentDetails: {
        paymentId,
        paymentType,
        planType,
        verifiedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
