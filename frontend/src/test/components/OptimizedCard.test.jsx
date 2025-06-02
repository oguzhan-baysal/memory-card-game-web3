import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OptimizedCard from '../../components/OptimizedCard'

describe('OptimizedCard', () => {
  const mockCard = {
    id: 1,
    image: '/images/test-card.png'
  }

  const defaultProps = {
    card: mockCard,
    handleClick: vi.fn(),
    flipped: false,
    matched: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders card with correct attributes', () => {
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('aria-label', 'Memory card 1')
      expect(card).toHaveAttribute('data-testid', 'memory-card-1')
    })

    it('renders card back by default', () => {
      render(<OptimizedCard {...defaultProps} />)
      
      const cardBack = screen.getByAltText('Card back')
      expect(cardBack).toBeInTheDocument()
      expect(cardBack).toHaveAttribute('src', '/images/Back2.png')
    })

    it('renders card front image', () => {
      render(<OptimizedCard {...defaultProps} />)
      
      const cardFront = screen.getByAltText('Card 1')
      expect(cardFront).toBeInTheDocument()
      expect(cardFront).toHaveAttribute('src', '/images/test-card.png')
    })
  })

  describe('Interaction', () => {
    it('calls handleClick when card is clicked', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      await user.click(card)
      
      expect(defaultProps.handleClick).toHaveBeenCalledWith(mockCard)
    })

    it('calls handleClick when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')
      
      expect(defaultProps.handleClick).toHaveBeenCalledWith(mockCard)
    })

    it('calls handleClick when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')
      
      expect(defaultProps.handleClick).toHaveBeenCalledWith(mockCard)
    })

    it('does not call handleClick when disabled', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} disabled={true} />)
      
      const card = screen.getByRole('button')
      await user.click(card)
      
      expect(defaultProps.handleClick).not.toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('shows flipped state correctly', () => {
      render(<OptimizedCard {...defaultProps} flipped={true} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'Memory card 1 (flipped)')
      expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    it('shows matched state correctly', () => {
      render(<OptimizedCard {...defaultProps} matched={true} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'Memory card 1 (flipped) (matched)')
    })

    it('shows disabled state correctly', () => {
      render(<OptimizedCard {...defaultProps} disabled={true} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '-1')
      expect(card).toHaveStyle({ opacity: '0.6' })
    })
  })

  describe('Sizes', () => {
    it('applies small size correctly', () => {
      render(<OptimizedCard {...defaultProps} size="small" />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveStyle({
        '--card-width': '90px',
        '--card-height': '90px',
        '--card-padding': '3px'
      })
    })

    it('applies medium size correctly (default)', () => {
      render(<OptimizedCard {...defaultProps} size="medium" />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveStyle({
        '--card-width': '120px',
        '--card-height': '120px',
        '--card-padding': '5px'
      })
    })

    it('applies large size correctly', () => {
      render(<OptimizedCard {...defaultProps} size="large" />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveStyle({
        '--card-width': '190px',
        '--card-height': '190px',
        '--card-padding': '10px'
      })
    })

    it('applies xlarge size correctly', () => {
      render(<OptimizedCard {...defaultProps} size="xlarge" />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveStyle({
        '--card-width': '220px',
        '--card-height': '220px',
        '--card-padding': '10px'
      })
    })
  })

  describe('Performance', () => {
    it('debounces rapid clicks', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      
      // Simulate rapid clicks
      await user.click(card)
      await user.click(card)
      await user.click(card)
      
      // Wait for debounce period
      await waitFor(() => {
        expect(defaultProps.handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('prevents default behavior on click', async () => {
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      const clickEvent = new MouseEvent('click', { bubbles: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')
      
      fireEvent(card, clickEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<OptimizedCard {...defaultProps} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('role', 'button')
      expect(card).toHaveAttribute('tabindex', '0')
      expect(card).toHaveAttribute('aria-pressed', 'false')
    })

    it('updates ARIA attributes when flipped', () => {
      render(<OptimizedCard {...defaultProps} flipped={true} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    it('removes from tab order when disabled', () => {
      render(<OptimizedCard {...defaultProps} disabled={true} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Error Handling', () => {
    it('handles missing image gracefully', () => {
      const cardWithoutImage = { ...mockCard, image: '' }
      
      expect(() => {
        render(<OptimizedCard {...defaultProps} card={cardWithoutImage} />)
      }).not.toThrow()
    })

    it('handles click when handleClick is undefined', async () => {
      const user = userEvent.setup()
      render(<OptimizedCard {...defaultProps} handleClick={undefined} />)
      
      const card = screen.getByRole('button')
      
      expect(() => user.click(card)).not.toThrow()
    })
  })
}) 