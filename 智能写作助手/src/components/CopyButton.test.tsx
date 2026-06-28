import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyButton } from './CopyButton'

describe('CopyButton', () => {
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined)
  }

  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: mockClipboard })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should render correctly', () => {
    render(<CopyButton text="test text" />)
    expect(screen.getByText('复制')).toBeInTheDocument()
  })

  test('should copy text to clipboard when clicked', async () => {
    render(<CopyButton text="test text" />)
    const button = screen.getByText('复制')
    
    await fireEvent.click(button)
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test text')
  })

  test('should show "已复制" after clicking', async () => {
    render(<CopyButton text="test text" />)
    const button = screen.getByText('复制')
    
    await fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('已复制')).toBeInTheDocument()
    })
  })
})
