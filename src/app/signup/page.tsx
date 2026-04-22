'use client'

import { useState } from 'react'
import Link from 'next/link'
// import { supabase } from '../../../lib/supabase'
import FooterDisclaimer from '../../components/FooterDisclaimer'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    // Simulate signup success for demo (until Supabase is configured)
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1000)
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #eff6ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Account Created!
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            fontSize: '16px'
          }}>
            Welcome to FutureBabe! You can now sign in to your account.
          </p>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            textDecoration: 'none',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '2.5rem', marginRight: '12px' }}>👶</span>
            FutureBabe
          </a>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>Create Your Account</h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Join thousands of couples discovering their future baby
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your email"
              onFocus={(e) => e.target.style.borderColor = '#ec4899'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Create a password (min. 6 characters)"
              onFocus={(e) => e.target.style.borderColor = '#ec4899'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Confirm your password"
              onFocus={(e) => e.target.style.borderColor = '#ec4899'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(90deg, #ec4899, #8b5cf6)',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms */}
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          By creating an account, you agree to our{' '}
          <a href="/terms" style={{ color: '#ec4899' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color: '#ec4899' }}>Privacy Policy</a>
        </p>

        {/* Divider */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <a href="/login" style={{
              color: '#ec4899',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Sign in here
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            ← Back to Home
          </a>
        </div>
      </div>
      <FooterDisclaimer />
    </div>
  )
}
