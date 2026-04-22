'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import FooterDisclaimer from '../../components/FooterDisclaimer'

interface BlogPost {
  slug: string
  title: string
  summary: string
  coverImage: string
  publishedDate: string
  author: string
  readTime: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch blog posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-100 to-purple-100 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-3xl mr-3">👶</span>
            <span className="text-2xl font-bold text-gray-700">FutureBabe</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/blog" className="text-pink-500 font-semibold">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            FutureBabe Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights about AI technology, parenting, and the future of family planning. 
            Stay updated with the latest trends and tips for expecting parents.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Blog Posts...</h2>
            <p className="text-gray-500">Fetching the latest articles for you</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.slug}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {post.author.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{post.author}</span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-pink-500 hover:text-pink-600 font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Blog Posts Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We're working on creating amazing content for you. Check back soon for insights about AI, parenting, and family planning!
            </p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">👶</span>
              <h3 className="text-2xl font-bold text-gray-700">FutureBabe</h3>
            </div>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Meet your future baby with AI-powered technology
            </p>
          </div>
          
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
            <Link href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
              Contact
            </Link>
          </div>
          
          <div className="border-t border-pink-100 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 FutureBabe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <FooterDisclaimer />
    </div>
  )
}
