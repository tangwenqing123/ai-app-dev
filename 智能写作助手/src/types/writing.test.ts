import { describe, expect, test } from 'vitest'
import { WRITING_MODES, type WritingMode, type GenerationRecord, type GenerateParams } from './writing'

describe('WritingMode type', () => {
  test('should have all required modes', () => {
    const modes: WritingMode[] = ['continue', 'rewrite', 'expand', 'summarize', 'email', 'copywriting']
    expect(WRITING_MODES.map(m => m.value)).toEqual(modes)
  })

  test('should have valid labels and descriptions', () => {
    WRITING_MODES.forEach(mode => {
      expect(mode.label).toBeTruthy()
      expect(mode.description).toBeTruthy()
    })
  })
})

describe('GenerationRecord interface', () => {
  test('should create valid record', () => {
    const record: GenerationRecord = {
      id: '12345',
      mode: 'continue',
      inputText: 'test input',
      outputText: 'test output',
      createdAt: Date.now(),
    }
    expect(record.id).toBeTypeOf('string')
    expect(record.mode).toBe('continue')
    expect(record.inputText).toBeTypeOf('string')
    expect(record.outputText).toBeTypeOf('string')
    expect(record.createdAt).toBeTypeOf('number')
  })
})

describe('GenerateParams interface', () => {
  test('should have valid parameters', () => {
    const params: GenerateParams = {
      temperature: 0.7,
      maxTokens: 800,
    }
    expect(params.temperature).toBeGreaterThanOrEqual(0)
    expect(params.temperature).toBeLessThanOrEqual(1)
    expect(params.maxTokens).toBeGreaterThanOrEqual(100)
    expect(params.maxTokens).toBeLessThanOrEqual(2000)
  })
})
