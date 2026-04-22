'use client'

import Link from 'next/link'
import FooterDisclaimer from '../../components/FooterDisclaimer'

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your privacy is important to us.
          </p>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '2px solid #f3f4f6'
        }}>
          <div style={{
            color: '#374151',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            <p style={{ marginBottom: '20px', fontSize: '14px', color: '#6b7280' }}>
              <strong>Last Updated:</strong> July 26, 2025
            </p>

            <p style={{ marginBottom: '20px' }}>
              FutureBabe ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect the personal information you provide when using our website and services.
            </p>

            <p style={{ marginBottom: '30px' }}>
              By using FutureBabe (the "Service"), you agree to the terms outlined below.
            </p>

            {/* Section 1 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              1. Information We Collect
            </h2>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px', marginTop: '20px' }}>
              a) User Account Data
            </h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Email address</li>
              <li style={{ marginBottom: '5px' }}>Password (stored securely via Supabase)</li>
              <li style={{ marginBottom: '5px' }}>Subscription status and plan</li>
              <li style={{ marginBottom: '5px' }}>Date of registration and activity logs</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px', marginTop: '20px' }}>
              b) Uploaded Content
            </h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Images you upload (e.g., photos of you and your partner)</li>
              <li style={{ marginBottom: '5px' }}>These images are processed by third-party AI services to generate baby images and voice</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px', marginTop: '20px' }}>
              c) Generated Content
            </h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>AI-generated baby photos and voice recordings</li>
              <li style={{ marginBottom: '5px' }}>Optional metadata such as gender selection or baby messages</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px', marginTop: '20px' }}>
              d) Payment Information
            </h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>We use PayPal to process payments. We do not store your credit card or billing information on our servers.</li>
              <li style={{ marginBottom: '5px' }}>We store payment confirmations, subscription plans, and status for record keeping.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '10px', marginTop: '20px' }}>
              e) Device & Usage Data
            </h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>IP address, browser type, referral links, and usage logs for analytics and fraud prevention</li>
            </ul>

            {/* Section 2 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              2. How We Use Your Data
            </h2>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>To provide AI-based baby image and voice generation</li>
              <li style={{ marginBottom: '5px' }}>To manage your account and subscription</li>
              <li style={{ marginBottom: '5px' }}>To store your generation history on your dashboard</li>
              <li style={{ marginBottom: '5px' }}>To send transactional emails (e.g., confirmation, receipts, generation notifications)</li>
              <li style={{ marginBottom: '5px' }}>To improve the service and personalize your experience</li>
            </ul>
            <p style={{ marginBottom: '20px', fontWeight: '600' }}>
              We do not use your data to train AI models.
            </p>

            {/* Section 3 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              3. Image and Voice Privacy
            </h2>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Uploaded images and generated content are private and only visible to you.</li>
              <li style={{ marginBottom: '5px' }}>Images are deleted from external AI providers after processing, based on their data retention policies.</li>
              <li style={{ marginBottom: '5px' }}>You can request permanent deletion of your data at any time (see Section 7).</li>
            </ul>

            {/* Section 4 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              4. Data Storage & Security
            </h2>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>All data is stored securely using Supabase with encrypted storage and authenticated access.</li>
              <li style={{ marginBottom: '5px' }}>We implement HTTPS, access controls, and regular backups.</li>
              <li style={{ marginBottom: '5px' }}>We do not sell or share your personal data with third-party advertisers.</li>
            </ul>

            {/* Section 5 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              5. Children's Privacy
            </h2>
            <p style={{ marginBottom: '20px' }}>
              Our service is intended for adults (18+) only. We do not knowingly collect data from children.
            </p>

            {/* Section 6 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              6. Cookies
            </h2>
            <p style={{ marginBottom: '20px' }}>
              We use cookies for authentication and basic analytics. You can control cookie preferences in your browser.
            </p>

            {/* Section 7 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              7. Your Rights
            </h2>
            <p style={{ marginBottom: '10px' }}>You have the right to:</p>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Access or update your data</li>
              <li style={{ marginBottom: '5px' }}>Delete your account and all associated data</li>
              <li style={{ marginBottom: '5px' }}>Cancel your subscription at any time via PayPal or contacting support</li>
              <li style={{ marginBottom: '5px' }}>Request data deletion by emailing: support@futurebabe.xyz</li>
            </ul>

            {/* Section 8 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              8. Changes to This Policy
            </h2>
            <p style={{ marginBottom: '20px' }}>
              We may update this Privacy Policy from time to time. We'll notify you of material changes via email or dashboard notification.
            </p>

            {/* Section 9 */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
              9. Contact Us
            </h2>
            <p style={{ marginBottom: '20px' }}>
              For any privacy-related questions or data deletion requests:
            </p>
            <p style={{ marginBottom: '20px', fontSize: '18px' }}>
              📧 Email: <a href="mailto:support@futurebabe.xyz" style={{ color: '#ec4899', textDecoration: 'none' }}>support@futurebabe.xyz</a>
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
              <Link href="/privacy" className="text-pink-500 font-semibold text-sm">
                Privacy
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/refund-policy" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
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
