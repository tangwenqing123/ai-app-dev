import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { generateNonStreaming } from './deepseekApi'

describe('deepseekApi', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEEPSEEK_API_KEY', 'test-key-12345')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should throw error when API key is missing', async () => {
    vi.stubEnv('VITE_DEEPSEEK_API_KEY', '')
    
    await expect(generateNonStreaming('test', { temperature: 0.7, maxTokens: 800 }))
      .rejects
      .toThrow('API Key 未配置')
  })
})
