interface PushButtonIconProps {
  className?: string;
  size?: number;
  isPressed?: boolean;
  interactive?: boolean;
  onPress?: () => void;
  onRelease?: () => void;
}

export function PushButtonIcon({ 
  className = '', 
  size = 56,
  isPressed = false,
  interactive = false,
  onPress,
  onRelease,
}: PushButtonIconProps) {
  const buttonOffset = isPressed ? 2 : 0;
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (interactive && onPress) {
      e.stopPropagation();
      onPress();
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (interactive && onRelease) {
      e.stopPropagation();
      onRelease();
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (interactive && isPressed && onRelease) {
      e.stopPropagation();
      onRelease();
    }
  };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ userSelect: 'none' }}
    >
      {/* Button base/housing - black plastic */}
      <rect
        x="8"
        y="8"
        width="40"
        height="40"
        rx="2"
        fill="#1A1A1A"
        stroke="#333"
        strokeWidth="1"
      />
      
      {/* Inner housing detail */}
      <rect
        x="12"
        y="12"
        width="32"
        height="32"
        rx="1"
        fill="#252525"
      />
      
      {/* Button cap - moves when pressed */}
      <g style={{ transform: `translateY(${buttonOffset}px)`, transition: 'transform 0.05s ease' }}>
        {/* Button shadow */}
        <rect
          x="16"
          y="16"
          width="24"
          height="24"
          rx="2"
          fill="#151515"
        />
        
        {/* Button cap */}
        <rect
          x="14"
          y={14}
          width="28"
          height="24"
          rx="2"
          fill={isPressed ? '#3D3D3D' : '#4A4A4A'}
          stroke="#555"
          strokeWidth="0.5"
        />
        
        {/* Cap top surface */}
        <rect
          x="16"
          y={16}
          width="24"
          height="18"
          rx="1"
          fill={isPressed ? '#454545' : '#555'}
        />
        
        {/* Tactile dome/nub */}
        <circle
          cx="28"
          cy={24}
          r="6"
          fill={isPressed ? '#505050' : '#606060'}
          stroke="#666"
          strokeWidth="0.5"
        />
        
        {/* Highlight on dome */}
        <ellipse
          cx="26"
          cy={22}
          rx="2"
          ry="1.5"
          fill="#888"
          opacity={isPressed ? 0.3 : 0.5}
        />
      </g>
      
      {/* Corner pins - 4-pin tactile switch style */}
      {/* Top-left */}
      <rect x="4" y="14" width="6" height="2.5" rx="0.3" fill="#C0C0C0" />
      <rect x="2" y="13" width="4" height="4.5" rx="0.3" fill="#A0A0A0" />
      
      {/* Top-right */}
      <rect x="46" y="14" width="6" height="2.5" rx="0.3" fill="#C0C0C0" />
      <rect x="50" y="13" width="4" height="4.5" rx="0.3" fill="#A0A0A0" />
      
      {/* Bottom-left */}
      <rect x="4" y="39.5" width="6" height="2.5" rx="0.3" fill="#C0C0C0" />
      <rect x="2" y="38.5" width="4" height="4.5" rx="0.3" fill="#A0A0A0" />
      
      {/* Bottom-right */}
      <rect x="46" y="39.5" width="6" height="2.5" rx="0.3" fill="#C0C0C0" />
      <rect x="50" y="38.5" width="4" height="4.5" rx="0.3" fill="#A0A0A0" />
      
      {/* State indicator when pressed */}
      {isPressed && (
        <circle
          cx="28"
          cy="50"
          r="2"
          fill="#4CAF50"
          style={{ filter: 'drop-shadow(0 0 4px #4CAF50)' }}
        />
      )}
    </svg>
  );
}
