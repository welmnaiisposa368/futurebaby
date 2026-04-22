// PayPal 服务端验证和处理

interface PayPalTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface PayPalOrderDetails {
  id: string
  status: string
  purchase_units: Array<{
    amount: {
      currency_code: string
      value: string
    }
    description: string
  }>
  payer: {
    email_address: string
    name: {
      given_name: string
      surname: string
    }
  }
}

interface PayPalSubscriptionDetails {
  id: string
  status: string
  plan_id: string
  subscriber: {
    email_address: string
    name: {
      given_name: string
      surname: string
    }
  }
}

// 获取 PayPal Access Token
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox'
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const baseUrl = environment === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data: PayPalTokenResponse = await response.json()
  return data.access_token
}

// 验证一次性支付订单
export async function verifyPayPalOrder(orderId: string): Promise<PayPalOrderDetails> {
  const accessToken = await getPayPalAccessToken()
  const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox'
  
  const baseUrl = environment === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to verify PayPal order')
  }

  return await response.json()
}

// 验证订阅
export async function verifyPayPalSubscription(subscriptionId: string): Promise<PayPalSubscriptionDetails> {
  const accessToken = await getPayPalAccessToken()
  const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox'
  
  const baseUrl = environment === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'

  const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to verify PayPal subscription')
  }

  return await response.json()
}

// 处理支付成功后的用户权限更新
export async function processPayPalPayment(
  paymentType: 'order' | 'subscription',
  paymentId: string,
  planType: string,
  userEmail: string
) {
  try {
    let paymentDetails: any
    
    if (paymentType === 'order') {
      paymentDetails = await verifyPayPalOrder(paymentId)
    } else {
      paymentDetails = await verifyPayPalSubscription(paymentId)
    }

    // 验证支付状态
    const isValidPayment = paymentType === 'order' 
      ? paymentDetails.status === 'COMPLETED'
      : paymentDetails.status === 'ACTIVE'

    if (!isValidPayment) {
      throw new Error('Payment not completed')
    }

    // 根据计划类型更新用户权限
    const updates = getPlanUpdates(planType)
    
    // 这里应该调用你的数据库服务来更新用户
    // await updateUserSubscription(userEmail, updates)
    
    return {
      success: true,
      planType,
      paymentDetails,
      updates
    }

  } catch (error) {
    console.error('PayPal payment processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }
  }
}

// 根据计划类型获取用户权限更新
function getPlanUpdates(planType: string) {
  switch (planType) {
    case 'one-time':
      return {
        subscription_type: 'onetime',
        subscription_status: 'active',
        monthly_generations_limit: 1,
        monthly_generations_used: 0,
        amount: 5.90,
        expires_at: null // 一次性购买不过期
      }

    case 'monthly':
      return {
        subscription_type: 'monthly',
        subscription_status: 'active',
        monthly_generations_limit: 3,
        monthly_generations_used: 0,
        amount: 12.90,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后续费
      }

    case 'yearly':
      return {
        subscription_type: 'yearly',
        subscription_status: 'active',
        monthly_generations_limit: 12,
        monthly_generations_used: 0,
        amount: 39.90,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365天后续费
      }

    case 'credits-2':
      return {
        credits_to_add: 2,
        amount: 8.90,
        transaction_type: 'purchase'
      }

    case 'credits-5':
      return {
        credits_to_add: 5,
        amount: 19.90,
        transaction_type: 'purchase'
      }

    case 'credits-10':
      return {
        credits_to_add: 10,
        amount: 39.90,
        transaction_type: 'purchase'
      }

    default:
      throw new Error('Invalid plan type')
  }
}

// 检查 PayPal 配置是否完整
export function isPayPalConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT
  )
}
