import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'br']
const ALLOWED_ATTR: string[] = []

export const sanitizeRichText = (content: string): string => {
  if (import.meta.server) {
    // Server-side: DOMPurify needs a window object
    // For Nuxt server-side, we'll use a simpler approach
    // In production, consider using isomorphic-dompurify
    return content // Server-side sanitization handled in API routes
  }
  
  // Client-side
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR
  })
}
