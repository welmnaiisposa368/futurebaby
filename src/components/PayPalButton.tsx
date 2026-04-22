'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalButtonProps {
  planType: 'one-time' | 'monthly' | 'full-year'
  amount: number
  onSuccess: (details: any) => void
  onError: (error: any) => void
  onCancel?: () => void
}

export default function PayPalButton({
  planType,
  amount,
  onSuccess,
  onError,
  onCancel
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButton()
        return
      }

      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox'

      if (!clientId) {
        onError(new Error('PayPal Client ID not configured'))
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=capture&enable-funding=venmo,paylater&disable-funding=card`
      script.async = true
      script.onload = () => renderPayPalButton()
      script.onerror = () => onError(new Error('Failed to load PayPal SDK'))
      document.body.appendChild(script)
    }

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalRef.current) return

      // Clear any existing buttons
      paypalRef.current.innerHTML = ''

      if (planType === 'monthly') {
        // Monthly subscription button
        const monthlyPlanId = process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID

        if (!monthlyPlanId) {
          onError(new Error('Monthly plan ID not configured'))
          return
        }

        window.paypal.Buttons({
          createSubscription: (data: any, actions: any) => {
            return actions.subscription.create({
              plan_id: monthlyPlanId,
              application_context: {
                brand_name: 'FutureBabe - AI Baby Generator',
                locale: 'en-US',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                payment_method: {
                  payer_selected: 'PAYPAL',
                  payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                return_url: `${window.location.origin}/generate?success=true`,
                cancel_url: `${window.location.origin}/pricing?cancelled=true`
              }
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              onSuccess({
                planType: 'monthly',
                subscriptionID: data.subscriptionID,
                orderID: data.orderID,
                amount: amount
              })
            } catch (error) {
              onError(error)
            }
          },
          onError: (error: any) => {
            console.error('PayPal Subscription Error:', error)
            onError(error)
          },
          onCancel: () => {
            if (onCancel) onCancel()
          },
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'subscribe',
            height: 45
          }
        }).render(paypalRef.current)
      } else {
        // One-time payment button (for both 'one-time' and 'full-year' plans)
        const getDescription = () => {
          switch (planType) {
            case 'one-time':
              return 'FutureBabe - Generate 1 Baby Photo + Voice'
            case 'full-year':
              return 'FutureBabe - Full Year Growth Plan (12 Stages)'
            default:
              return 'FutureBabe Payment'
          }
        }

        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toString(),
                  currency_code: 'USD'
                },
                description: getDescription()
              }]
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture()
              onSuccess({
                planType: planType,
                orderID: data.orderID,
                payerID: data.payerID,
                details: details,
                amount: amount
              })
            } catch (error) {
              onError(error)
            }
          },
          onError: (error: any) => {
            console.error('PayPal Error:', error)
            onError(error)
          },
          onCancel: () => {
            if (onCancel) onCancel()
          },
          style: {
            layout: 'vertical',
            color: planType === 'full-year' ? 'gold' : 'silver',
            shape: 'rect',
            label: 'paypal',
            height: 45
          }
        }).render(paypalRef.current)
      }
    }

    loadPayPalScript()

    // Cleanup
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ''
      }
    }
  }, [planType, amount, onSuccess, onError, onCancel])

  return (
    <div 
      ref={paypalRef}
      style={{
        minHeight: '45px',
        width: '100%'
      }}
    />
  )
}

// Simple PayPal button wrapper for one-time payments
export function PayPalOneTimeButton({
  onSuccess,
  onError
}: {
  onSuccess: (details: any) => void
  onError: (error: any) => void
}) {
  return (
    <PayPalButton
      planType="one-time"
      amount={5.90}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

// Simple PayPal button wrapper for monthly subscriptions
export function PayPalMonthlyButton({
  onSuccess,
  onError
}: {
  onSuccess: (details: any) => void
  onError: (error: any) => void
}) {
  return (
    <PayPalButton
      planType="monthly"
      amount={12.90}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

// Simple PayPal button wrapper for full-year plan
export function PayPalFullYearButton({
  onSuccess,
  onError
}: {
  onSuccess: (details: any) => void
  onError: (error: any) => void
}) {
  return (
    <PayPalButton
      planType="full-year"
      amount={39.90}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}
