/**
 * Constants for RunExpression application
 * Single source of truth for vibe tags, configuration, etc.
 */

export const VIBE_TAGS = {
  MINDSET: [
    'Meditative',
    'Aggressive',
    'Playful',
    'Dark',
    'Grateful',
    'Pain Cave',
  ],
  CONTEXT: [
    'Race Day',
    'Morning Miles',
    'Night Run',
    'Social',
    'Solo',
    'Commute',
  ],
  FEELING: ['Float', 'Grind', 'Flow', 'Heavy', 'Fast', 'Recovery'],
} as const

// Flatten all vibe tags into single array
export const ALL_VIBE_TAGS = [
  ...VIBE_TAGS.MINDSET,
  ...VIBE_TAGS.CONTEXT,
  ...VIBE_TAGS.FEELING,
] as const

export const MAX_VIBE_TAGS = 3

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
