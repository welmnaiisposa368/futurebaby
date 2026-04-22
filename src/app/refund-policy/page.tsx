'use client'

import Link from 'next/link'
import FooterDisclaimer from '../../components/FooterDisclaimer'

export default function RefundPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ff, #f3e8ff, #e0f2fe)',
      padding: '40px 20px'
    }}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{
            textDecoration: 'none',
            color: '#ec4899',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ← Back to Home
          </Link>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Refund Policy
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Our refund policy is designed to be fair to both our customers and our business.
          </p>
        </div>

        {/* Policy Content */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '2px solid #f3f4f6'
        }}>
          <div style={{
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Refund Eligibility
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Refunds are only available in cases of technical failure or clearly poor-quality results.
            </p>
          </div>

          <div style={{
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Time Limit
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Requests must be made within 7 days of purchase.
            </p>
          </div>

          <div style={{
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Exclusions
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Refunds will not be issued for fully delivered or accepted results.
            </p>
          </div>

          <div style={{
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Final Decision
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Final decisions are made by our support team.
            </p>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '32px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#0369a1',
              marginBottom: '12px'
            }}>
              Need Help?
            </h3>
            <p style={{
              color: '#0369a1',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: '0'
            }}>
              If you believe your purchase qualifies for a refund under this policy, please contact our support team with details about the technical issues or quality concerns.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            {/* Logo and Tagline */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">👶</span>
                <h3 className="text-2xl font-bold text-gray-700">FutureBabe</h3>
              </div>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Meet your future baby with AI-powered technology
              </p>
            </div>

            {/* Footer Links - Legal Only */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8">
              <Link href="/terms" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Terms
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Privacy
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/refund-policy" className="text-pink-500 font-semibold text-sm">
                Refund Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Contact
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-pink-100 pt-8">
              <p className="text-center text-gray-500 text-sm">
                © 2025 FutureBabe. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
      <FooterDisclaimer />
    </div>
  )
}
