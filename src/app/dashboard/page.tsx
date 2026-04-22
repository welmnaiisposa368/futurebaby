'use client'

import { useState, useEffect } from 'react'
// import { supabase } from '../../../lib/supabase'
import FooterDisclaimer from '../../components/FooterDisclaimer'

interface GenerationResult {
  id: string
  babyImageURL: string
  babyAudioURL: string
  created_at: string
  status: string
  processing_time: number
  baby_age_months?: number
  baby_message?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generations, setGenerations] = useState<GenerationResult[]>([])

  useEffect(() => {
    // Simulate loading user data (in real app, this would fetch from Supabase)
    const loadUserData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set mock user data (will be replaced with real Supabase data)
      // Use fixed values to avoid hydration mismatch
      setUser({
        email: 'user@example.com',
        id: 'user-demo-123', // Fixed ID to avoid hydration mismatch
        created_at: '2024-01-01T00:00:00.000Z', // Fixed date to avoid hydration mismatch
        is_subscribed: false, // Free user
        subscription_type: 'free', // Free plan
        subscription_expires_at: '2024-01-31T00:00:00.000Z', // Fixed date
        subscription_started_at: '2023-12-17T00:00:00.000Z', // Fixed date
        monthly_generations_used: 1,
        monthly_generations_limit: 3, // New field for monthly limit
        current_baby_month: 2,
        baby_name: 'Emma',
        next_unlock_date: '2024-01-16T00:00:00.000Z', // Fixed date
        total_spent: 19.90 // Updated to reflect new pricing
      })

      setLoading(false)
    }

    loadUserData()

    // Mock generation data for demo (show for monthly subscribers)
    if (user && user.subscription_type === 'monthly') {
      const mockGenerations: GenerationResult[] = [
        {
          id: 'gen-001',
          babyImageURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          babyAudioURL: 'https://www.soundjay.com/misc/sounds/baby-babble-01.mp3',
          created_at: '2024-01-15T10:30:00Z',
          status: 'completed',
          processing_time: 2500,
          baby_age_months: 2,
          baby_message: "👶 Your baby's adorable babbling sounds! Listen to those sweet coos and gurgles! 💕"
        },
        {
          id: 'gen-002',
          babyImageURL: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&crop=face',
          babyAudioURL: 'https://www.soundjay.com/misc/sounds/baby-mama-01.mp3',
          created_at: '2024-01-01T14:20:00Z',
          status: 'completed',
          processing_time: 3200,
          baby_age_months: 1,
          baby_message: "👶 Listen to your baby trying to say 'mama' and 'dada' for the first time! So precious! 💕"
        }
      ]
      setGenerations(mockGenerations)
    }
  }, [])

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👶</div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <div className="text-5xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            Please sign in to access your dashboard
          </p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-3">
              <span className="text-3xl">👶</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FutureBabe
              </span>
            </a>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center shadow-lg border border-pink-100">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {(() => {
                const username = user.email.split('@')[0];
                if (username === 'user' || username === 'demo' || username === 'test') {
                  return 'there';
                }
                return username.charAt(0).toUpperCase() + username.slice(1);
              })()}
            </span>!
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to see your future baby? Let's create some magic together! ✨
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Info Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Account Info</h3>
                <p className="text-gray-600 text-sm">Your profile details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">Email Address</div>
                <div className="text-gray-800 font-semibold">{user.email}</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">User ID</div>
                <div className="text-gray-800 font-mono text-sm">{user.id}</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">Member Since</div>
                <div className="text-gray-800 font-semibold">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">Account Status</div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-800 mr-2">Free Plan</span>
                  <span className="text-sm text-gray-600">Ready to upgrade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">💎</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Subscription</h3>
                <p className="text-gray-600 text-sm">Your plan status</p>
              </div>
            </div>

            {user && user.is_subscribed ? (
              <div className="space-y-4">
                {/* Subscription Status */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-lg font-bold text-green-800 mb-2">
                    {user?.subscription_type === 'monthly' ? 'Monthly Growth Plan Active!' :
                     user?.subscription_type === 'yearly' ? 'Yearly Plan Active!' :
                     user?.subscription_type === 'one-time' ? 'One-Time Purchase' : 'Subscribed!'}
                  </h4>

                  {user?.subscription_type === 'monthly' && (
                    <div className="space-y-3">
                      <p className="text-green-700 text-sm">
                        Generations used this month: <span className="font-bold">{user?.monthly_generations_used || 0}/3</span>
                      </p>
                      <div className="bg-green-100 rounded-lg p-3">
                        <p className="text-green-800 text-xs font-medium">
                          Next unlock: {user?.next_unlock_date ? new Date(user.next_unlock_date).toLocaleDateString() : 'Soon'}
                        </p>
                      </div>
                    </div>
                  )}

                  {user?.subscription_type === 'yearly' && (
                    <p className="text-green-700 text-sm mb-4">
                      All 12 baby stages unlocked! <span className="font-bold">Unlimited access</span>
                    </p>
                  )}
                </div>

                {/* Monthly Growth Progress */}
                {user?.subscription_type === 'monthly' && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">👶</div>
                      <h5 className="text-lg font-bold text-purple-800 mb-1">
                        {user?.baby_name ? `${user.baby_name}'s Growth Journey` : 'Baby Growth Journey'}
                      </h5>
                      <p className="text-purple-600 text-sm">Currently in Month {user?.current_baby_month || 1}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-purple-600 mb-2">
                        <span>Month 1</span>
                        <span>Month 12</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${((user?.current_baby_month || 1) / 12) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-xs text-purple-600 mt-2">
                        {user?.current_baby_month || 1}/12 months unlocked
                      </p>
                    </div>

                    {/* Latest Message */}
                    {user?.baby_name && (
                      <div className="bg-white/70 rounded-lg p-4 border border-pink-200">
                        <p className="text-sm text-purple-800 text-center italic">
                          💕 "Hello Mommy & Daddy, I love you! I'm growing so fast in month {user?.current_baby_month || 1}!"
                        </p>
                        <p className="text-xs text-purple-600 text-center mt-2">- {user?.baby_name}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upgrade Promotion */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200 text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <h5 className="text-lg font-bold text-pink-800 mb-1">Ready to Create?</h5>
                  <div className="text-sm font-medium text-pink-600 mb-2">Choose your perfect plan</div>
                  <p className="text-pink-700 text-xs mb-3">
                    AI baby photos + TTS voice messages
                  </p>
                  <a
                    href="/pricing"
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    View Plans
                  </a>
                </div>

                {/* Subscription Promotion */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 text-center">
                  <div className="text-3xl mb-2">💡</div>
                  <h5 className="text-lg font-bold text-purple-800 mb-2">Upgrade for More!</h5>
                  <p className="text-purple-700 text-sm mb-3">
                    Get monthly baby growth tracking or unlock all 12 stages
                  </p>
                  <a
                    href="/pricing"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                  >
                    View Plans
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Baby Generation History Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">👶</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Baby History</h3>
                <p className="text-gray-600 text-sm">Your generations</p>
              </div>
            </div>

            {generations.length === 0 ? (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border border-pink-200 text-center">
                <div className="text-5xl mb-4">🌟</div>
                <h4 className="text-lg font-bold text-pink-800 mb-2">No babies yet!</h4>
                <p className="text-pink-700 text-sm mb-6">
                  You haven't generated any baby yet. Click below to start!
                </p>
                <a
                  href="/generate"
                  className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  ✨ Meet Your Future Baby
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {generations.map((generation) => (
                  <div key={generation.id} className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={generation.babyImageURL}
                          alt="Generated baby"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-800 text-sm">
                            {user?.baby_name ? `${user.baby_name} - Month ${generation.baby_age_months}` : `Month ${generation.baby_age_months}`}
                          </h5>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Month {generation.baby_age_months}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mb-2">
                          {new Date(generation.created_at).toLocaleDateString()}
                        </p>

                        {/* Baby Message */}
                        {generation.baby_message && (
                          <div className="bg-white/70 rounded-lg p-3 mb-2 border border-pink-200">
                            <p className="text-sm text-purple-800 italic">
                              💕 "{generation.baby_message}"
                            </p>
                            <p className="text-xs text-purple-600 mt-1">- {user?.baby_name || 'Your baby'}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <span className="text-green-600 text-xs font-medium">✅ {generation.status}</span>
                          {generation.babyAudioURL && (
                            <button className="text-purple-600 text-xs hover:text-purple-800 flex items-center gap-1">
                              🔊 Baby Diary
                            </button>
                          )}
                          <button className="text-pink-600 text-xs hover:text-pink-800 flex items-center gap-1">
                            📷 View Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {generations.length >= 3 && (
                  <div className="text-center pt-4">
                    <a href="/generations" className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                      View all generations →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-pink-50/50 via-purple-50/50 to-white/50 py-12 px-6 mt-16 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          {/* Logo and Tagline */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">👶</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">FutureBabe</h3>
            </div>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Meet your future baby with AI-powered technology
            </p>
          </div>

          {/* Footer Links - Legal Only */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
            <a href="/terms" className="text-gray-600 hover:text-pink-500 transition-colors text-xs">
              Terms
            </a>
            <span className="text-gray-300">•</span>
            <a href="/privacy" className="text-gray-600 hover:text-pink-500 transition-colors text-xs">
              Privacy
            </a>
            <span className="text-gray-300">•</span>
            <a href="/refund-policy" className="text-gray-600 hover:text-pink-500 transition-colors text-xs">
              Refund Policy
            </a>
            <span className="text-gray-300">•</span>
            <a href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors text-xs">
              Contact
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-pink-100 pt-6">
            <p className="text-center text-gray-500 text-xs">
              © 2025 FutureBabe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <FooterDisclaimer />
    </div>
  )
}
