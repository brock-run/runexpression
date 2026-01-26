/**
 * @jest-environment node
 */
import {
  TRUST_EVENTS,
  TRUST_THRESHOLDS,
  TrustEventType,
  TrustLevel,
  awardTrustPoints,
  getUserTrustInfo,
  canAutoApprove,
} from '@/lib/trust-score'

// Mock the admin client
jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn(),
}))

import { createAdminClient } from '@/lib/supabase/admin'

const mockCreateAdminClient = createAdminClient as jest.MockedFunction<
  typeof createAdminClient
>

describe('Trust Score System', () => {
  describe('TRUST_EVENTS', () => {
    it('defines all expected event types', () => {
      const expectedEvents: TrustEventType[] = [
        'flow_post_approved',
        'flow_post_rejected',
        'contribution_approved',
        'contribution_rejected',
        'received_like',
        'membership_verified',
        'daily_login',
        'moderation_action',
      ]

      expectedEvents.forEach(event => {
        expect(TRUST_EVENTS[event]).toBeDefined()
        expect(TRUST_EVENTS[event]).toHaveProperty('points')
        expect(TRUST_EVENTS[event]).toHaveProperty('description')
      })
    })

    it('has correct point values for approval events', () => {
      expect(TRUST_EVENTS.flow_post_approved.points).toBe(10)
      expect(TRUST_EVENTS.contribution_approved.points).toBe(15)
      expect(TRUST_EVENTS.membership_verified.points).toBe(25)
    })

    it('has negative points for rejection events', () => {
      expect(TRUST_EVENTS.flow_post_rejected.points).toBeLessThan(0)
      expect(TRUST_EVENTS.contribution_rejected.points).toBeLessThan(0)
    })

    it('has neutral or positive points for engagement events', () => {
      expect(TRUST_EVENTS.received_like.points).toBeGreaterThanOrEqual(0)
      expect(TRUST_EVENTS.daily_login.points).toBeGreaterThanOrEqual(0)
    })
  })

  describe('TRUST_THRESHOLDS', () => {
    it('defines all trust levels', () => {
      const expectedLevels: TrustLevel[] = ['newcomer', 'regular', 'trusted', 'pillar']

      expectedLevels.forEach(level => {
        expect(TRUST_THRESHOLDS[level]).toBeDefined()
        expect(TRUST_THRESHOLDS[level]).toHaveProperty('min')
        expect(TRUST_THRESHOLDS[level]).toHaveProperty('max')
      })
    })

    it('has non-overlapping ranges', () => {
      expect(TRUST_THRESHOLDS.newcomer.max).toBeLessThan(TRUST_THRESHOLDS.regular.min)
      expect(TRUST_THRESHOLDS.regular.max).toBeLessThan(TRUST_THRESHOLDS.trusted.min)
      expect(TRUST_THRESHOLDS.trusted.max).toBeLessThan(TRUST_THRESHOLDS.pillar.min)
    })

    it('starts newcomer at 0', () => {
      expect(TRUST_THRESHOLDS.newcomer.min).toBe(0)
    })

    it('has pillar level extend to infinity', () => {
      expect(TRUST_THRESHOLDS.pillar.max).toBe(Infinity)
    })
  })

  describe('awardTrustPoints', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('calls RPC with correct parameters for default points', async () => {
      const mockRpc = jest.fn().mockResolvedValue({ error: null })
      mockCreateAdminClient.mockReturnValue({
        rpc: mockRpc,
      } as never)

      const result = await awardTrustPoints('user-123', 'flow_post_approved')

      expect(mockRpc).toHaveBeenCalledWith('add_trust_score', {
        p_user_id: 'user-123',
        p_event_type: 'flow_post_approved',
        p_points: 10,
        p_description: 'Flow post approved',
      })
      expect(result.success).toBe(true)
    })

    it('uses custom points when provided', async () => {
      const mockRpc = jest.fn().mockResolvedValue({ error: null })
      mockCreateAdminClient.mockReturnValue({
        rpc: mockRpc,
      } as never)

      await awardTrustPoints('user-123', 'moderation_action', 5, 'Custom action')

      expect(mockRpc).toHaveBeenCalledWith('add_trust_score', {
        p_user_id: 'user-123',
        p_event_type: 'moderation_action',
        p_points: 5,
        p_description: 'Custom action',
      })
    })

    it('returns error on RPC failure', async () => {
      const mockRpc = jest.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      mockCreateAdminClient.mockReturnValue({
        rpc: mockRpc,
      } as never)

      const result = await awardTrustPoints('user-123', 'flow_post_approved')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })

    it('handles thrown errors gracefully', async () => {
      const mockRpc = jest.fn().mockRejectedValue(new Error('Network error'))
      mockCreateAdminClient.mockReturnValue({
        rpc: mockRpc,
      } as never)

      const result = await awardTrustPoints('user-123', 'flow_post_approved')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('getUserTrustInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns trust info for valid user', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { trust_score: 150, trust_level: 'regular' },
              error: null,
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await getUserTrustInfo('user-123')

      expect(result).toEqual({
        score: 150,
        level: 'regular',
      })
    })

    it('returns null when user not found', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await getUserTrustInfo('invalid-user')

      expect(result).toBeNull()
    })
  })

  describe('canAutoApprove', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns false for newcomer', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { trust_score: 25, trust_level: 'newcomer' },
              error: null,
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await canAutoApprove('user-123')

      expect(result).toBe(false)
    })

    it('returns true for regular user', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { trust_score: 100, trust_level: 'regular' },
              error: null,
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await canAutoApprove('user-123')

      expect(result).toBe(true)
    })

    it('returns true for trusted user', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { trust_score: 300, trust_level: 'trusted' },
              error: null,
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await canAutoApprove('user-123')

      expect(result).toBe(true)
    })

    it('returns true for pillar user', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { trust_score: 1000, trust_level: 'pillar' },
              error: null,
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await canAutoApprove('user-123')

      expect(result).toBe(true)
    })

    it('returns false when user not found', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      })
      mockCreateAdminClient.mockReturnValue({
        from: mockFrom,
      } as never)

      const result = await canAutoApprove('invalid-user')

      expect(result).toBe(false)
    })
  })
})
