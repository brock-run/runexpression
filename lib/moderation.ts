import OpenAI from 'openai'
import { env } from '@/env'

/**
 * Content moderation result from OpenAI API
 */
export interface ModerationResult {
  flagged: boolean
  categories: {
    hate: boolean
    'hate/threatening': boolean
    harassment: boolean
    'harassment/threatening': boolean
    'self-harm': boolean
    'self-harm/intent': boolean
    'self-harm/instructions': boolean
    sexual: boolean
    'sexual/minors': boolean
    violence: boolean
    'violence/graphic': boolean
  }
  category_scores: Record<string, number>
}

/**
 * Moderation check response
 */
export interface ModerationCheckResponse {
  allowed: boolean
  flagged: boolean
  reason?: string
  result?: ModerationResult
}

/**
 * User-friendly error messages for flagged content categories
 */
const CATEGORY_MESSAGES: Record<string, string> = {
  hate: 'contains content that may be harmful or discriminatory',
  'hate/threatening':
    'contains threatening language that may be harmful to others',
  harassment: 'contains content that may be harassment',
  'harassment/threatening':
    'contains threatening language directed at individuals',
  'self-harm': 'contains content related to self-harm',
  'self-harm/intent': 'contains content expressing intent to self-harm',
  'self-harm/instructions': 'contains instructions for self-harm',
  sexual: 'contains explicit sexual content',
  'sexual/minors': 'contains inappropriate content involving minors',
  violence: 'contains violent content',
  'violence/graphic': 'contains graphic violent content',
}

/**
 * Initialize OpenAI client
 * Returns null if API key is not configured (graceful degradation)
 */
function getOpenAIClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) {
    console.warn(
      'OPENAI_API_KEY not configured. Content moderation will be skipped.'
    )
    return null
  }
  return new OpenAI({ apiKey: env.OPENAI_API_KEY })
}

/**
 * Check text content against OpenAI Moderation API
 *
 * @param text - The text content to check
 * @returns ModerationCheckResponse with allowed status and details
 *
 * Per ADR-007, this API:
 * - Checks for hate speech, harassment, self-harm, sexual content, violence
 * - Returns immediately if content is flagged
 * - Falls back to allowing content if API is unavailable (graceful degradation)
 */
export async function moderateText(text: string): Promise<ModerationCheckResponse> {
  // Skip empty content
  if (!text || text.trim().length === 0) {
    return { allowed: true, flagged: false }
  }

  const openai = getOpenAIClient()

  // Graceful degradation: if no API key, allow content to pass to manual review
  if (!openai) {
    return {
      allowed: true,
      flagged: false,
      reason: 'Moderation API not configured - content passed to manual review',
    }
  }

  try {
    const moderation = await openai.moderations.create({
      input: text,
    })

    const result = moderation.results[0]

    if (result.flagged) {
      // Find which categories were flagged
      const flaggedCategories = Object.entries(result.categories)
        .filter(([, flagged]) => flagged)
        .map(([category]) => category)

      // Get user-friendly message for the primary flagged category
      const primaryCategory = flaggedCategories[0]
      const reason =
        CATEGORY_MESSAGES[primaryCategory] ||
        'may violate our content guidelines'

      return {
        allowed: false,
        flagged: true,
        reason: `Your submission ${reason}. Please review and try again.`,
        result: {
          flagged: result.flagged,
          categories: result.categories as ModerationResult['categories'],
          category_scores: result.category_scores as unknown as Record<string, number>,
        },
      }
    }

    return {
      allowed: true,
      flagged: false,
      result: {
        flagged: result.flagged,
        categories: result.categories as ModerationResult['categories'],
        category_scores: result.category_scores as unknown as Record<string, number>,
      },
    }
  } catch (error) {
    // Log error but don't block submission - fall back to manual review
    console.error('OpenAI Moderation API error:', error)

    return {
      allowed: true,
      flagged: false,
      reason: 'Moderation API unavailable - content passed to manual review',
    }
  }
}

/**
 * Check multiple text fields against moderation API
 * Combines content and contentLong for a single check
 *
 * @param content - Primary text content
 * @param contentLong - Optional longer form content
 * @returns ModerationCheckResponse
 */
export async function moderateFlowContent(
  content: string | null,
  contentLong: string | null
): Promise<ModerationCheckResponse> {
  // Combine all text content for checking
  const textToCheck = [content, contentLong].filter(Boolean).join('\n\n')

  if (!textToCheck) {
    return { allowed: true, flagged: false }
  }

  return moderateText(textToCheck)
}
