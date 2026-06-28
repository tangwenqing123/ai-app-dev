import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Integration Test', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEEPSEEK_API_KEY', 'test-key-12345')
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  test('should render main components', () => {
    render(<App />)
    
    expect(screen.getByText('智能写作助手')).toBeInTheDocument()
    expect(screen.getByText('输入文本')).toBeInTheDocument()
    expect(screen.getByText('AI 输出')).toBeInTheDocument()
    expect(screen.getByText('生成内容')).toBeInTheDocument()
  })

  test('should update input text', () => {
    render(<App />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '测试输入文本' } })
    
    expect(textarea).toHaveValue('测试输入文本')
  })

  test('should clear input when button clicked', () => {
    render(<App />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '测试输入文本' } })
    
    const clearButton = screen.getByText('清空')
    fireEvent.click(clearButton)
    
    expect(textarea).toHaveValue('')
  })
})
