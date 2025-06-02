import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import { 
  springConfigs, 
  createOptimizedCardClickHandler,
  optimizedCardStyles 
} from '../utils/PerformanceOptimizer';

// Styled components with performance optimizations
const CardContainer = styled(Box)({
  perspective: '1000px',
  cursor: 'pointer',
  width: 'var(--card-width, 120px)',
  height: 'var(--card-height, 120px)',
  padding: 'var(--card-padding, 5px)',
  ...optimizedCardStyles
});

const CardInner = styled(animated.div)({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  ...optimizedCardStyles
});

const CardFace = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  ...optimizedCardStyles
});

const CardFront = styled(CardFace)({
  transform: 'rotateY(180deg)',
});

const CardBack = styled(CardFace)({
  backgroundColor: '#2c2c54',
  border: '2px solid #00aaff',
  transform: 'rotateY(0deg)',
});

const CardImage = styled('img')({
  width: '140%',
  height: '140%',
  objectFit: 'contain',
  userSelect: 'none',
  draggable: false,
  // Performance optimizations for images
  imageRendering: 'crisp-edges',
  transform: 'translateZ(0)', // Force hardware acceleration
});

/**
 * High-performance memory card component with optimized animations
 */
const OptimizedCard = memo(({ 
  card, 
  handleClick, 
  flipped, 
  matched, 
  disabled = false,
  size = 'medium',
  animationSpeed = 'normal'
}) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  
  // Memoized size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      small: { width: '90px', height: '90px', padding: '3px' },
      medium: { width: '120px', height: '120px', padding: '5px' },
      large: { width: '190px', height: '190px', padding: '10px' },
      xlarge: { width: '220px', height: '220px', padding: '10px' }
    };
    return configs[size] || configs.medium;
  }, [size]);

  // Memoized spring config based on animation speed
  const springConfig = useMemo(() => {
    const configs = {
      slow: { tension: 200, friction: 35 },
      normal: springConfigs.cardFlip,
      fast: springConfigs.instant
    };
    return configs[animationSpeed] || configs.normal;
  }, [animationSpeed]);

  // Optimized spring animation
  const { transform } = useSpring({
    transform: flipped || matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
    config: springConfig,
    immediate: disabled,
    // Callback for animation completion
    onRest: useCallback(() => {
      if (cardRef.current) {
        // Clean up any performance markers
        cardRef.current.style.willChange = 'auto';
      }
    }, []),
    // Start callback for animation
    onStart: useCallback(() => {
      if (cardRef.current) {
        cardRef.current.style.willChange = 'transform';
      }
    }, [])
  });

  // Optimized click handler with debouncing
  const optimizedClickHandler = useMemo(
    () => createOptimizedCardClickHandler(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (!disabled && handleClick) {
          handleClick(card);
        }
      },
      100 // Debounce time
    ),
    [card, handleClick, disabled]
  );

  // Keyboard accessibility
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      optimizedClickHandler(event);
    }
  }, [optimizedClickHandler]);

  // Image preloading effect
  useEffect(() => {
    if (imageRef.current && card.image) {
      const img = new Image();
      img.src = card.image;
      img.onload = () => {
        // Image loaded successfully
        if (imageRef.current) {
          imageRef.current.style.opacity = '1';
        }
      };
    }
  }, [card.image]);

  // CSS custom properties for dynamic sizing
  const cardStyle = useMemo(() => ({
    '--card-width': sizeConfig.width,
    '--card-height': sizeConfig.height,
    '--card-padding': sizeConfig.padding,
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto'
  }), [sizeConfig, disabled]);

  // Memoized card state for performance
  const cardState = useMemo(() => ({
    isFlipped: flipped || matched,
    isMatched: matched,
    isDisabled: disabled
  }), [flipped, matched, disabled]);

  return (
    <CardContainer
      ref={cardRef}
      style={cardStyle}
      onClick={optimizedClickHandler}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Memory card ${card.id}${cardState.isFlipped ? ' (flipped)' : ''}${cardState.isMatched ? ' (matched)' : ''}`}
      aria-pressed={cardState.isFlipped}
      data-testid={`memory-card-${card.id}`}
    >
      <CardInner style={{ transform }}>
        {/* Card Front (image) */}
        <CardFront>
          <CardImage
            ref={imageRef}
            src={card.image}
            alt={`Card ${card.id}`}
            loading="lazy"
            style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
          />
        </CardFront>
        
        {/* Card Back */}
        <CardBack>
          <CardImage
            src="/images/Back2.png"
            alt="Card back"
            loading="lazy"
          />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

OptimizedCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  animationSpeed: PropTypes.oneOf(['slow', 'normal', 'fast'])
};

export default OptimizedCard; 