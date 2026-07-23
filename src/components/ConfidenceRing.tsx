import React, { useEffect, useState } from 'react';

type ConfidenceRingProps = {
  value?: number; // 0 to 100
  state?: 'indeterminate' | 'settled';
  size?: 'sm' | 'md' | 'lg';
  predictionClass?: 'flagged' | 'uncertain' | 'benign-leaning';
};

export default function ConfidenceRing({
  value = 0,
  state = 'settled',
  size = 'lg',
  predictionClass = 'uncertain',
}: ConfidenceRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (state === 'settled') {
      // Trigger animation on mount or value change
      // A small delay ensures the transition runs after initial render
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [value, state]);

  const sizeMap = {
    lg: { width: 200, stroke: 10 },
    md: { width: 96, stroke: 6 },
    sm: { width: 48, stroke: 4 },
  };

  const { width, stroke } = sizeMap[size];
  const center = 100; // SVG viewBox is 0 0 200 200
  // Adjust radius based on stroke to fit inside viewBox
  // For lg: 100 - 5 = 95
  const normalizedRadius = 100 - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const colorMap = {
    flagged: 'var(--color-brick)',
    uncertain: 'var(--color-ochre)',
    'benign-leaning': 'var(--color-moss)',
  };

  const ringColor = colorMap[predictionClass];

  let dasharray = `${circumference} ${circumference}`;
  let dashoffset = circumference;
  
  if (state === 'indeterminate') {
    dasharray = `${circumference * 0.25} ${circumference}`;
    dashoffset = 0;
  } else {
    dashoffset = circumference - (animatedValue / 100) * circumference;
  }

  // The indeterminate animation is now handled in SVG styles


  return (
    <div className={`relative flex items-center justify-center`} style={{ width, height: width }}>
      {/* Screen reader text */}
      <span className="sr-only">
        {state === 'indeterminate' 
          ? 'Analyzing' 
          : `${Math.round(value)} percent confidence, ${predictionClass}`}
      </span>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="overflow-visible"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <style>
          {`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            .motion-safe-spin { animation: spin 900ms linear infinite; }
            @media (prefers-reduced-motion: reduce) {
              .motion-safe-spin { animation: none !important; }
              .motion-safe-transition { transition: none !important; }
            }
          `}
        </style>
        
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={normalizedRadius}
          fill="transparent"
          stroke="var(--color-hairline)"
          strokeWidth={stroke}
        />
        
        {/* Foreground Arc */}
        <circle
          cx={center}
          cy={center}
          r={normalizedRadius}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
          style={{
            transformOrigin: '100px 100px',
            transition: state === 'settled' ? 'stroke-dashoffset 600ms cubic-bezier(0, 0, 0.2, 1)' : 'none',
          }}
          className={state === 'indeterminate' ? 'motion-safe-spin' : 'motion-safe-transition'}
        />
      </svg>

      {/* Center Text (only for lg and md sizes, sm is too small) */}
      {size !== 'sm' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {state === 'indeterminate' ? (
            <span className="text-body-sm font-semibold text-ink motion-safe:animate-pulse">
              Analyzing…
            </span>
          ) : (
            <>
              <span 
                className="text-ring text-ink"
                style={{ fontSize: size === 'md' ? '28px' : '56px' }}
              >
                {Math.round(value)}
              </span>
              {size === 'lg' && (
                <span className="text-body-sm text-ink-muted mt-1">
                  confidence
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
