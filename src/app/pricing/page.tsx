'use client'
import { useState } from 'react'
import Link from 'next/link'
import FooterDisclaimer from '../../components/FooterDisclaimer'
export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">👶</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FutureBabe
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</Link>
              <Link href="/generate" className="text-gray-600 hover:text-gray-800 transition-colors">Generate</Link>
              <Link href="/pricing" className="text-pink-600 font-semibold">Pricing</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 transition-colors">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Choose Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
            Create AI baby photos with personalized voice messages. Perfect for couples and expecting parents! 🌟
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Experience Plan</h3>
              <div className="text-3xl font-bold text-pink-600 mb-1">$7.90</div>
              <p className="text-gray-600 text-sm">Perfect for trying</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                📸 1 AI baby photo
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                🎧 1 voice message (30s, custom text)
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Basic quality
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                ⚡ Instant download
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-2xl font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Get Started
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-xl text-white relative transform scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-xl font-bold mb-2">Standard Plan</h3>
              <div className="text-3xl font-bold mb-1">$14.90</div>
              <p className="text-purple-100 text-sm">Best for couples</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-white text-sm">
                <span className="text-yellow-300 mr-2">✓</span>
                📸 3 AI baby photos (different expressions/ages)
              </li>
              <li className="flex items-center text-white text-sm">
                <span className="text-yellow-300 mr-2">✓</span>
                🎧 1 voice message (60s, custom text)
              </li>
              <li className="flex items-center text-white text-sm">
                <span className="text-yellow-300 mr-2">✓</span>
                HD quality
              </li>
              <li className="flex items-center text-white text-sm">
                <span className="text-yellow-300 mr-2">✓</span>
                📝 Text blessing + personality adjustment
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-2xl font-semibold bg-white text-purple-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Choose Plan
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-blue-100">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">💌</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gift Plan</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">$23.90</div>
              <p className="text-gray-600 text-sm">Perfect gift</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                ✅ All Standard Plan features
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                💌 Online greeting card (photo + voice link)
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                🎬 HD video MV (photos + voice + subtitles)
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Choose Gift
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-green-100 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              BEST VALUE
            </div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Annual Plan</h3>
              <div className="text-3xl font-bold text-green-600 mb-1">$49.90</div>
              <p className="text-gray-600 text-sm">per year</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                📸 12 sets of photos + 12 voice messages (60s)
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                💌 2 online greeting cards + 1 video MV
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                Limited to 12 downloads/year
              </li>
              <li className="flex items-center text-gray-700 text-sm">
                <span className="text-green-500 mr-2">✓</span>
                🚀 Priority generation + holiday templates + support
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-2xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Best Value
            </button>
          </div>
        </div>
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 max-w-4xl mx-auto border border-pink-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to See Your Future Baby? 👶✨
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of couples who have already discovered the magic of AI baby generation with personalized voice messages.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Start Creating Now
            </Link>
          </div>
        </div>
      </main>
      <FooterDisclaimer />
    </div>
  )
}