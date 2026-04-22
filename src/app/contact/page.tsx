'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import FooterDisclaimer from '../../components/FooterDisclaimer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Log form data to console (since no backend for now)
    console.log('Contact Form Submission:', formData)
    
    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ff, #f3e8ff, #e0f2fe)',
      padding: '40px 20px'
    }}>
      <main style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#ec4899',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '24px',
              textDecoration: 'none'
            }}
          >
            ← Back to Home
          </Link>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Contact Us
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Have questions about FutureBabe? We'd love to hear from you!
            Reach out and we'll get back to you as soon as possible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '2px solid #f3f4f6'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>📝</span>
              Send us a Message
            </h2>
            
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#16a34a',
                  marginBottom: '8px'
                }}>Thank You!</h3>
                <p style={{ color: '#6b7280' }}>
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label htmlFor="name" style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px'
                    }}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      resize: 'none'
                    }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                >
                  {isSubmitting ? 'Sending...' : '📧 Send Message'}
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '2px solid #f3f4f6'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>📧</span>
                Direct Email
              </h2>
              <div style={{
                background: '#eff6ff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '8px'
                  }}>
                    Email Support
                  </h3>
                  <a
                    href="mailto:support@futurebabe.xyz"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#2563eb',
                      textDecoration: 'none'
                    }}
                  >
                    support@futurebabe.xyz
                  </a>
                  <p style={{
                    color: '#2563eb',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>
                    Click to open your email client
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  📅 We typically respond within 24 hours during business days
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '2px solid #f3f4f6'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>❓</span>
                Quick Answers
              </h2>
              <div style={{
                background: '#fefce8',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #fde047'
              }}>
                <p style={{
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  Looking for quick answers? Check out our frequently asked questions first!
                </p>
                <Link
                  href="/pricing"
                  style={{
                    display: 'inline-block',
                    background: '#eab308',
                    color: 'white',
                    fontWeight: '600',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none'
                  }}
                >
                  📋 View FAQ Section
                </Link>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(90deg, #f0fdf4, #eff6ff)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid #bbf7d0'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.25rem', marginRight: '12px' }}>⏰</span>
                Response Times
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#22c55e', marginRight: '12px' }}>🟢</span>
                  <span style={{ color: '#374151' }}><strong>General inquiries:</strong> Within 24 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', marginRight: '12px' }}>🟡</span>
                  <span style={{ color: '#374151' }}><strong>Technical issues:</strong> Within 12 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#ef4444', marginRight: '12px' }}>🔴</span>
                  <span style={{ color: '#374151' }}><strong>Refund requests:</strong> Within 48 hours</span>
                </div>
              </div>
            </div>
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
              <Link href="/refund-policy" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Refund Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/contact" className="text-pink-500 font-semibold text-sm">
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
