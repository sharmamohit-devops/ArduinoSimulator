interface LEDIconProps {
  className?: string;
  size?: number;
  color?: string;
  isOn?: boolean;
}

export function LEDIcon({ 
  className = '', 
  size = 40, 
  color = '#F44336',
  isOn = false 
}: LEDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* LED dome */}
      <ellipse
        cx="20"
        cy="16"
        rx="12"
        ry="14"
        fill={color}
        opacity={isOn ? 1 : 0.5}
        style={{
          filter: isOn ? `drop-shadow(0 0 8px ${color})` : 'none',
          transition: 'all 0.2s ease',
        }}
      />
      
      {/* Highlight */}
      <ellipse
        cx="16"
        cy="12"
        rx="4"
        ry="5"
        fill="white"
        opacity={0.4}
      />
      
      {/* Base */}
      <rect x="14" y="28" width="12" height="4" fill="#9E9E9E" />
      
      {/* Legs */}
      <rect x="16" y="32" width="2" height="8" fill="#757575" />
      <rect x="22" y="32" width="2" height="6" fill="#757575" />
    </svg>
  );
}
