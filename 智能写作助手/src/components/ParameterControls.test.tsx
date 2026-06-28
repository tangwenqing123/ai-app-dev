import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ParameterControls } from './ParameterControls'

describe('ParameterControls', () => {
  test('should render with default values', () => {
    const mockOnChange = vi.fn()
    render(
      <ParameterControls 
        params={{ temperature: 0.7, maxTokens: 800 }} 
        onChange={mockOnChange} 
      />
    )
    
    expect(screen.getByText('高级设置')).toBeInTheDocument()
  })

  test('should expand when clicked', () => {
    const mockOnChange = vi.fn()
    render(
      <ParameterControls 
        params={{ temperature: 0.7, maxTokens: 800 }} 
        onChange={mockOnChange} 
      />
    )
    
    const button = screen.getByText('高级设置')
    fireEvent.click(button)
    
    expect(screen.getByText('创意度 (Temperature)')).toBeInTheDocument()
    expect(screen.getByText('输出长度 (Max Tokens)')).toBeInTheDocument()
  })

  test('should call onChange when temperature changes', () => {
    const mockOnChange = vi.fn()
    render(
      <ParameterControls 
        params={{ temperature: 0.7, maxTokens: 800 }} 
        onChange={mockOnChange} 
      />
    )
    
    const button = screen.getByText('高级设置')
    fireEvent.click(button)
    
    const sliders = screen.getAllByRole('slider')
    const temperatureSlider = sliders[0]
    fireEvent.change(temperatureSlider, { target: { value: '0.5' } })
    
    expect(mockOnChange).toHaveBeenCalled()
  })
})
