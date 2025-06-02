// Performance optimization utilities for card-flip animations
import { config } from "@react-spring/web";

/**
 * Optimized spring configuration for smooth card animations
 */
export const cardFlipConfig = {
  // Fast, smooth flip animation
  tension: 280,
  friction: 26,
  clamp: true,
  precision: 0.01,
  velocity: 0
};

/**
 * Predefined spring configs for different animation types
 */
export const springConfigs = {
  // Ultra smooth for card flips
  cardFlip: {
    tension: 300,
    friction: 30,
    clamp: true
  },
  
  // Quick response for hover effects
  hover: {
    tension: 400,
    friction: 35,
    clamp: true
  },
  
  // Gentle for reveals and fades
  reveal: {
    tension: 180,
    friction: 25
  },
  
  // Bouncy for success animations
  bounce: config.wobbly,
  
  // Fast for immediate feedback
  instant: config.stiff
};

/**
 * Debounce function to prevent multiple rapid clicks
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance-critical operations
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Optimized card click handler with debouncing
 */
export const createOptimizedCardClickHandler = (
  originalHandler, 
  debounceTime = 100
) => {
  return debounce(originalHandler, debounceTime);
};

/**
 * Performance monitor for card animations
 */
export class AnimationPerformanceMonitor {
  constructor() {
    this.animationCount = 0;
    this.frameCount = 0;
    this.startTime = performance.now();
  }

  trackAnimation() {
    this.animationCount++;
  }

  trackFrame() {
    this.frameCount++;
  }

  getMetrics() {
    const currentTime = performance.now();
    const duration = currentTime - this.startTime;
    
    return {
      fps: Math.round((this.frameCount / duration) * 1000),
      animationsPerSecond: Math.round((this.animationCount / duration) * 1000),
      totalAnimations: this.animationCount,
      totalFrames: this.frameCount,
      duration: Math.round(duration)
    };
  }

  reset() {
    this.animationCount = 0;
    this.frameCount = 0;
    this.startTime = performance.now();
  }
}

/**
 * Memory optimization for card images
 */
export const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

/**
 * Optimized card state management
 */
export const createCardStateManager = () => {
  const cardStates = new Map();
  
  return {
    setCardState: (cardId, state) => {
      cardStates.set(cardId, { ...state, lastUpdate: performance.now() });
    },
    
    getCardState: (cardId) => {
      return cardStates.get(cardId) || null;
    },
    
    isCardAnimating: (cardId) => {
      const state = cardStates.get(cardId);
      return state && state.isAnimating;
    },
    
    clearOldStates: (maxAge = 5000) => {
      const now = performance.now();
      for (const [cardId, state] of cardStates.entries()) {
        if (now - state.lastUpdate > maxAge) {
          cardStates.delete(cardId);
        }
      }
    },
    
    clear: () => {
      cardStates.clear();
    }
  };
};

/**
 * CSS optimization for smooth animations
 */
export const optimizedCardStyles = {
  // Enable hardware acceleration
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  
  // Smooth transitions
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Prevent layout thrashing
  contain: 'layout style paint'
};

/**
 * Intersection Observer for performance optimization
 */
export const createCardIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

/**
 * RAF-based animation scheduler
 */
export class AnimationScheduler {
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }

  schedule(callback) {
    this.queue.push(callback);
    if (!this.isRunning) {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  tick = () => {
    if (this.queue.length > 0) {
      const callback = this.queue.shift();
      callback();
      requestAnimationFrame(this.tick);
    } else {
      this.isRunning = false;
    }
  };

  clear() {
    this.queue = [];
    this.isRunning = false;
  }
}

export default {
  cardFlipConfig,
  springConfigs,
  debounce,
  throttle,
  createOptimizedCardClickHandler,
  AnimationPerformanceMonitor,
  preloadImages,
  createCardStateManager,
  optimizedCardStyles,
  createCardIntersectionObserver,
  AnimationScheduler
}; 