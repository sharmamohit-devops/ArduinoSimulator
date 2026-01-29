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
  const buttonOffset = isPressed ? 3 : 0;
  
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
        {/* Button cap gradient */}
        <linearGradient id="capGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPressed ? "#404040" : "#555555"} />
          <stop offset="50%" stopColor={isPressed ? "#353535" : "#454545"} />
          <stop offset="100%" stopColor={isPressed ? "#2a2a2a" : "#353535"} />
        </linearGradient>
        
        {/* Housing gradient */}
        <linearGradient id="housingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#252525" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="buttonShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.5" />
        </filter>
        
        {/* Pressed glow */}
        <filter id="pressedGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#4CAF50" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Button base/housing - black plastic body */}
      <g filter="url(#buttonShadow)">
        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="4"
          fill="url(#housingGradient)"
          stroke="#303030"
          strokeWidth="1"
        />
        
        {/* Inner recess */}
        <rect
          x="12"
          y="12"
          width="40"
          height="40"
          rx="2"
          fill="#1a1a1a"
        />
      </g>
      
      {/* Button cap - moves when pressed */}
      <g 
        style={{ 
          transform: `translateY(${buttonOffset}px)`, 
          transition: 'transform 0.08s ease-out' 
        }}
        filter={isPressed ? "url(#pressedGlow)" : "none"}
      >
        {/* Button shadow (inside housing) */}
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          rx="3"
          fill="#0f0f0f"
        />
        
        {/* Main button cap */}
        <rect
          x="14"
          y="14"
          width="36"
          height="30"
          rx="4"
          fill="url(#capGradient)"
          stroke={isPressed ? "#4CAF50" : "#404040"}
          strokeWidth="1"
        />
        
        {/* Cap top surface highlight */}
        <rect
          x="16"
          y="16"
          width="32"
          height="4"
          rx="2"
          fill="#666666"
          opacity={isPressed ? 0.3 : 0.5}
        />
        
        {/* Tactile dome/nub */}
        <circle
          cx="32"
          cy="28"
          r="8"
          fill={isPressed ? "#4a4a4a" : "#5a5a5a"}
          stroke={isPressed ? "#4CAF50" : "#505050"}
          strokeWidth="1"
        />
        
        {/* Dome highlight */}
        <ellipse
          cx="30"
          cy="25"
          rx="3"
          ry="2"
          fill="#888888"
          opacity={isPressed ? 0.2 : 0.4}
        />
        
        {/* Inner dome detail */}
        <circle
          cx="32"
          cy="28"
          r="4"
          fill={isPressed ? "#404040" : "#4a4a4a"}
        />
      </g>
      
      {/* Corner pins - 4-pin tactile switch style */}
      <g fill="#C0C0C0">
        {/* Top-left */}
        <rect x="2" y="16" width="8" height="3" rx="0.5" />
        <rect x="0" y="14.5" width="4" height="6" rx="0.5" fill="#A0A0A0" />
        
        {/* Top-right */}
        <rect x="54" y="16" width="8" height="3" rx="0.5" />
        <rect x="60" y="14.5" width="4" height="6" rx="0.5" fill="#A0A0A0" />
        
        {/* Bottom-left */}
        <rect x="2" y="45" width="8" height="3" rx="0.5" />
        <rect x="0" y="43.5" width="4" height="6" rx="0.5" fill="#A0A0A0" />
        
        {/* Bottom-right */}
        <rect x="54" y="45" width="8" height="3" rx="0.5" />
        <rect x="60" y="43.5" width="4" height="6" rx="0.5" fill="#A0A0A0" />
      </g>
      
      {/* State indicator LED */}
      <circle
        cx="32"
        cy="54"
        r="3"
        fill={isPressed ? "#4CAF50" : "#1a1a1a"}
        stroke="#303030"
        strokeWidth="0.5"
        style={{
          filter: isPressed ? 'drop-shadow(0 0 6px #4CAF50)' : 'none',
          transition: 'all 0.15s ease',
        }}
      />
      
      {/* Status text */}
      <text 
        x="32" 
        y="9" 
        fontSize="5" 
        fill={isPressed ? "#4CAF50" : "#666666"} 
        textAnchor="middle" 
        fontFamily="monospace"
        fontWeight="bold"
      >
        {isPressed ? 'PRESSED' : 'PUSH'}
      </text>
      
      {/* Interactive hint */}
      {interactive && !isPressed && (
        <g opacity="0.6">
          <text x="32" y="62" fontSize="4" fill="#888888" textAnchor="middle" fontFamily="sans-serif">
            Click to toggle
          </text>
        </g>
      )}
    </svg>
  );
}
