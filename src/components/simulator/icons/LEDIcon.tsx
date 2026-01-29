interface LEDIconProps {
  className?: string;
  size?: number;
  color?: string;
  isOn?: boolean;
}

export function LEDIcon({ 
  className = '', 
  size = 48, 
  color = '#EF4444',
  isOn = false 
}: LEDIconProps) {
  // Calculate glow intensity
  const glowColor = color;
  const glowOpacity = isOn ? 0.8 : 0;
  const lensOpacity = isOn ? 1 : 0.4;
  
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 48 68"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isOn ? `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 20px ${color})` : 'none',
        transition: 'filter 0.15s ease',
      }}
    >
      {/* Outer glow when on */}
      {isOn && (
        <ellipse
          cx="24"
          cy="22"
          rx="22"
          ry="24"
          fill={glowColor}
          opacity={0.3}
        />
      )}
      
      {/* LED dome/lens - 5mm through-hole style */}
      <ellipse
        cx="24"
        cy="22"
        rx="14"
        ry="20"
        fill={color}
        opacity={lensOpacity}
        style={{ transition: 'opacity 0.15s ease' }}
      />
      
      {/* Inner highlight - top */}
      <ellipse
        cx="20"
        cy="14"
        rx="6"
        ry="8"
        fill="white"
        opacity={isOn ? 0.6 : 0.3}
      />
      
      {/* Secondary highlight */}
      <ellipse
        cx="28"
        cy="28"
        rx="3"
        ry="4"
        fill="white"
        opacity={isOn ? 0.3 : 0.15}
      />
      
      {/* LED base/flange */}
      <rect
        x="10"
        y="40"
        width="28"
        height="6"
        rx="1"
        fill="#A0A0A0"
        stroke="#808080"
        strokeWidth="0.5"
      />
      
      {/* Flat edge indicator on base */}
      <rect
        x="10"
        y="40"
        width="4"
        height="6"
        fill="#909090"
      />
      
      {/* Cathode leg (short - flat side) */}
      <rect
        x="16"
        y="46"
        width="2"
        height="22"
        fill="#C0C0C0"
        stroke="#A0A0A0"
        strokeWidth="0.3"
      />
      {/* Cathode bend */}
      <rect
        x="14"
        y="64"
        width="6"
        height="2"
        fill="#C0C0C0"
      />
      
      {/* Anode leg (long) */}
      <rect
        x="30"
        y="46"
        width="2"
        height="18"
        fill="#C0C0C0"
        stroke="#A0A0A0"
        strokeWidth="0.3"
      />
      {/* Anode bend */}
      <rect
        x="28"
        y="60"
        width="6"
        height="2"
        fill="#C0C0C0"
      />
      
      {/* Polarity labels */}
      <text x="17" y="56" fontSize="4" fill="#666" textAnchor="middle" fontFamily="monospace">−</text>
      <text x="31" y="56" fontSize="4" fill="#666" textAnchor="middle" fontFamily="monospace">+</text>
    </svg>
  );
}
