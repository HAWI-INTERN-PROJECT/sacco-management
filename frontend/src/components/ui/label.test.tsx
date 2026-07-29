import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Name</Label>)
    expect(screen.getByText('Name')).toHaveClass('custom-class')
  })

  it('has correct styling', () => {
    render(<Label>Label</Label>)
    const label = screen.getByText('Label')
    expect(label).toHaveClass('text-sm')
    expect(label).toHaveClass('font-medium')
  })
})
