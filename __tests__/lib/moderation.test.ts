/**
 * @jest-environment node
 */
import { moderateText, moderateFlowContent } from '@/lib/moderation'

// Mock the env module
jest.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-api-key',
  },
}))

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    moderations: {
      create: jest.fn(),
    },
  }))
})

import OpenAI from 'openai'

const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>

describe('Content Moderation', () => {
  let mockModerations: { create: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    mockModerations = {
      create: jest.fn(),
    }
    MockedOpenAI.mockImplementation(
      () =>
        ({
          moderations: mockModerations,
        }) as never
    )
  })

  describe('moderateText', () => {
    it('allows empty content', async () => {
      const result = await moderateText('')

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(mockModerations.create).not.toHaveBeenCalled()
    })

    it('allows whitespace-only content', async () => {
      const result = await moderateText('   ')

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(mockModerations.create).not.toHaveBeenCalled()
    })

    it('allows safe content', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: false,
            categories: {
              hate: false,
              'hate/threatening': false,
              harassment: false,
              'harassment/threatening': false,
              'self-harm': false,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false,
            },
            category_scores: {
              hate: 0.0001,
              harassment: 0.0002,
            },
          },
        ],
      })

      const result = await moderateText('Running brings me joy!')

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(result.result).toBeDefined()
      expect(mockModerations.create).toHaveBeenCalledWith({
        input: 'Running brings me joy!',
      })
    })

    it('blocks content flagged for hate', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: true,
            categories: {
              hate: true,
              'hate/threatening': false,
              harassment: false,
              'harassment/threatening': false,
              'self-harm': false,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false,
            },
            category_scores: {
              hate: 0.95,
            },
          },
        ],
      })

      const result = await moderateText('Hateful content here')

      expect(result.allowed).toBe(false)
      expect(result.flagged).toBe(true)
      expect(result.reason).toContain('harmful or discriminatory')
    })

    it('blocks content flagged for harassment', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: true,
            categories: {
              hate: false,
              'hate/threatening': false,
              harassment: true,
              'harassment/threatening': false,
              'self-harm': false,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false,
            },
            category_scores: {
              harassment: 0.92,
            },
          },
        ],
      })

      const result = await moderateText('Harassment content')

      expect(result.allowed).toBe(false)
      expect(result.flagged).toBe(true)
      expect(result.reason).toContain('harassment')
    })

    it('blocks content flagged for violence', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: true,
            categories: {
              hate: false,
              'hate/threatening': false,
              harassment: false,
              'harassment/threatening': false,
              'self-harm': false,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: true,
              'violence/graphic': false,
            },
            category_scores: {
              violence: 0.88,
            },
          },
        ],
      })

      const result = await moderateText('Violent content')

      expect(result.allowed).toBe(false)
      expect(result.flagged).toBe(true)
      expect(result.reason).toContain('violent')
    })

    it('blocks content flagged for self-harm', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: true,
            categories: {
              hate: false,
              'hate/threatening': false,
              harassment: false,
              'harassment/threatening': false,
              'self-harm': true,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false,
            },
            category_scores: {
              'self-harm': 0.75,
            },
          },
        ],
      })

      const result = await moderateText('Self-harm content')

      expect(result.allowed).toBe(false)
      expect(result.flagged).toBe(true)
      expect(result.reason).toContain('self-harm')
    })

    it('handles API errors gracefully', async () => {
      mockModerations.create.mockRejectedValue(new Error('API Error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await moderateText('Some content')

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(result.reason).toContain('Moderation API unavailable')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('provides user-friendly error message for multiple flagged categories', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: true,
            categories: {
              hate: true,
              'hate/threatening': false,
              harassment: true,
              'harassment/threatening': false,
              'self-harm': false,
              'self-harm/intent': false,
              'self-harm/instructions': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false,
            },
            category_scores: {
              hate: 0.9,
              harassment: 0.85,
            },
          },
        ],
      })

      const result = await moderateText('Bad content')

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Please review and try again')
    })
  })

  describe('moderateFlowContent', () => {
    it('handles null content', async () => {
      const result = await moderateFlowContent(null, null)

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(mockModerations.create).not.toHaveBeenCalled()
    })

    it('checks only content when contentLong is null', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: false,
            categories: {},
            category_scores: {},
          },
        ],
      })

      await moderateFlowContent('Short text', null)

      expect(mockModerations.create).toHaveBeenCalledWith({
        input: 'Short text',
      })
    })

    it('combines content and contentLong for checking', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: false,
            categories: {},
            category_scores: {},
          },
        ],
      })

      await moderateFlowContent('Short text', 'Longer description here')

      expect(mockModerations.create).toHaveBeenCalledWith({
        input: 'Short text\n\nLonger description here',
      })
    })

    it('checks only contentLong when content is null', async () => {
      mockModerations.create.mockResolvedValue({
        results: [
          {
            flagged: false,
            categories: {},
            category_scores: {},
          },
        ],
      })

      await moderateFlowContent(null, 'Just the long content')

      expect(mockModerations.create).toHaveBeenCalledWith({
        input: 'Just the long content',
      })
    })
  })

  describe('graceful degradation without API key', () => {
    it('allows content when API key is not configured', async () => {
      // Re-mock env without API key
      jest.resetModules()
      jest.doMock('@/env', () => ({
        env: {
          OPENAI_API_KEY: undefined,
        },
      }))

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Re-import to get fresh module with new mock
      const { moderateText: moderateTextNoKey } = await import('@/lib/moderation')

      const result = await moderateTextNoKey('Any content')

      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
      expect(result.reason).toContain('not configured')

      consoleSpy.mockRestore()
    })
  })
})
