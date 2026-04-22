'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface BlogPost {
  slug: string
  title: string
  summary: string
  content: string
  coverImage: string
  publishedDate: string
  author: string
  readTime: string
  tags: string[]
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
          setRelatedPosts(data.relatedPosts || [])
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Article...</h2>
          <p className="text-gray-500">Please wait while we fetch the content</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link 
            href="/blog"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

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

      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/blog" className="hover:text-pink-500 transition-colors">
              Blog
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-700">{post.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <span>•</span>
              <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.summary}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 2).map((relatedPost) => (
                <Link 
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            ← Back to Blog
          </Link>
        </div>
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
    </div>
  )
}
