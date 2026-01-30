interface PushButtonIconProps {
  className?: string;
  size?: number;
  isPressed?: boolean;
  interactive?: boolean;
  onToggle?: () => void;
}

export function PushButtonIcon({ 
  className = '', 
  size = 64,
  isPressed = false,
  interactive = false,
  onToggle,
}: PushButtonIconProps) {
  const buttonOffset = isPressed ? 2 : 0;
  
  const handleClick = (e: React.MouseEvent) => {
    if (interactive && onToggle) {
      e.stopPropagation();
      onToggle();
    }
  };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ userSelect: 'none' }}
    >
      <defs>
        <linearGradient id="btnCapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPressed ? "#3a3a3a" : "#4a4a4a"} />
          <stop offset="100%" stopColor={isPressed ? "#2a2a2a" : "#3a3a3a"} />
        </linearGradient>
        
        <linearGradient id="btnHousingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#222222" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>

      {/* Button housing */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="3"
        fill="url(#btnHousingGradient)"
        stroke="#333333"
        strokeWidth="1"
      />
      
      {/* Inner recess */}
      <rect x="12" y="12" width="40" height="40" rx="2" fill="#1a1a1a" />
      
      {/* Button cap */}
      <g style={{ transform: `translateY(${buttonOffset}px)` }}>
        <rect
          x="14"
          y="14"
          width="36"
          height="28"
          rx="3"
          fill="url(#btnCapGradient)"
          stroke={isPressed ? "#4CAF50" : "#404040"}
          strokeWidth="1"
        />
        
        {/* Cap highlight */}
        <rect x="16" y="16" width="32" height="3" rx="1.5" fill="#555555" opacity="0.5" />
        
        {/* Center dome */}
        <circle
          cx="32"
          cy="27"
          r="7"
          fill={isPressed ? "#404040" : "#4a4a4a"}
          stroke={isPressed ? "#4CAF50" : "#454545"}
          strokeWidth="1"
        />
      </g>
      
      {/* Corner pins */}
      <g fill="#A0A0A0">
        <rect x="4" y="16" width="6" height="2" rx="0.5" />
        <rect x="54" y="16" width="6" height="2" rx="0.5" />
        <rect x="4" y="46" width="6" height="2" rx="0.5" />
        <rect x="54" y="46" width="6" height="2" rx="0.5" />
      </g>
      
      {/* State indicator */}
      <circle
        cx="32"
        cy="52"
        r="2.5"
        fill={isPressed ? "#4CAF50" : "#2a2a2a"}
        stroke="#333333"
        strokeWidth="0.5"
      />
      
      {/* State text */}
      <text 
        x="32" 
        y="8" 
        fontSize="5" 
        fill={isPressed ? "#4CAF50" : "#666666"} 
        textAnchor="middle" 
        fontFamily="monospace"
        fontWeight="bold"
      >
        {isPressed ? 'PRESSED' : 'RELEASED'}
      </text>
      
      {/* Interactive hint */}
      {interactive && (
        <text 
          x="32" 
          y="62" 
          fontSize="4" 
          fill="#666666" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          Click to toggle
        </text>
      )}
    </svg>
  );
}
