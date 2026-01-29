interface LEDIconProps {
  className?: string;
  size?: number;
  color?: string;
  isOn?: boolean;
}

export function LEDIcon({ 
  className = '', 
  size = 56, 
  color = '#EF4444',
  isOn = false 
}: LEDIconProps) {
  // Calculate colors based on base color
  const glowIntensity = isOn ? 1 : 0;
  
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 56 84"
      className={`${className} transition-all duration-150`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow gradient for when LED is on */}
        <radialGradient id={`ledGlow-${isOn}`} cx="50%" cy="35%" r="60%" fx="40%" fy="30%">
          <stop offset="0%" stopColor={color} stopOpacity={isOn ? 1 : 0.3} />
          <stop offset="40%" stopColor={color} stopOpacity={isOn ? 0.8 : 0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={isOn ? 0.3 : 0.05} />
        </radialGradient>
        
        {/* Lens highlight */}
        <radialGradient id="lensHighlight" cx="30%" cy="20%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        
        {/* Shadow filter */}
        <filter id="ledShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
        </filter>
        
        {/* Intense glow for ON state */}
        <filter id="intensGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor={color} floodOpacity="0.8" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer glow when on */}
      {isOn && (
        <ellipse
          cx="28"
          cy="28"
          rx="30"
          ry="32"
          fill={color}
          opacity="0.25"
          style={{
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      )}
      
      {/* LED dome/lens - 5mm style */}
      <g filter={isOn ? "url(#intensGlow)" : "url(#ledShadow)"}>
        {/* Main LED body */}
        <ellipse
          cx="28"
          cy="26"
          rx="16"
          ry="24"
          fill={`url(#ledGlow-${isOn})`}
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          style={{
            transition: 'all 0.15s ease',
          }}
        />
        
        {/* Inner core - brighter when on */}
        <ellipse
          cx="28"
          cy="24"
          rx="10"
          ry="16"
          fill={color}
          opacity={isOn ? 0.9 : 0.3}
          style={{
            transition: 'opacity 0.15s ease',
          }}
        />
        
        {/* Top highlight reflection */}
        <ellipse
          cx="23"
          cy="16"
          rx="6"
          ry="8"
          fill="url(#lensHighlight)"
          opacity={isOn ? 0.9 : 0.5}
        />
        
        {/* Secondary highlight */}
        <ellipse
          cx="33"
          cy="32"
          rx="3"
          ry="4"
          fill="white"
          opacity={isOn ? 0.4 : 0.2}
        />
      </g>
      
      {/* LED base/flange - realistic plastic rim */}
      <g>
        <rect
          x="12"
          y="48"
          width="32"
          height="8"
          rx="1.5"
          fill="#B0B0B0"
          stroke="#909090"
          strokeWidth="0.5"
        />
        {/* Flange highlight */}
        <rect
          x="12"
          y="48"
          width="32"
          height="3"
          rx="1.5"
          fill="#D0D0D0"
          opacity="0.6"
        />
        {/* Flat edge indicator (cathode marker) */}
        <rect
          x="12"
          y="48"
          width="5"
          height="8"
          fill="#A0A0A0"
        />
      </g>
      
      {/* Cathode leg (short - flat side) */}
      <g>
        <rect
          x="18"
          y="56"
          width="2.5"
          height="28"
          fill="linear-gradient(180deg, #C0C0C0 0%, #909090 100%)"
          rx="0.3"
        />
        <rect x="18" y="56" width="2.5" height="4" fill="#D0D0D0" opacity="0.6" />
        {/* Cathode marker */}
        <text x="19.25" y="70" fontSize="5" fill="#505050" textAnchor="middle" fontFamily="monospace" fontWeight="bold">−</text>
      </g>
      
      {/* Anode leg (long) */}
      <g>
        <rect
          x="35.5"
          y="56"
          width="2.5"
          height="24"
          fill="linear-gradient(180deg, #C0C0C0 0%, #909090 100%)"
          rx="0.3"
        />
        <rect x="35.5" y="56" width="2.5" height="4" fill="#D0D0D0" opacity="0.6" />
        {/* Anode marker */}
        <text x="36.75" y="70" fontSize="5" fill="#505050" textAnchor="middle" fontFamily="monospace" fontWeight="bold">+</text>
      </g>
      
      {/* Status text */}
      <text 
        x="28" 
        y="42" 
        fontSize="6" 
        fill={isOn ? "#FFFFFF" : "#666666"} 
        textAnchor="middle" 
        fontFamily="monospace"
        fontWeight="bold"
        style={{
          textShadow: isOn ? `0 0 10px ${color}` : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        {isOn ? 'ON' : 'OFF'}
      </text>
      
      {/* Animated pulse ring when on */}
      {isOn && (
        <circle
          cx="28"
          cy="26"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.4"
          style={{
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      )}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.25; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(1.05); }
          }
          @keyframes ping {
            75%, 100% { transform: scale(1.5); opacity: 0; }
          }
        `}
      </style>
    </svg>
  );
}
