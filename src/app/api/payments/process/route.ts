import { NextRequest, NextResponse } from 'next/server'
import {
  savePaymentTransaction,
  getCurrentUser,
  processOneTimePayment,
  processMonthlySubscription,
  processFullYearPayment
} from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    // Validate payment data
    if (!paymentData.planType || !['one-time', 'monthly', 'full-year'].includes(paymentData.planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
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

    let transactionId: string
    let paypalTransactionId: string
    let amount: number

    if (paymentData.planType === 'monthly') {
      // Process monthly subscription
      if (!paymentData.subscriptionID) {
        return NextResponse.json(
          { error: 'Missing subscription ID' },
          { status: 400 }
        )
      }

      transactionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      paypalTransactionId = paymentData.subscriptionID
      amount = 12.90

      // Save payment transaction
      await savePaymentTransaction({
        id: transactionId,
        user_id: user.id,
        paypal_transaction_id: paypalTransactionId,
        paypal_subscription_id: paymentData.subscriptionID,
        plan_type: 'monthly',
        amount: amount,
        currency: 'USD',
        status: 'completed',
        metadata: {
          paypal_order_id: paymentData.orderID,
          subscription_period: 'monthly'
        }
      })

      // Activate subscription
      const updatedUser = await processMonthlySubscription(user.id)
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'Failed to activate subscription' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        planType: 'monthly',
        transaction_id: transactionId,
        subscription_expires_at: updatedUser.subscription_expires_at,
        user: {
          is_subscribed: updatedUser.is_subscribed,
          subscription_type: updatedUser.subscription_type,
          subscription_expires_at: updatedUser.subscription_expires_at
        }
      })

    } else if (paymentData.planType === 'full-year') {
      // Process full-year payment
      if (!paymentData.orderID || !paymentData.details) {
        return NextResponse.json(
          { error: 'Missing payment details for full-year payment' },
          { status: 400 }
        )
      }

      transactionId = `fy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      paypalTransactionId = paymentData.details.id || paymentData.orderID
      amount = 39.90

      // Save payment transaction
      await savePaymentTransaction({
        id: transactionId,
        user_id: user.id,
        paypal_transaction_id: paypalTransactionId,
        plan_type: 'full-year',
        amount: amount,
        currency: 'USD',
        status: 'completed',
        metadata: {
          paypal_order_id: paymentData.orderID,
          paypal_payer_id: paymentData.payerID,
          growth_stages_unlocked: 12
        }
      })

      // Activate full-year plan
      const updatedUser = await processFullYearPayment(user.id)
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'Failed to activate full-year plan' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        planType: 'full-year',
        transaction_id: transactionId,
        credits_granted: 12,
        user: {
          credits: updatedUser.credits,
          plan_type: updatedUser.plan_type,
          full_year_unlocked: updatedUser.full_year_unlocked
        }
      })

    } else {
      // Process one-time payment
      if (!paymentData.orderID || !paymentData.details) {
        return NextResponse.json(
          { error: 'Missing payment details for one-time payment' },
          { status: 400 }
        )
      }

      transactionId = `ot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      paypalTransactionId = paymentData.details.id || paymentData.orderID
      amount = 5.90

      // Save payment transaction
      await savePaymentTransaction({
        id: transactionId,
        user_id: user.id,
        paypal_transaction_id: paypalTransactionId,
        plan_type: 'one-time',
        amount: amount,
        currency: 'USD',
        status: 'completed',
        metadata: {
          paypal_order_id: paymentData.orderID,
          paypal_payer_id: paymentData.payerID,
          credits_granted: 1
        }
      })

      // Grant credits to user
      const updatedUser = await processOneTimePayment(user.id)
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'Failed to grant credits' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        planType: 'one-time',
        transaction_id: transactionId,
        credits_granted: 1,
        user: {
          credits: updatedUser.credits,
          plan_type: updatedUser.plan_type
        }
      })
    }

  } catch (error) {
    console.error('Payment processing error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process payment'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
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
