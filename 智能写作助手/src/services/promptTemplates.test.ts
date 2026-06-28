import { describe, expect, test } from 'vitest'
import { buildPrompt, buildOptimizePrompt } from './promptTemplates'

describe('promptTemplates', () => {
  const testInput = '这是一段测试文本'

  test('buildPrompt should generate correct prompt for continue mode', () => {
    const prompt = buildPrompt('continue', testInput)
    expect(prompt).toContain('续写')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should generate correct prompt for rewrite mode', () => {
    const prompt = buildPrompt('rewrite', testInput)
    expect(prompt).toContain('改写')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should generate correct prompt for expand mode', () => {
    const prompt = buildPrompt('expand', testInput)
    expect(prompt).toContain('扩展')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should generate correct prompt for summarize mode', () => {
    const prompt = buildPrompt('summarize', testInput)
    expect(prompt).toContain('总结')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should generate correct prompt for email mode', () => {
    const prompt = buildPrompt('email', testInput)
    expect(prompt).toContain('邮件')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should generate correct prompt for copywriting mode', () => {
    const prompt = buildPrompt('copywriting', testInput)
    expect(prompt).toContain('文案')
    expect(prompt).toContain(testInput)
  })

  test('buildPrompt should handle empty input', () => {
    const prompt = buildPrompt('continue', '')
    expect(prompt).toBeDefined()
  })

  test('buildOptimizePrompt should generate correct optimization prompt', () => {
    const prompt = buildOptimizePrompt(testInput, 'continue')
    expect(prompt).toContain('优化')
    expect(prompt).toContain(testInput)
    expect(prompt).toContain('文章续写')
  })
})
