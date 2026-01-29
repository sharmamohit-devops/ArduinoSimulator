interface ArduinoIconProps {
  className?: string;
  size?: number;
}

export function ArduinoIcon({ className = '', size = 120 }: ArduinoIconProps) {
  const scale = size / 120;
  
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 120 78"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PCB Board */}
      <rect
        x="2"
        y="2"
        width="116"
        height="74"
        rx="3"
        fill="#0277BD"
        stroke="#01579B"
        strokeWidth="1.5"
      />
      
      {/* PCB Texture - subtle grid */}
      <defs>
        <pattern id="pcbGrid" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.3" fill="#0288D1" opacity="0.3" />
        </pattern>
      </defs>
      <rect x="2" y="2" width="116" height="74" rx="3" fill="url(#pcbGrid)" />
      
      {/* Mounting holes */}
      <circle cx="8" cy="8" r="2.5" fill="#1A1A1A" stroke="#333" strokeWidth="0.5" />
      <circle cx="112" cy="8" r="2.5" fill="#1A1A1A" stroke="#333" strokeWidth="0.5" />
      <circle cx="8" cy="70" r="2.5" fill="#1A1A1A" stroke="#333" strokeWidth="0.5" />
      <circle cx="112" cy="70" r="2.5" fill="#1A1A1A" stroke="#333" strokeWidth="0.5" />
      
      {/* USB-B Connector */}
      <rect x="-2" y="22" width="16" height="18" rx="1" fill="#A0A0A0" stroke="#707070" strokeWidth="1" />
      <rect x="0" y="25" width="12" height="12" rx="0.5" fill="#1A1A1A" />
      <rect x="2" y="27" width="8" height="8" fill="#2A2A2A" />
      
      {/* Power barrel jack */}
      <circle cx="18" cy="66" r="5" fill="#1A1A1A" stroke="#333" strokeWidth="0.5" />
      <circle cx="18" cy="66" r="2.5" fill="#333" />
      
      {/* ATmega328P Chip */}
      <rect x="45" y="28" width="30" height="26" rx="1" fill="#1A1A1A" />
      <rect x="47" y="30" width="26" height="22" fill="#2D2D2D" />
      {/* Chip pins - left side */}
      {[...Array(7)].map((_, i) => (
        <rect key={`chip-l-${i}`} x="42" y={30 + i * 3} width="4" height="1.5" fill="#C0C0C0" />
      ))}
      {/* Chip pins - right side */}
      {[...Array(7)].map((_, i) => (
        <rect key={`chip-r-${i}`} x="74" y={30 + i * 3} width="4" height="1.5" fill="#C0C0C0" />
      ))}
      {/* Chip notch */}
      <circle cx="60" cy="30" r="2" fill="#1A1A1A" />
      {/* Chip text */}
      <text x="60" y="43" fontSize="3" fill="#808080" textAnchor="middle" fontFamily="monospace">ATMEGA328P</text>
      
      {/* Crystal oscillator */}
      <rect x="80" y="32" width="6" height="14" rx="1" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5" />
      <text x="83" y="41" fontSize="2.5" fill="#666" textAnchor="middle" fontFamily="monospace">16</text>
      
      {/* Reset button */}
      <rect x="88" y="14" width="8" height="6" rx="1" fill="#1A1A1A" />
      <rect x="89.5" y="15.5" width="5" height="3" rx="0.5" fill="#D32F2F" />
      <text x="92" y="24" fontSize="2" fill="#FFF" textAnchor="middle" fontFamily="monospace">RST</text>
      
      {/* Status LEDs */}
      <circle cx="100" cy="54" r="1.5" fill="#4CAF50" />
      <text x="100" y="59" fontSize="2" fill="#FFF" textAnchor="middle">ON</text>
      <circle cx="106" cy="54" r="1.5" fill="#FFC107" />
      <text x="106" y="59" fontSize="2" fill="#FFF" textAnchor="middle">L</text>
      <circle cx="100" cy="46" r="1.5" fill="#4CAF50" />
      <text x="100" y="44" fontSize="2" fill="#FFF" textAnchor="middle">TX</text>
      <circle cx="106" cy="46" r="1.5" fill="#F44336" />
      <text x="106" y="44" fontSize="2" fill="#FFF" textAnchor="middle">RX</text>
      
      {/* Digital pins header - top (D0-D13) */}
      <rect x="22" y="3" width="88" height="8" rx="0.5" fill="#1A1A1A" />
      {[...Array(14)].map((_, i) => (
        <g key={`dpin-${i}`}>
          <rect x={24 + i * 6} y="5" width="3.5" height="4" rx="0.3" fill="#FFD700" />
          <text x={25.75 + i * 6} y="15" fontSize="2.5" fill="#FFF" textAnchor="middle" fontFamily="monospace">
            {i}
          </text>
        </g>
      ))}
      <text x="66" y="20" fontSize="3" fill="#FFF" textAnchor="middle" fontFamily="monospace">DIGITAL</text>
      
      {/* Analog pins header - bottom */}
      <rect x="28" y="67" width="48" height="8" rx="0.5" fill="#1A1A1A" />
      {['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((label, i) => (
        <g key={`apin-${i}`}>
          <rect x={30 + i * 7.5} y="69" width="3.5" height="4" rx="0.3" fill="#FFD700" />
          <text x={31.75 + i * 7.5} y="65" fontSize="2.5" fill="#FFF" textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <text x="52" y="63" fontSize="3" fill="#FFF" textAnchor="middle" fontFamily="monospace">ANALOG</text>
      
      {/* Power pins header */}
      <rect x="80" y="67" width="30" height="8" rx="0.5" fill="#1A1A1A" />
      {['5V', 'GND', 'VIN'].map((label, i) => (
        <g key={`ppin-${i}`}>
          <rect x={82 + i * 9} y="69" width="3.5" height="4" rx="0.3" fill={label === 'GND' ? '#333' : '#DC2626'} />
          <text x={83.75 + i * 9} y="65" fontSize="2.5" fill="#FFF" textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      
      {/* Arduino logo text */}
      <text x="30" y="45" fontSize="6" fill="#FFF" fontWeight="bold" fontFamily="sans-serif">ARDUINO</text>
      <text x="30" y="52" fontSize="4" fill="#B3E5FC" fontFamily="sans-serif">UNO</text>
    </svg>
  );
}
