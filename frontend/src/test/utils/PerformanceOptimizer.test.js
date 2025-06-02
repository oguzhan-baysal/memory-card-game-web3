import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  debounce,
  throttle,
  createOptimizedCardClickHandler,
  AnimationPerformanceMonitor,
  preloadImages,
  createCardStateManager,
  AnimationScheduler
} from '../../utils/PerformanceOptimizer'

describe('PerformanceOptimizer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllTimers()
  })

  describe('debounce', () => {
    it('delays function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('cancels previous calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      debouncedFn('second')
      debouncedFn('third')

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('third')
    })

    it('preserves function context', () => {
      const obj = {
        value: 'test',
        fn: vi.fn(function() { return this.value })
      }
      const debouncedFn = debounce(obj.fn.bind(obj), 100)

      debouncedFn()
      vi.advanceTimersByTime(100)

      expect(obj.fn).toHaveBeenCalled()
    })
  })

  describe('throttle', () => {
    it('limits function calls', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('first')
      throttledFn('second')
      throttledFn('third')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('first')
    })

    it('allows calls after throttle period', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('first')
      vi.advanceTimersByTime(100)
      throttledFn('second')

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
      expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
    })
  })

  describe('createOptimizedCardClickHandler', () => {
    it('creates a debounced click handler', () => {
      const mockHandler = vi.fn()
      const optimizedHandler = createOptimizedCardClickHandler(mockHandler, 50)

      optimizedHandler('test')
      optimizedHandler('test2')

      expect(mockHandler).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(mockHandler).toHaveBeenCalledTimes(1)
      expect(mockHandler).toHaveBeenCalledWith('test2')
    })
  })

  describe('AnimationPerformanceMonitor', () => {
    it('tracks animations and frames', () => {
      const monitor = new AnimationPerformanceMonitor()

      monitor.trackAnimation()
      monitor.trackAnimation()
      monitor.trackFrame()
      monitor.trackFrame()
      monitor.trackFrame()

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnimations).toBe(2)
      expect(metrics.totalFrames).toBe(3)
      expect(metrics.duration).toBeGreaterThan(0)
    })

    it('calculates FPS and animations per second', () => {
      const monitor = new AnimationPerformanceMonitor()
      
      // Simulate some time passing
      vi.advanceTimersByTime(1000)
      
      monitor.trackFrame()
      monitor.trackFrame()
      monitor.trackAnimation()

      const metrics = monitor.getMetrics()
      expect(typeof metrics.fps).toBe('number')
      expect(typeof metrics.animationsPerSecond).toBe('number')
    })

    it('resets metrics correctly', () => {
      const monitor = new AnimationPerformanceMonitor()

      monitor.trackAnimation()
      monitor.trackFrame()
      monitor.reset()

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnimations).toBe(0)
      expect(metrics.totalFrames).toBe(0)
    })
  })

  describe('preloadImages', () => {
    it('preloads images successfully', async () => {
      const mockImageUrls = ['/image1.png', '/image2.png']

      // Mock Image constructor
      global.Image = vi.fn().mockImplementation(() => {
        const img = {
          onload: null,
          onerror: null,
          src: ''
        }
        // Simulate successful load
        setTimeout(() => {
          if (img.onload) img.onload()
        }, 0)
        return img
      })

      const result = await preloadImages(mockImageUrls)
      expect(result).toHaveLength(2)
    })

    it('handles image load errors', async () => {
      const mockImageUrls = ['/invalid-image.png']

      global.Image = vi.fn().mockImplementation(() => {
        const img = {
          onload: null,
          onerror: null,
          src: ''
        }
        // Simulate error
        setTimeout(() => {
          if (img.onerror) img.onerror()
        }, 0)
        return img
      })

      await expect(preloadImages(mockImageUrls)).rejects.toBeUndefined()
    })
  })

  describe('createCardStateManager', () => {
    it('manages card states correctly', () => {
      const manager = createCardStateManager()

      manager.setCardState(1, { isAnimating: true, flipped: false })
      manager.setCardState(2, { isAnimating: false, flipped: true })

      expect(manager.getCardState(1)).toMatchObject({ isAnimating: true, flipped: false })
      expect(manager.getCardState(2)).toMatchObject({ isAnimating: false, flipped: true })
      expect(manager.getCardState(3)).toBeNull()
    })

    it('checks if card is animating', () => {
      const manager = createCardStateManager()

      manager.setCardState(1, { isAnimating: true })
      manager.setCardState(2, { isAnimating: false })

      expect(manager.isCardAnimating(1)).toBe(true)
      expect(manager.isCardAnimating(2)).toBe(false)
      expect(manager.isCardAnimating(3)).toBe(false)
    })

    it('clears old states', () => {
      const manager = createCardStateManager()

      manager.setCardState(1, { isAnimating: true })
      
      // Advance time to make state old
      vi.advanceTimersByTime(6000)
      
      manager.clearOldStates(5000)
      expect(manager.getCardState(1)).toBeNull()
    })

    it('clears all states', () => {
      const manager = createCardStateManager()

      manager.setCardState(1, { isAnimating: true })
      manager.setCardState(2, { isAnimating: false })
      manager.clear()

      expect(manager.getCardState(1)).toBeNull()
      expect(manager.getCardState(2)).toBeNull()
    })
  })

  describe('AnimationScheduler', () => {
    it('schedules and executes animations', () => {
      const scheduler = new AnimationScheduler()
      const mockCallback1 = vi.fn()
      const mockCallback2 = vi.fn()

      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((cb) => {
        setTimeout(cb, 16) // ~60fps
        return 1
      })

      scheduler.schedule(mockCallback1)
      scheduler.schedule(mockCallback2)

      expect(mockCallback1).not.toHaveBeenCalled()
      expect(mockCallback2).not.toHaveBeenCalled()

      // Advance timers to execute animations
      vi.advanceTimersByTime(16)
      expect(mockCallback1).toHaveBeenCalled()

      vi.advanceTimersByTime(16)
      expect(mockCallback2).toHaveBeenCalled()
    })

    it('clears animation queue', () => {
      const scheduler = new AnimationScheduler()
      const mockCallback = vi.fn()

      scheduler.schedule(mockCallback)
      scheduler.clear()

      expect(scheduler.queue).toHaveLength(0)
      expect(scheduler.isRunning).toBe(false)
    })
  })
}) 