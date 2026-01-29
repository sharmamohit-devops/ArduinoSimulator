import { PlacedComponent, Wire } from '@/types/simulator';
import { useMemo } from 'react';

interface WireOverlayProps {
  components: PlacedComponent[];
  wires: Wire[];
}

// Get component center position
function getComponentCenter(component: PlacedComponent): { x: number; y: number } {
  switch (component.type) {
    case 'arduino-uno':
      return { x: component.x + 60, y: component.y + 40 };
    case 'led':
      return { x: component.x + 24, y: component.y + 50 };
    case 'push-button':
      return { x: component.x + 28, y: component.y + 28 };
    default:
      return { x: component.x + 30, y: component.y + 30 };
  }
}

// Get pin position on Arduino (approximate)
function getArduinoPinPosition(arduino: PlacedComponent, pin: number): { x: number; y: number } {
  // Digital pins are on top row, pins 0-13
  // Each pin is spaced 6 units apart, starting at x offset 24
  const xOffset = 24 + pin * 6 + 1.75;
  return {
    x: arduino.x + xOffset,
    y: arduino.y + 10,
  };
}

export function WireOverlay({ components, wires }: WireOverlayProps) {
  const wirePaths = useMemo(() => {
    return wires.map((wire) => {
      const fromComponent = components.find((c) => c.instanceId === wire.fromComponent);
      const toComponent = components.find((c) => c.instanceId === wire.toComponent);

      if (!fromComponent || !toComponent) return null;

      const from = getComponentCenter(fromComponent);
      const to = getArduinoPinPosition(toComponent as PlacedComponent, wire.fromPin);

      // Create a curved path
      const midY = (from.y + to.y) / 2;
      const controlOffset = Math.abs(from.x - to.x) * 0.3;

      const path = `M ${from.x} ${from.y} 
                    C ${from.x} ${midY - controlOffset}, 
                      ${to.x} ${midY + controlOffset}, 
                      ${to.x} ${to.y}`;

      return {
        id: wire.id,
        path,
        color: wire.color,
        pin: wire.fromPin,
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
      };
    }).filter(Boolean);
  }, [components, wires]);

  if (wirePaths.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-5"
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Wire glow filter */}
        <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {wirePaths.map((wire) => wire && (
        <g key={wire.id}>
          {/* Wire shadow */}
          <path
            d={wire.path}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Main wire */}
          <path
            d={wire.path}
            stroke={wire.color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            filter="url(#wireGlow)"
          />

          {/* Wire highlight */}
          <path
            d={wire.path}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 8"
          />

          {/* Pin label at Arduino end */}
          <g transform={`translate(${wire.toX}, ${wire.toY - 14})`}>
            <rect
              x="-10"
              y="-8"
              width="20"
              height="14"
              rx="3"
              fill={wire.color}
              opacity="0.9"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="8"
              fill="white"
              fontFamily="monospace"
              fontWeight="bold"
            >
              D{wire.pin}
            </text>
          </g>

          {/* Connection dot at component end */}
          <circle
            cx={wire.fromX}
            cy={wire.fromY}
            r="4"
            fill={wire.color}
            stroke="white"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  );
}
