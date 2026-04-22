'use client'

import Link from 'next/link'
import FooterDisclaimer from '../../components/FooterDisclaimer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-10 px-5">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-block text-pink-500 text-xl font-bold mb-6 hover:text-pink-600 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using FutureBabe services.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-100">
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Welcome to FutureBabe. By using our website and services, you agree to the following terms and conditions. Please read them carefully.
            </p>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using the FutureBabe service, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our service.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Description of Service</h2>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-gray-700 leading-relaxed">
                  FutureBabe allows couples to upload photos and receive AI-generated baby photos and baby voice samples. The service is for entertainment purposes only and does not provide medical or genetic predictions.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <p className="text-gray-700 leading-relaxed">
                  To access certain features, users must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Usage Limitations</h2>
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <p className="text-gray-700 leading-relaxed mb-3">You may not:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">•</span>
                    Use our services for illegal or harmful purposes.
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">•</span>
                    Attempt to reverse engineer, copy, or distribute AI-generated outputs without permission.
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">•</span>
                    Upload images that are offensive, pornographic, or violate intellectual property rights.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Payment Terms</h2>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Payment is required before generating AI baby content. You may choose from one-time, monthly, or annual plans. All payments are processed via PayPal and are subject to PayPal's own terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>For our refund terms, please refer to our separate <Link href="/refund-policy" className="text-pink-500 hover:text-pink-600 underline">Refund Policy</Link>.</strong>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Intellectual Property</h2>
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <p className="text-gray-700 leading-relaxed">
                  All content and code on FutureBabe, including AI-generated outputs, belong to us or our licensors. You may not reproduce, resell, or redistribute results outside of personal use without permission.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Account Termination</h2>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or delete any user account that violates our terms or uses the service inappropriately.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Disclaimer</h2>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <p className="text-gray-700 leading-relaxed">
                  FutureBabe is for entertainment use only. We make no guarantees about the accuracy or realism of AI-generated results.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <p className="text-gray-700 leading-relaxed">
                  We may update these terms from time to time. Continued use of the service indicates acceptance of the updated terms.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  If you have questions, please contact us via our <Link href="/contact" className="text-pink-500 hover:text-pink-600 underline">Contact Page</Link>.
                </p>
              </div>
            </section>
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
              <Link href="/terms" className="text-pink-500 font-semibold text-sm">
                Terms
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
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

            {/* Copyright */}
            <div className="text-center">
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
