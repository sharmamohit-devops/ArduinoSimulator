interface PushButtonIconProps {
  className?: string;
  size?: number;
  isPressed?: boolean;
}

export function PushButtonIcon({ 
  className = '', 
  size = 40,
  isPressed = false 
}: PushButtonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Button base/housing */}
      <rect
        x="6"
        y="6"
        width="28"
        height="28"
        rx="2"
        fill="#212121"
        stroke="#424242"
        strokeWidth="1"
      />
      
      {/* Button cap */}
      <rect
        x="10"
        y={isPressed ? "12" : "10"}
        width="20"
        height="20"
        rx="2"
        fill="#455A64"
        stroke="#37474F"
        strokeWidth="1"
        style={{ transition: 'y 0.1s ease' }}
      />
      
      {/* Top highlight */}
      <rect
        x="12"
        y={isPressed ? "14" : "12"}
        width="16"
        height="4"
        rx="1"
        fill="#546E7A"
        opacity={0.6}
        style={{ transition: 'y 0.1s ease' }}
      />
      
      {/* Corner pins */}
      <rect x="2" y="8" width="4" height="2" fill="#FFC107" />
      <rect x="2" y="30" width="4" height="2" fill="#FFC107" />
      <rect x="34" y="8" width="4" height="2" fill="#FFC107" />
      <rect x="34" y="30" width="4" height="2" fill="#FFC107" />
    </svg>
  );
}
