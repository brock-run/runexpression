/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/admin/moderate/route'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn(),
}))

jest.mock('@/lib/trust-score', () => ({
  awardTrustPoints: jest.fn(),
}))

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { awardTrustPoints } from '@/lib/trust-score'

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockCreateAdminClient = createAdminClient as jest.MockedFunction<
  typeof createAdminClient
>
const mockAwardTrustPoints = awardTrustPoints as jest.MockedFunction<
  typeof awardTrustPoints
>

// Helper to create mock request
function createMockRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/admin/moderate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Helper to create chainable mock query builder
function createMockQueryBuilder(resolvedValue: { error: unknown }) {
  return {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue(resolvedValue),
  }
}

describe('POST /api/admin/moderate', () => {
  const validFlowRequest = {
    type: 'flow',
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    action: 'approve',
  }

  const validContributionRequest = {
    type: 'contribution',
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    action: 'reject',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset NODE_ENV
    process.env.NODE_ENV = 'test'
  })

  describe('Authentication', () => {
    it('returns 401 when not authenticated', async () => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      } as never)

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Authentication required.')
    })

    it('returns 403 when user is not admin (in production)', async () => {
      process.env.NODE_ENV = 'production'

      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: {} },
                error: null,
              }),
            }),
          }),
        }),
      } as never)

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(403)
      const body = await response.json()
      expect(body.error).toBe('Admin privileges required.')
    })

    it('allows admin users', async () => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_admin: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)

      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(200)
    })

    it('allows moderator users', async () => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'mod-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_moderator: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)

      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(200)
    })
  })

  describe('Request Validation', () => {
    beforeEach(() => {
      // Setup authenticated admin user
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_admin: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)
    })

    it('returns 400 for invalid type', async () => {
      const response = await POST(
        createMockRequest({ ...validFlowRequest, type: 'invalid' })
      )

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toBe('Invalid request data.')
    })

    it('returns 400 for invalid UUID', async () => {
      const response = await POST(
        createMockRequest({ ...validFlowRequest, id: 'not-a-uuid' })
      )

      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid action', async () => {
      const response = await POST(
        createMockRequest({ ...validFlowRequest, action: 'delete' })
      )

      expect(response.status).toBe(400)
    })

    it('returns 400 for missing required fields', async () => {
      const response = await POST(createMockRequest({ type: 'flow' }))

      expect(response.status).toBe(400)
    })
  })

  describe('Flow Post Moderation', () => {
    beforeEach(() => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_admin: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)
    })

    it('approves Flow post successfully', async () => {
      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.success).toBe(true)
      expect(body.message).toContain('approved')
      expect(mockAwardTrustPoints).toHaveBeenCalledWith(
        validFlowRequest.user_id,
        'flow_post_approved'
      )
    })

    it('rejects Flow post successfully', async () => {
      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(
        createMockRequest({ ...validFlowRequest, action: 'reject' })
      )

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.success).toBe(true)
      expect(body.message).toContain('rejected')
      expect(mockAwardTrustPoints).toHaveBeenCalledWith(
        validFlowRequest.user_id,
        'flow_post_rejected'
      )
    })

    it('returns 500 on database error', async () => {
      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(
          createMockQueryBuilder({ error: { message: 'DB Error' } })
        ),
      } as never)

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(500)
    })
  })

  describe('Contribution Moderation', () => {
    beforeEach(() => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_admin: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)
    })

    it('approves contribution successfully', async () => {
      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(
        createMockRequest({ ...validContributionRequest, action: 'approve' })
      )

      expect(response.status).toBe(200)
      expect(mockAwardTrustPoints).toHaveBeenCalledWith(
        validContributionRequest.user_id,
        'contribution_approved'
      )
    })

    it('rejects contribution successfully', async () => {
      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)

      mockAwardTrustPoints.mockResolvedValue({ success: true })

      const response = await POST(createMockRequest(validContributionRequest))

      expect(response.status).toBe(200)
      expect(mockAwardTrustPoints).toHaveBeenCalledWith(
        validContributionRequest.user_id,
        'contribution_rejected'
      )
    })
  })

  describe('Trust Points Handling', () => {
    beforeEach(() => {
      mockCreateClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-123' } },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { expression_data: { is_admin: true } },
                error: null,
              }),
            }),
          }),
        }),
      } as never)

      mockCreateAdminClient.mockReturnValue({
        from: jest.fn().mockReturnValue(createMockQueryBuilder({ error: null })),
      } as never)
    })

    it('returns 207 with warning when trust points fail', async () => {
      mockAwardTrustPoints.mockRejectedValue(new Error('Trust points error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await POST(createMockRequest(validFlowRequest))

      expect(response.status).toBe(207)
      const body = await response.json()
      expect(body.success).toBe(true)
      expect(body.warning).toBe('Trust points could not be awarded.')
      expect(body.trustPointsError).toBe('Trust points error')

      consoleSpy.mockRestore()
    })

    it('continues successfully even if trust points fail', async () => {
      mockAwardTrustPoints.mockRejectedValue(new Error('Network error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await POST(createMockRequest(validFlowRequest))

      // Should still be a success (partial)
      const body = await response.json()
      expect(body.success).toBe(true)
      expect(body.message).toContain('approved')

      consoleSpy.mockRestore()
    })
  })
})
