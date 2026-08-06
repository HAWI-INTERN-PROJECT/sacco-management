import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'

describe('LandingPage', () => {
  it('renders navbar correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    
    // Check brand name
    expect(screen.getByText('SACCO MS')).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register sacco/i })).toBeInTheDocument()
  })

  it('renders hero section correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText(/modern sacco/i)).toBeInTheDocument()
    expect(screen.getByText(/management platform/i)).toBeInTheDocument()
    expect(screen.getAllByText(/get started/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/learn more/i)).toBeInTheDocument()
  })

  it('renders features section correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Everything You Need')).toBeInTheDocument()
    expect(screen.getByText('Member Management')).toBeInTheDocument()
    expect(screen.getByText('Savings & Loans')).toBeInTheDocument()
    expect(screen.getByText('Dividend Distribution')).toBeInTheDocument()
    expect(screen.getByText('Multi-Tenant Platform')).toBeInTheDocument()
  })

  it('renders how it works section correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText('Register Your SACCO')).toBeInTheDocument()
    expect(screen.getByText('Add Members')).toBeInTheDocument()
    expect(screen.getByText('Start Managing')).toBeInTheDocument()
  })

  it('renders footer correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('HAWI')).toBeInTheDocument()
    expect(screen.getByText('Software Solutions')).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Hawi Software Solutions/i)).toBeInTheDocument()
  })
})
