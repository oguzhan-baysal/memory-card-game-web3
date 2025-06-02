import { describe, it, expect, vi } from 'vitest'
import { debounce } from '../utils/PerformanceOptimizer'

describe('Simple Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test debounce function', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)
    
    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()
    
    // This is a basic test - more advanced timing tests would need fake timers
    expect(typeof debouncedFn).toBe('function')
  })
}) 