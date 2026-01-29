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
  const uniqueId = `led-${color}-${isOn}`;
  
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 60 84"
      className={`${className} transition-all duration-100`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main LED body gradient - realistic diffused plastic look */}
        <radialGradient id={`ledBody-${uniqueId}`} cx="50%" cy="40%" r="50%" fx="35%" fy="30%">
          <stop offset="0%" stopColor={isOn ? baseColor : '#444444'} stopOpacity={isOn ? 0.95 : 0.4} />
          <stop offset="60%" stopColor={isOn ? baseColor : '#333333'} stopOpacity={isOn ? 0.7 : 0.3} />
          <stop offset="100%" stopColor={isOn ? glowColor : '#222222'} stopOpacity={isOn ? 0.4 : 0.2} />
        </radialGradient>

        {/* Clear epoxy lens gradient */}
        <linearGradient id={`lensGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>

        {/* Inner die (light source) */}
        <radialGradient id={`diode-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isOn ? '#ffffff' : '#555555'} stopOpacity={isOn ? 1 : 0.3} />
          <stop offset="40%" stopColor={isOn ? baseColor : '#444444'} stopOpacity={isOn ? 1 : 0.4} />
          <stop offset="100%" stopColor={isOn ? glowColor : '#333333'} stopOpacity={isOn ? 0.8 : 0.2} />
        </radialGradient>

        {/* Intense outer glow for ON state */}
        <filter id={`outerGlow-${uniqueId}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="12" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Metal lead gradient */}
        <linearGradient id="metalLead" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8A8A8" />
          <stop offset="30%" stopColor="#D0D0D0" />
          <stop offset="50%" stopColor="#E8E8E8" />
          <stop offset="70%" stopColor="#D0D0D0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
      </defs>
      
      {/* Outer glow halo when ON */}
      {isOn && (
        <>
          <ellipse
            cx="30"
            cy="28"
            rx="28"
            ry="30"
            fill={glowColor}
            opacity="0.15"
          />
          <ellipse
            cx="30"
            cy="28"
            rx="22"
            ry="24"
            fill={glowColor}
            opacity="0.25"
          />
        </>
      )}
      
      {/* LED Dome - 5mm T-1 3/4 package shape */}
      <g filter={isOn ? `url(#outerGlow-${uniqueId})` : undefined}>
        {/* Main epoxy dome body */}
        <path
          d="M14 44 C14 44 14 26 14 22 C14 10 22 4 30 4 C38 4 46 10 46 22 C46 26 46 44 46 44 L14 44 Z"
          fill={`url(#ledBody-${uniqueId})`}
          stroke={isOn ? glowColor : '#555555'}
          strokeWidth="0.5"
          strokeOpacity={isOn ? 0.6 : 0.3}
        />
        
        {/* Clear lens overlay for depth */}
        <path
          d="M16 42 C16 42 16 26 16 22 C16 12 23 6 30 6 C37 6 44 12 44 22 C44 26 44 42 44 42 L16 42 Z"
          fill={`url(#lensGradient-${uniqueId})`}
        />

        {/* Internal die/chip (the actual light source) */}
        <ellipse
          cx="30"
          cy="26"
          rx="8"
          ry="10"
          fill={`url(#diode-${uniqueId})`}
        />

        {/* Reflector cup behind die */}
        <ellipse
          cx="30"
          cy="30"
          rx="10"
          ry="6"
          fill={isOn ? baseColor : '#3a3a3a'}
          opacity={isOn ? 0.5 : 0.2}
        />

        {/* Top specular highlight */}
        <ellipse
          cx="24"
          cy="14"
          rx="6"
          ry="5"
          fill="white"
          opacity={isOn ? 0.6 : 0.25}
        />

        {/* Secondary highlight */}
        <ellipse
          cx="34"
          cy="18"
          rx="3"
          ry="2.5"
          fill="white"
          opacity={isOn ? 0.4 : 0.15}
        />
      </g>

      {/* LED Flange/Base - the rim at the bottom */}
      <g>
        {/* Main flange body */}
        <rect
          x="12"
          y="44"
          width="36"
          height="6"
          rx="1"
          fill="#888888"
        />
        {/* Flange top highlight */}
        <rect
          x="12"
          y="44"
          width="36"
          height="2"
          rx="1"
          fill="#AAAAAA"
        />
        {/* Flat edge indicator (cathode side) */}
        <rect
          x="12"
          y="44"
          width="4"
          height="6"
          fill="#777777"
        />
      </g>

      {/* Cathode Lead (shorter, flat side) */}
      <g>
        <rect
          x="20"
          y="50"
          width="2"
          height="34"
          fill="url(#metalLead)"
          rx="0.3"
        />
        {/* Cathode marker */}
        <text 
          x="21" 
          y="66" 
          fontSize="6" 
          fill="#666666" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          −
        </text>
      </g>

      {/* Anode Lead (longer) */}
      <g>
        <rect
          x="38"
          y="50"
          width="2"
          height="30"
          fill="url(#metalLead)"
          rx="0.3"
        />
        {/* Anode marker */}
        <text 
          x="39" 
          y="66" 
          fontSize="6" 
          fill="#666666" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          +
        </text>
      </g>
    </svg>
  );
}
