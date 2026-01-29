interface ArduinoIconProps {
  className?: string;
  size?: number;
}

export function ArduinoIcon({ className = '', size = 60 }: ArduinoIconProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Board body */}
      <rect
        x="2"
        y="2"
        width="96"
        height="66"
        rx="4"
        fill="#0277BD"
        stroke="#01579B"
        strokeWidth="2"
      />
      
      {/* USB connector */}
      <rect x="0" y="20" width="12" height="16" rx="1" fill="#9E9E9E" stroke="#757575" />
      
      {/* Power barrel */}
      <circle cx="18" cy="58" r="6" fill="#212121" stroke="#424242" />
      
      {/* ATmega chip */}
      <rect x="40" y="22" width="24" height="30" rx="1" fill="#212121" />
      <rect x="42" y="24" width="20" height="26" fill="#37474F" />
      
      {/* Crystal oscillator */}
      <rect x="70" y="28" width="8" height="18" rx="1" fill="#9E9E9E" />
      
      {/* Pin headers - top */}
      <g fill="#FFC107">
        {[...Array(8)].map((_, i) => (
          <rect key={`top-${i}`} x={20 + i * 8} y="6" width="4" height="8" rx="0.5" />
        ))}
      </g>
      
      {/* Pin headers - bottom */}
      <g fill="#FFC107">
        {[...Array(8)].map((_, i) => (
          <rect key={`bottom-${i}`} x={20 + i * 8} y="56" width="4" height="8" rx="0.5" />
        ))}
      </g>
      
      {/* Reset button */}
      <circle cx="85" cy="14" r="4" fill="#F44336" stroke="#D32F2F" />
      
      {/* LED indicators */}
      <circle cx="75" cy="50" r="2" fill="#4CAF50" />
      <circle cx="82" cy="50" r="2" fill="#FFC107" />
    </svg>
  );
}
