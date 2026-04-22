import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
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

export function getAllPosts(): BlogPost[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title,
          summary: data.summary,
          content,
          coverImage: data.coverImage,
          publishedDate: data.publishedDate,
          author: data.author,
          readTime: data.readTime,
          tags: data.tags || []
        }
      })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    })
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      summary: data.summary,
      content,
      coverImage: data.coverImage,
      publishedDate: data.publishedDate,
      author: data.author,
      readTime: data.readTime,
      tags: data.tags || []
    }
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts()
  
  return allPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.tags.some(tag => tags.includes(tag)))
    .slice(0, limit)
}
