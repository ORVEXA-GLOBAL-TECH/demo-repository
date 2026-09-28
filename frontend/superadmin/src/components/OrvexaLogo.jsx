import React from 'react';

/**
 * High-definition SVG Logo Mark for Orvexa Global
 */
export function OrvexaLogoIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="orvexaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="orvexaDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="orvexaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Hexagonal Shield Background */}
      <path
        d="M20 3L35 10.5V23C35 30.5 28.5 35.8 20 38.5C11.5 35.8 5 30.5 5 23V10.5L20 3Z"
        fill="url(#orvexaGoldGrad)"
        filter="url(#orvexaGlow)"
      />

      {/* Inner Dark Inset Shield */}
      <path
        d="M20 5.8L32.5 12V22.2C32.5 28.3 27.2 33 20 35.4C12.8 33 7.5 28.3 7.5 22.2V12L20 5.8Z"
        fill="url(#orvexaDarkGrad)"
      />

      {/* Sovereign Crown / Chevron Core Monogram */}
      <path
        d="M13 24.5L14.8 15.5L18 19.5L20 13.5L22 19.5L25.2 15.5L27 24.5H13Z"
        fill="url(#orvexaGoldGrad)"
      />

      {/* Golden Base Bar */}
      <rect x="13" y="25.5" width="14" height="2.2" rx="1.1" fill="#fbbf24" />

      {/* Apex Sparkle Star */}
      <circle cx="20" cy="11.2" r="1.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * Complete Brand Lockup (Icon + Typography + Console Badge)
 */
export function OrvexaLogoFull({ isLight = false, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style
      }}
      title="Orvexa Global Enterprise Console"
    >
      <OrvexaLogoIcon size={34} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: isLight ? '#0f172a' : '#ffffff',
            fontFamily: 'inherit'
          }}>
            Orvexa
          </span>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: '700',
            color: '#f59e0b',
            letterSpacing: '-0.02em'
          }}>
            Global
          </span>
        </div>
        <span style={{
          fontSize: '0.66rem',
          fontWeight: '700',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: isLight ? '#64748b' : '#fbbf24'
        }}>
          Super Admin Console
        </span>
      </div>
    </div>
  );
}

export default OrvexaLogoFull;
