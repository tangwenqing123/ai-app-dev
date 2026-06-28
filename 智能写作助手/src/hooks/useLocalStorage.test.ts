import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'
import { renderHook, act } from '@testing-library/react'

describe('useLocalStorage hook', () => {
  const TEST_KEY = 'test-storage-key'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'))
    expect(result.current[0]).toBe('default')
  })

  test('should initialize from localStorage if value exists', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('saved'))
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'))
    expect(result.current[0]).toBe('saved')
  })

  test('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('updated'))
  })

  test('should handle objects', () => {
    const initialValue = { name: 'test', value: 123 }
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialValue))
    
    expect(result.current[0]).toEqual(initialValue)
    
    act(() => {
      result.current[1]({ name: 'updated', value: 456 })
    })
    
    expect(result.current[0]).toEqual({ name: 'updated', value: 456 })
  })

  test('should handle function updater', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 10))
    
    act(() => {
      result.current[1](prev => prev + 5)
    })
    
    expect(result.current[0]).toBe(15)
  })
})
