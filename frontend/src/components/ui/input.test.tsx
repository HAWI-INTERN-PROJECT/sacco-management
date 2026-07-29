import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with default type', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).not.toHaveAttribute('type')
  })

  it('renders with email type', () => {
    render(<Input type="email" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders with password type', () => {
    render(<Input type="password" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('can be disabled', () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
