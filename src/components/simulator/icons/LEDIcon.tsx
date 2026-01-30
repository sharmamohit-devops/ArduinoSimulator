import { LEDColor, LED_COLORS } from '@/types/simulator';

interface LEDIconProps {
  className?: string;
  size?: number;
  color?: LEDColor;
  isOn?: boolean;
}

export function LEDIcon({ 
  className = '', 
  size = 56, 
  color = 'red',
  isOn = false 
}: LEDIconProps) {
  const colorData = LED_COLORS[color];
  const baseColor = colorData.hex;
  const glowColor = colorData.glow;
  const uniqueId = `led-${color}-${Math.random().toString(36).slice(2, 7)}`;
  
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 60 84"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* LED body gradient */}
        <radialGradient id={`ledBody-${uniqueId}`} cx="50%" cy="40%" r="50%" fx="35%" fy="30%">
          <stop offset="0%" stopColor={isOn ? baseColor : '#555555'} stopOpacity={isOn ? 1 : 0.3} />
          <stop offset="100%" stopColor={isOn ? glowColor : '#333333'} stopOpacity={isOn ? 0.6 : 0.15} />
        </radialGradient>

        {/* Glow filter for ON state */}
        {isOn && (
          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Metal lead gradient */}
        <linearGradient id={`metalLead-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#909090" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
      </defs>
      
      {/* Outer glow when ON */}
      {isOn && (
        <ellipse
          cx="30"
          cy="26"
          rx="20"
          ry="22"
          fill={glowColor}
          opacity="0.3"
        />
      )}
      
      {/* LED Dome */}
      <g filter={isOn ? `url(#glow-${uniqueId})` : undefined}>
        <path
          d="M14 44 C14 44 14 26 14 22 C14 10 22 4 30 4 C38 4 46 10 46 22 C46 26 46 44 46 44 L14 44 Z"
          fill={`url(#ledBody-${uniqueId})`}
          stroke={isOn ? glowColor : '#444444'}
          strokeWidth="1"
          strokeOpacity={isOn ? 0.8 : 0.5}
        />
        
        {/* Light center when ON */}
        {isOn && (
          <ellipse
            cx="30"
            cy="24"
            rx="10"
            ry="12"
            fill={baseColor}
            opacity="0.9"
          />
        )}

        {/* Top highlight */}
        <ellipse
          cx="24"
          cy="14"
          rx="5"
          ry="4"
          fill="white"
          opacity={isOn ? 0.5 : 0.15}
        />
      </g>

      {/* LED Base/Flange */}
      <rect x="12" y="44" width="36" height="6" rx="1" fill="#707070" />
      <rect x="12" y="44" width="36" height="2" fill="#909090" />
      
      {/* Cathode indicator (flat side) */}
      <rect x="12" y="44" width="4" height="6" fill="#606060" />

      {/* Leads */}
      <rect x="20" y="50" width="2" height="30" fill={`url(#metalLead-${uniqueId})`} rx="0.5" />
      <rect x="38" y="50" width="2" height="26" fill={`url(#metalLead-${uniqueId})`} rx="0.5" />
      
      {/* Polarity labels */}
      <text x="21" y="64" fontSize="5" fill="#666" textAnchor="middle" fontFamily="monospace">−</text>
      <text x="39" y="64" fontSize="5" fill="#666" textAnchor="middle" fontFamily="monospace">+</text>
      
      {/* State indicator text */}
      <text 
        x="30" 
        y="78" 
        fontSize="6" 
        fill={isOn ? baseColor : '#555555'} 
        textAnchor="middle" 
        fontFamily="monospace"
        fontWeight="bold"
      >
        {isOn ? 'ON' : 'OFF'}
      </text>
    </svg>
  );
}
