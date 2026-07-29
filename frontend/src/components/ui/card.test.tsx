import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<Card><CardHeader>Header</CardHeader></Card>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders children', () => {
    render(<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('has correct styling', () => {
    render(<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>)
    const title = screen.getByText('Title')
    expect(title).toHaveClass('text-2xl')
    expect(title).toHaveClass('font-semibold')
  })
})

describe('CardDescription', () => {
  it('renders children', () => {
    render(<Card><CardHeader><CardDescription>Description</CardDescription></CardHeader></Card>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<Card><CardContent>Content</CardContent></Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<Card><CardFooter>Footer</CardFooter></Card>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
