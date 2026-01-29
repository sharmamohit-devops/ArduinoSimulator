import { ResistorValue, RESISTOR_VALUES } from '@/types/simulator';

interface ResistorIconProps {
  className?: string;
  size?: number;
  value?: ResistorValue;
}

export function ResistorIcon({ 
  className = '', 
  size = 80, 
  value = '220'
}: ResistorIconProps) {
  const resistorData = RESISTOR_VALUES[value];
  const bands = resistorData.bands;
  
  // Scale factor based on size
  const scale = size / 80;
  const width = 80 * scale;
  const height = 32 * scale;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metal lead gradient */}
        <linearGradient id="resistorLead" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D0D0D0" />
          <stop offset="30%" stopColor="#A0A0A0" />
          <stop offset="70%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        
        {/* Body gradient - ceramic/carbon look */}
        <linearGradient id="resistorBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8DCC8" />
          <stop offset="20%" stopColor="#D4C8B4" />
          <stop offset="50%" stopColor="#C4B8A4" />
          <stop offset="80%" stopColor="#B8AC98" />
          <stop offset="100%" stopColor="#A8A090" />
        </linearGradient>
        
        {/* Subtle shadow */}
        <filter id="resistorShadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Left wire lead */}
      <rect
        x="0"
        y="14"
        width="18"
        height="4"
        rx="0.5"
        fill="url(#resistorLead)"
      />
      
      {/* Right wire lead */}
      <rect
        x="62"
        y="14"
        width="18"
        height="4"
        rx="0.5"
        fill="url(#resistorLead)"
      />
      
      {/* Main body - cylindrical resistor shape */}
      <g filter="url(#resistorShadow)">
        {/* Body background */}
        <rect
          x="16"
          y="4"
          width="48"
          height="24"
          rx="4"
          fill="url(#resistorBody)"
        />
        
        {/* Body highlight (top edge) */}
        <rect
          x="16"
          y="4"
          width="48"
          height="8"
          rx="4"
          fill="white"
          opacity="0.15"
        />
        
        {/* Left cap */}
        <rect
          x="16"
          y="6"
          width="4"
          height="20"
          rx="2"
          fill="#B8AC98"
        />
        
        {/* Right cap */}
        <rect
          x="60"
          y="6"
          width="4"
          height="20"
          rx="2"
          fill="#B8AC98"
        />
        
        {/* Color Band 1 */}
        <rect
          x="24"
          y="6"
          width="6"
          height="20"
          rx="0.5"
          fill={bands[0]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Color Band 2 */}
        <rect
          x="32"
          y="6"
          width="6"
          height="20"
          rx="0.5"
          fill={bands[1]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Color Band 3 (multiplier) */}
        <rect
          x="40"
          y="6"
          width="6"
          height="20"
          rx="0.5"
          fill={bands[2]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Color Band 4 (tolerance - gold) */}
        <rect
          x="50"
          y="6"
          width="6"
          height="20"
          rx="0.5"
          fill={bands[3]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
