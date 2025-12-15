/**
 * Constants for RunExpression application
 * Single source of truth for vibe tags, configuration, etc.
 */

export const VIBE_TAGS = {
  MINDSET: [
    'Meditative',
    'Competitive',
    'Exploratory',
    'Celebratory',
    'Defiant',
    'Grateful',
    'Uncertain',
  ],
  CONTEXT: [
    'Solo Journey',
    'Crew Energy',
    'Morning Miles',
    'Late Night Flow',
    'Race Day',
    'Injury Comeback',
    'New Territory',
  ],
  FEELING: [
    'Flow State',
    'Suffering',
    'Joy',
    'Struggle',
    'Peace',
    'Triumph',
    'Discovery',
  ],
} as const

export const EXPRESSION_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  PHOTO_TEXT: 'photo_text',
} as const

export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  PENDING: 'pending',
} as const

export const CLUB_CONTRIBUTION_TYPES = {
  STORY: 'story',
  MEDIA: 'media',
  DOCUMENT: 'document',
} as const

export const CLUB_MEMBER_ROLES = {
  ADMIN: 'admin',
  COACH: 'coach',
  MEMBER: 'member',
} as const

export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  COMPRESSED_IMAGE_TARGET: 400 * 1024, // 400KB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/heic'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/gpx+xml'],
} as const

// Character limits
export const TEXT_LIMITS = {
  FLOW_SHORT: 500,
  FLOW_LONG: 1000,
  CLUBHOUSE_TITLE: 200,
  CLUBHOUSE_CAPTION: 500,
  CLUBHOUSE_BODY: 10000,
} as const

// Pagination
export const PAGINATION = {
  FLOW_WALL_INITIAL: 50,
  FLOW_WALL_LOAD_MORE: 20,
  CLUBHOUSE_GRID: 24,
} as const
