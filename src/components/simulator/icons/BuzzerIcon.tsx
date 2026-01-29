interface BuzzerIconProps {
  className?: string;
  size?: number;
  isOn?: boolean;
}

export function BuzzerIcon({ 
  className = '', 
  size = 56, 
  isOn = false 
}: BuzzerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main body gradient */}
        <radialGradient id="buzzerBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="70%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </radialGradient>
        
        {/* Diaphragm gradient */}
        <radialGradient id="buzzerDiaphragm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A4A4A" />
          <stop offset="60%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#2A2A2A" />
        </radialGradient>
        
        {/* Active glow */}
        <filter id="buzzerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Metal lead gradient */}
        <linearGradient id="buzzerLead" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8A8A8" />
          <stop offset="50%" stopColor="#D0D0D0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
      </defs>
      
      {/* Sound waves when active */}
      {isOn && (
        <g opacity="0.6">
          <circle
            cx="28"
            cy="24"
            r="30"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              from="20"
              to="35"
              dur="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="28"
            cy="24"
            r="24"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            opacity="0.4"
          >
            <animate
              attributeName="r"
              from="16"
              to="30"
              dur="0.5s"
              begin="0.15s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="0.5s"
              begin="0.15s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
      
      {/* Main cylindrical body */}
      <g filter={isOn ? "url(#buzzerGlow)" : undefined}>
        {/* Body shadow */}
        <ellipse
          cx="28"
          cy="52"
          rx="20"
          ry="4"
          fill="rgba(0,0,0,0.3)"
        />
        
        {/* Body base */}
        <circle
          cx="28"
          cy="24"
          r="22"
          fill="url(#buzzerBody)"
          stroke="#3A3A3A"
          strokeWidth="1"
        />
        
        {/* Outer ring */}
        <circle
          cx="28"
          cy="24"
          r="20"
          fill="none"
          stroke="#4A4A4A"
          strokeWidth="2"
        />
        
        {/* Diaphragm (speaker cone) */}
        <circle
          cx="28"
          cy="24"
          r="14"
          fill="url(#buzzerDiaphragm)"
          stroke="#555555"
          strokeWidth="0.5"
        />
        
        {/* Center hole */}
        <circle
          cx="28"
          cy="24"
          r="4"
          fill="#1A1A1A"
          stroke="#333333"
          strokeWidth="0.5"
        />
        
        {/* Highlight arc */}
        <path
          d="M 14 18 A 16 16 0 0 1 28 10"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* + polarity marker */}
        <text
          x="42"
          y="16"
          fontSize="8"
          fill="#888888"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          +
        </text>
      </g>
      
      {/* Positive pin */}
      <rect
        x="18"
        y="46"
        width="3"
        height="10"
        rx="0.5"
        fill="url(#buzzerLead)"
      />
      
      {/* Negative pin */}
      <rect
        x="35"
        y="46"
        width="3"
        height="10"
        rx="0.5"
        fill="url(#buzzerLead)"
      />
      
      {/* Pin labels */}
      <text
        x="19.5"
        y="52"
        fontSize="4"
        fill="#666666"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        +
      </text>
      <text
        x="36.5"
        y="52"
        fontSize="4"
        fill="#666666"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        −
      </text>
    </svg>
  );
}
