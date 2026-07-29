import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button).toHaveClass('bg-primary')
  })

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByText('Outline')
    expect(button).toHaveClass('border')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-secondary')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByText('Ghost')
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })

  it('applies small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByText('Small')
    expect(button).toHaveClass('h-9')
  })

  it('applies large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByText('Large')
    expect(button).toHaveClass('h-11')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Click</Button>)
    const button = screen.getByText('Click')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Click</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
