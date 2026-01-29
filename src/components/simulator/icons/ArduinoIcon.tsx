interface ArduinoIconProps {
  className?: string;
  size?: number;
}

export function ArduinoIcon({ className = '', size = 140 }: ArduinoIconProps) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 140 91"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PCB Board with realistic texture */}
      <defs>
        <linearGradient id="pcbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0288D1" />
          <stop offset="50%" stopColor="#0277BD" />
          <stop offset="100%" stopColor="#01579B" />
        </linearGradient>
        <pattern id="pcbTexture" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.4" fill="#039BE5" opacity="0.2" />
        </pattern>
        <filter id="boardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.5" />
        </filter>
        <linearGradient id="copperTrace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B87333" />
          <stop offset="50%" stopColor="#CD9B4F" />
          <stop offset="100%" stopColor="#B87333" />
        </linearGradient>
      </defs>
      
      {/* Board base */}
      <rect
        x="2"
        y="2"
        width="136"
        height="87"
        rx="4"
        fill="url(#pcbGradient)"
        filter="url(#boardShadow)"
      />
      <rect x="2" y="2" width="136" height="87" rx="4" fill="url(#pcbTexture)" />
      
      {/* Copper traces */}
      <g stroke="url(#copperTrace)" strokeWidth="0.5" opacity="0.3">
        <path d="M20 30 L60 30 L60 50" />
        <path d="M80 40 L100 40" />
        <path d="M40 60 L40 80 L80 80" />
      </g>
      
      {/* Mounting holes with metallic rings */}
      {[[8, 8], [132, 8], [8, 83], [132, 83]].map(([cx, cy], i) => (
        <g key={`hole-${i}`}>
          <circle cx={cx} cy={cy} r="4" fill="#1A1A1A" />
          <circle cx={cx} cy={cy} r="3" fill="none" stroke="#C0C0C0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2" fill="#0D0D0D" />
        </g>
      ))}
      
      {/* USB-B Connector - 3D effect */}
      <g>
        <rect x="-3" y="28" width="18" height="22" rx="2" fill="#707070" />
        <rect x="-1" y="30" width="14" height="18" rx="1" fill="#505050" />
        <rect x="1" y="32" width="10" height="14" fill="#1A1A1A" />
        <rect x="3" y="34" width="6" height="10" fill="#2D2D2D" />
        {/* USB logo */}
        <circle cx="6" cy="39" r="1.5" fill="none" stroke="#404040" strokeWidth="0.5" />
      </g>
      
      {/* Power barrel jack */}
      <g>
        <rect x="8" y="72" width="16" height="12" rx="2" fill="#1A1A1A" />
        <circle cx="16" cy="78" r="4" fill="#2D2D2D" />
        <circle cx="16" cy="78" r="2" fill="#1A1A1A" />
        <circle cx="16" cy="78" r="1" fill="#0D0D0D" />
      </g>
      
      {/* ATmega328P Chip with realistic details */}
      <g>
        <rect x="50" y="32" width="36" height="32" rx="2" fill="#1A1A1A" />
        <rect x="52" y="34" width="32" height="28" fill="#252525" />
        {/* Chip notch */}
        <circle cx="70" cy="34" r="3" fill="#1A1A1A" />
        {/* Chip pins - left side */}
        {[...Array(8)].map((_, i) => (
          <rect key={`chip-l-${i}`} x="46" y={35 + i * 3.2} width="5" height="2" rx="0.5" fill="#C0C0C0" />
        ))}
        {/* Chip pins - right side */}
        {[...Array(8)].map((_, i) => (
          <rect key={`chip-r-${i}`} x="85" y={35 + i * 3.2} width="5" height="2" rx="0.5" fill="#C0C0C0" />
        ))}
        {/* Chip text */}
        <text x="68" y="48" fontSize="3.5" fill="#808080" textAnchor="middle" fontFamily="monospace">ATMEGA</text>
        <text x="68" y="53" fontSize="3.5" fill="#808080" textAnchor="middle" fontFamily="monospace">328P-PU</text>
      </g>
      
      {/* Crystal oscillator */}
      <rect x="94" y="38" width="8" height="18" rx="1.5" fill="#D4D4D4" stroke="#B0B0B0" strokeWidth="0.5" />
      <text x="98" y="49" fontSize="3" fill="#505050" textAnchor="middle" fontFamily="monospace">16</text>
      <text x="98" y="53" fontSize="2.5" fill="#505050" textAnchor="middle" fontFamily="monospace">MHz</text>
      
      {/* Reset button */}
      <g>
        <rect x="106" y="16" width="10" height="8" rx="1.5" fill="#1A1A1A" />
        <rect x="107.5" y="17.5" width="7" height="5" rx="1" fill="#CC3333">
          <animate attributeName="fill" values="#CC3333;#E63939;#CC3333" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
      <text x="111" y="28" fontSize="3" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">RST</text>
      
      {/* Status LEDs */}
      <g>
        <circle cx="118" cy="58" r="2" fill="#1B5E20">
          <animate attributeName="fill" values="#1B5E20;#4CAF50;#1B5E20" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="118" y="64" fontSize="2.5" fill="#FFFFFF" textAnchor="middle">ON</text>
        
        <circle cx="126" cy="58" r="2" fill="#F57C00">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <text x="126" y="64" fontSize="2.5" fill="#FFFFFF" textAnchor="middle">L</text>
        
        <circle cx="118" cy="48" r="2" fill="#4CAF50" />
        <text x="118" y="45" fontSize="2.5" fill="#FFFFFF" textAnchor="middle">TX</text>
        
        <circle cx="126" cy="48" r="2" fill="#F44336" />
        <text x="126" y="45" fontSize="2.5" fill="#FFFFFF" textAnchor="middle">RX</text>
      </g>
      
      {/* Digital pins header - top */}
      <rect x="26" y="3" width="100" height="10" rx="1" fill="#1A1A1A" />
      {[...Array(14)].map((_, i) => (
        <g key={`dpin-${i}`}>
          <rect x={28 + i * 7} y="5" width="4" height="6" rx="0.5" fill="#FFD700" />
          <rect x={28.5 + i * 7} y="5.5" width="3" height="2" fill="#FFF59D" opacity="0.5" />
          <text x={30 + i * 7} y="17" fontSize="3" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">
            {i}
          </text>
        </g>
      ))}
      <text x="76" y="24" fontSize="3.5" fill="#00E5FF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">DIGITAL (PWM~)</text>
      
      {/* Analog pins header - bottom */}
      <rect x="32" y="78" width="54" height="10" rx="1" fill="#1A1A1A" />
      {['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((label, i) => (
        <g key={`apin-${i}`}>
          <rect x={34 + i * 8.5} y="80" width="4" height="6" rx="0.5" fill="#FFD700" />
          <rect x={34.5 + i * 8.5} y="80.5" width="3" height="2" fill="#FFF59D" opacity="0.5" />
          <text x={36 + i * 8.5} y="76" fontSize="2.5" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <text x="59" y="72" fontSize="3" fill="#00E5FF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">ANALOG IN</text>
      
      {/* Power pins */}
      <rect x="92" y="78" width="36" height="10" rx="1" fill="#1A1A1A" />
      {[
        { label: '5V', color: '#DC2626' },
        { label: 'GND', color: '#1A1A1A' },
        { label: 'GND', color: '#1A1A1A' },
        { label: 'VIN', color: '#DC2626' }
      ].map((pin, i) => (
        <g key={`ppin-${i}`}>
          <rect x={94 + i * 8.5} y="80" width="4" height="6" rx="0.5" fill={pin.color === '#1A1A1A' ? '#404040' : '#FFD700'} />
          <text x={96 + i * 8.5} y="76" fontSize="2.5" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">
            {pin.label}
          </text>
        </g>
      ))}
      
      {/* Arduino branding */}
      <text x="34" y="48" fontSize="8" fill="#FFFFFF" fontWeight="bold" fontFamily="sans-serif">ARDUINO</text>
      <text x="34" y="58" fontSize="6" fill="#00E5FF" fontFamily="sans-serif" fontWeight="600">UNO R3</text>
      
      {/* Decorative elements */}
      <rect x="120" y="70" width="12" height="8" rx="1" fill="#2D2D2D" opacity="0.5" />
    </svg>
  );
}
