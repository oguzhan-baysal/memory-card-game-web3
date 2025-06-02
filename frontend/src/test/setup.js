import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
})

// Mock window.ethereum
global.ethereum = {
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  isMetaMask: true,
}

// Mock Image constructor
global.Image = class {
  constructor() {
    this.onload = null
    this.onerror = null
    this.src = ''
  }
}

// Mock Audio constructor
global.Audio = class {
  constructor() {
    this.play = vi.fn()
    this.pause = vi.fn()
    this.volume = 1
  }
} 