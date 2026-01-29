interface PotentiometerIconProps {
  className?: string;
  size?: number;
  value?: number; // 0-1023
}

export function PotentiometerIcon({ 
  className = '', 
  size = 64, 
  value = 512 
}: PotentiometerIconProps) {
  // Convert value (0-1023) to rotation angle (-135 to 135 degrees)
  const rotation = -135 + (value / 1023) * 270;
  
  return (
    <svg
      width={size}
      height={size * 0.9}
      viewBox="0 0 64 58"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Body gradient - blue plastic */}
        <linearGradient id="potBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A90C2" />
          <stop offset="30%" stopColor="#3A7AAA" />
          <stop offset="70%" stopColor="#2A6A9A" />
          <stop offset="100%" stopColor="#1A5A8A" />
        </linearGradient>
        
        {/* Knob shaft gradient */}
        <linearGradient id="potShaft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="30%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#F0F0F0" />
          <stop offset="70%" stopColor="#E8E8E8" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
        
        {/* Metal lead gradient */}
        <linearGradient id="potLead" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8A8A8" />
          <stop offset="50%" stopColor="#D0D0D0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="potShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Main body - rectangular base */}
      <g filter="url(#potShadow)">
        <rect
          x="8"
          y="8"
          width="48"
          height="32"
          rx="3"
          fill="url(#potBody)"
          stroke="#1A4A6A"
          strokeWidth="1"
        />
        
        {/* Top highlight */}
        <rect
          x="8"
          y="8"
          width="48"
          height="10"
          rx="3"
          fill="white"
          opacity="0.1"
        />
        
        {/* Value marking arcs */}
        <path
          d="M 20 24 A 12 12 0 0 1 44 24"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Shaft mount circle */}
        <circle
          cx="32"
          cy="24"
          r="10"
          fill="#2A5A7A"
          stroke="#1A4A6A"
          strokeWidth="1"
        />
        
        {/* Metal shaft */}
        <circle
          cx="32"
          cy="24"
          r="7"
          fill="url(#potShaft)"
          stroke="#909090"
          strokeWidth="0.5"
        />
        
        {/* Shaft slot/indicator */}
        <g transform={`rotate(${rotation}, 32, 24)`}>
          <rect
            x="31"
            y="18"
            width="2"
            height="8"
            rx="0.5"
            fill="#606060"
          />
        </g>
        
        {/* Value scale dots */}
        {[-120, -60, 0, 60, 120].map((angle, i) => (
          <circle
            key={i}
            cx={32 + 14 * Math.cos((angle - 90) * Math.PI / 180)}
            cy={24 + 14 * Math.sin((angle - 90) * Math.PI / 180)}
            r="1"
            fill="rgba(255,255,255,0.4)"
          />
        ))}
        
        {/* Labels */}
        <text
          x="12"
          y="36"
          fontSize="4"
          fill="rgba(255,255,255,0.6)"
          fontFamily="Arial, sans-serif"
        >
          MIN
        </text>
        <text
          x="44"
          y="36"
          fontSize="4"
          fill="rgba(255,255,255,0.6)"
          fontFamily="Arial, sans-serif"
        >
          MAX
        </text>
      </g>
      
      {/* Left pin (GND) */}
      <rect
        x="14"
        y="40"
        width="3"
        height="18"
        rx="0.5"
        fill="url(#potLead)"
      />
      
      {/* Center pin (Wiper/Signal) */}
      <rect
        x="30.5"
        y="40"
        width="3"
        height="18"
        rx="0.5"
        fill="url(#potLead)"
      />
      
      {/* Right pin (VCC) */}
      <rect
        x="47"
        y="40"
        width="3"
        height="18"
        rx="0.5"
        fill="url(#potLead)"
      />
      
      {/* Pin labels */}
      <text x="15.5" y="50" fontSize="4" fill="#555555" textAnchor="middle" fontFamily="Arial, sans-serif">1</text>
      <text x="32" y="50" fontSize="4" fill="#555555" textAnchor="middle" fontFamily="Arial, sans-serif">2</text>
      <text x="48.5" y="50" fontSize="4" fill="#555555" textAnchor="middle" fontFamily="Arial, sans-serif">3</text>
    </svg>
  );
}
