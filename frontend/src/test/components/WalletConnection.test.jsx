import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WalletConnection from '../../components/WalletConnection'
import { Web3Provider } from '../../context/Web3Context'

// Mock Web3Context
const mockWeb3Context = {
  isConnected: false,
  account: null,
  balance: null,
  network: null,
  isConnecting: false,
  error: null,
  connectWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  copyToClipboard: vi.fn()
}

const MockWeb3Provider = ({ children, value = mockWeb3Context }) => (
  <div data-testid="mock-web3-provider">{children}</div>
)

// Mock the useWeb3 hook
vi.mock('../../context/Web3Context', () => ({
  Web3Provider: MockWeb3Provider,
  useWeb3: () => mockWeb3Context
}))

describe('WalletConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock context to default state
    Object.assign(mockWeb3Context, {
      isConnected: false,
      account: null,
      balance: null,
      network: null,
      isConnecting: false,
      error: null,
      connectWallet: vi.fn(),
      disconnectWallet: vi.fn(),
      copyToClipboard: vi.fn()
    })
  })

  describe('Disconnected State', () => {
    it('renders connect button when not connected', () => {
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Connect MetaMask Wallet')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
    })

    it('calls connectWallet when connect button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const connectButton = screen.getByRole('button', { name: /connect/i })
      await user.click(connectButton)

      expect(mockWeb3Context.connectWallet).toHaveBeenCalled()
    })

    it('shows MetaMask not detected message when ethereum is not available', () => {
      // Mock window.ethereum to be undefined
      global.ethereum = undefined
      
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText(/MetaMask not detected/i)).toBeInTheDocument()
      expect(screen.getByText(/Please install MetaMask/i)).toBeInTheDocument()
    })
  })

  describe('Connecting State', () => {
    it('shows connecting state correctly', () => {
      mockWeb3Context.isConnecting = true

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Connecting...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows connecting animation', () => {
      mockWeb3Context.isConnecting = true

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const loadingSpinner = screen.getByTestId('loading-spinner')
      expect(loadingSpinner).toBeInTheDocument()
    })
  })

  describe('Connected State', () => {
    beforeEach(() => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x1234567890123456789012345678901234567890'
      mockWeb3Context.balance = '1.5'
      mockWeb3Context.network = { name: 'localhost', chainId: 1337 }
    })

    it('shows wallet connected state', () => {
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Wallet Connected')).toBeInTheDocument()
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
      expect(screen.getByText('1.5000 ETH')).toBeInTheDocument()
    })

    it('shows network information', () => {
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Network: localhost')).toBeInTheDocument()
      expect(screen.getByText('Chain ID: 1337')).toBeInTheDocument()
    })

    it('shows copy and disconnect buttons', () => {
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument()
    })

    it('calls copyToClipboard when copy button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)

      expect(mockWeb3Context.copyToClipboard).toHaveBeenCalledWith(mockWeb3Context.account)
    })

    it('calls disconnectWallet when disconnect button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i })
      await user.click(disconnectButton)

      expect(mockWeb3Context.disconnectWallet).toHaveBeenCalled()
    })
  })

  describe('Error State', () => {
    it('shows error message when there is an error', () => {
      mockWeb3Context.error = 'Connection failed'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Error: Connection failed')).toBeInTheDocument()
    })

    it('shows retry button on error', () => {
      mockWeb3Context.error = 'Connection failed'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('clears error and retries connection on retry button click', async () => {
      const user = userEvent.setup()
      mockWeb3Context.error = 'Connection failed'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      expect(mockWeb3Context.connectWallet).toHaveBeenCalled()
    })
  })

  describe('Address Formatting', () => {
    it('formats long addresses correctly', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x1234567890123456789012345678901234567890'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    })

    it('handles short addresses', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x123'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('0x123')).toBeInTheDocument()
    })
  })

  describe('Balance Formatting', () => {
    it('formats balance with 4 decimal places', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x123'
      mockWeb3Context.balance = '1.23456789'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('1.2346 ETH')).toBeInTheDocument()
    })

    it('handles null balance', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x123'
      mockWeb3Context.balance = null

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('0.0000 ETH')).toBeInTheDocument()
    })
  })

  describe('Network Display', () => {
    it('shows network information when available', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x123'
      mockWeb3Context.network = { name: 'mainnet', chainId: 1 }

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Network: mainnet')).toBeInTheDocument()
      expect(screen.getByText('Chain ID: 1')).toBeInTheDocument()
    })

    it('handles missing network information', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x123'
      mockWeb3Context.network = null

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Network: Unknown')).toBeInTheDocument()
      expect(screen.getByText('Chain ID: Unknown')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      const connectButton = screen.getByRole('button', { name: /connect/i })
      expect(connectButton).toHaveAttribute('type', 'button')
    })

    it('provides screen reader friendly content', () => {
      mockWeb3Context.isConnected = true
      mockWeb3Context.account = '0x1234567890123456789012345678901234567890'

      render(
        <Web3Provider>
          <WalletConnection />
        </Web3Provider>
      )

      expect(screen.getByText('Wallet Connected')).toBeInTheDocument()
      expect(screen.getByLabelText(/wallet address/i)).toBeInTheDocument()
    })
  })
}) 