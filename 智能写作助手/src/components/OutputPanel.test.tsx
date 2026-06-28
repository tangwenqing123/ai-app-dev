import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutputPanel } from './OutputPanel'

describe('OutputPanel', () => {
  test('should render empty state', () => {
    render(<OutputPanel content="" isGenerating={false} error={null} />)
    expect(screen.getByText('AI 生成的内容将在此显示')).toBeInTheDocument()
  })

  test('should show loading state when generating', () => {
    render(<OutputPanel content="" isGenerating={true} error={null} />)
    expect(screen.getByText('AI 正在写作...')).toBeInTheDocument()
  })

  test('should not show empty state message when content provided', () => {
    render(<OutputPanel content="测试内容" isGenerating={false} error={null} />)
    expect(screen.queryByText('AI 生成的内容将在此显示')).not.toBeInTheDocument()
  })

  test('should display error', () => {
    render(<OutputPanel content="" isGenerating={false} error="测试错误" />)
    expect(screen.getByText('测试错误')).toBeInTheDocument()
  })

  test('should show copy button when content exists', () => {
    render(<OutputPanel content="test content" isGenerating={false} error={null} />)
    expect(screen.getByText('复制')).toBeInTheDocument()
  })
})
