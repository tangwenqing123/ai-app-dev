import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'
import { renderHook } from '@testing-library/react'

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  test('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' }
    })

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(500)

    expect(result.current).toBe('updated')
  })

  test('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'first' })
    vi.advanceTimersByTime(250)
    expect(result.current).toBe('initial')

    rerender({ value: 'second' })
    vi.advanceTimersByTime(250)
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(250)
    expect(result.current).toBe('second')
  })
})
