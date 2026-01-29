import { PlacedComponent, Wire, DigitalPin } from '@/types/simulator';
import { useMemo } from 'react';

interface WireOverlayProps {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning?: boolean;
}

// Component connection point offsets (relative to component position)
const COMPONENT_CONNECTIONS: Record<string, { x: number; y: number }> = {
  'led': { x: 24, y: 58 },        // Bottom center of LED (anode leg)
  'push-button': { x: 28, y: 48 }, // Bottom of button
};

// Get Arduino pin positions (digital pins D0-D13 on top row)
function getArduinoPinPosition(arduino: PlacedComponent, pin: DigitalPin): { x: number; y: number } {
  // Digital pins are on top row, pins 0-13
  // Starting at x=24, each pin is 6 units apart
  const xOffset = 24 + pin * 6 + 1.75;
  return {
    x: arduino.x + xOffset,
    y: arduino.y + 11, // Top edge pin position
  };
}

// Get component connection point
function getComponentConnectionPoint(component: PlacedComponent): { x: number; y: number } {
  const offset = COMPONENT_CONNECTIONS[component.type] || { x: 30, y: 30 };
  return {
    x: component.x + offset.x,
    y: component.y + offset.y,
  };
}

// Generate a smooth wire path with right-angle routing
function generateWirePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Determine routing based on relative positions
  if (Math.abs(dy) < 20) {
    // Nearly horizontal - use simple curve
    const midX = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} 
            C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  }
  
  // Create a path that goes up/down then across
  const bendY = from.y + (dy > 0 ? -30 : 30); // Go opposite direction first
  const routeY = to.y - 20; // Come in from above the Arduino pins
  
  return `M ${from.x} ${from.y}
          L ${from.x} ${bendY}
          Q ${from.x} ${routeY}, ${(from.x + to.x) / 2} ${routeY}
          Q ${to.x} ${routeY}, ${to.x} ${to.y}`;
}

export function WireOverlay({ components, wires, isRunning = false }: WireOverlayProps) {
  const wirePaths = useMemo(() => {
    return wires.map((wire) => {
      const fromComponent = components.find((c) => c.instanceId === wire.fromComponent);
      const toComponent = components.find((c) => c.instanceId === wire.toComponent);

      if (!fromComponent || !toComponent) return null;

      const from = getComponentConnectionPoint(fromComponent);
      const to = getArduinoPinPosition(toComponent as PlacedComponent, wire.fromPin);
      const path = generateWirePath(from, to, wire.color);

      return {
        id: wire.id,
        path,
        color: wire.color,
        pin: wire.fromPin,
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
        componentType: fromComponent.type,
      };
    }).filter(Boolean);
  }, [components, wires]);

  if (wirePaths.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5, overflow: 'visible' }}
      width="100%"
      height="100%"
    >
      <defs>
        {/* Wire glow filter for active simulation */}
        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Subtle shadow for depth */}
        <filter id="wireShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>

        {/* Animated dash pattern for running simulation */}
        <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="12" height="1">
          <rect width="6" height="1" fill="white" opacity="0.4">
            <animate 
              attributeName="x" 
              from="0" 
              to="12" 
              dur="0.5s" 
              repeatCount="indefinite" 
            />
          </rect>
        </pattern>
      </defs>

      {wirePaths.map((wire) => wire && (
        <g key={wire.id}>
          {/* Wire shadow for depth */}
          <path
            d={wire.path}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(1, 2)"
          />
          
          {/* Main wire body */}
          <path
            d={wire.path}
            stroke={wire.color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={isRunning ? "url(#wireGlow)" : "none"}
            style={{
              transition: 'filter 0.3s ease',
            }}
          />

          {/* Wire highlight (makes it look 3D) */}
          <path
            d={wire.path}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-0.5, -0.5)"
          />

          {/* Flow animation when running */}
          {isRunning && (
            <path
              d={wire.path}
              stroke="url(#flowPattern)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          )}

          {/* Connection point at component end */}
          <g transform={`translate(${wire.fromX}, ${wire.fromY})`}>
            {/* Solder joint appearance */}
            <circle
              r="5"
              fill={wire.color}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <circle
              r="2.5"
              fill="rgba(255,255,255,0.4)"
              transform="translate(-1, -1)"
            />
          </g>

          {/* Connection point at Arduino end */}
          <g transform={`translate(${wire.toX}, ${wire.toY})`}>
            <circle
              r="4"
              fill={wire.color}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <circle
              r="1.5"
              fill="rgba(255,255,255,0.4)"
              transform="translate(-0.5, -0.5)"
            />
          </g>

          {/* Pin label at Arduino end */}
          <g transform={`translate(${wire.toX}, ${wire.toY - 16})`}>
            <rect
              x="-12"
              y="-9"
              width="24"
              height="16"
              rx="4"
              fill={wire.color}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              filter="url(#wireShadow)"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fontSize="9"
              fill="white"
              fontFamily="ui-monospace, monospace"
              fontWeight="bold"
            >
              D{wire.pin}
            </text>
          </g>

          {/* Component type label at component end */}
          <g transform={`translate(${wire.fromX}, ${wire.fromY + 16})`}>
            <rect
              x="-16"
              y="-7"
              width="32"
              height="14"
              rx="3"
              fill="rgba(0,0,0,0.7)"
              stroke={wire.color}
              strokeWidth="1"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fontSize="7"
              fill="white"
              fontFamily="ui-sans-serif, sans-serif"
              fontWeight="500"
            >
              {wire.componentType === 'led' ? 'ANODE' : 'SIG'}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
