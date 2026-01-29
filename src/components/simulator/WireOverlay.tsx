import { PlacedComponent, Wire, DigitalPin } from '@/types/simulator';
import { useMemo } from 'react';

interface WireOverlayProps {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning?: boolean;
}

// Component connection point offsets (relative to component position)
const COMPONENT_CONNECTIONS: Record<string, { x: number; y: number }> = {
  'led': { x: 30, y: 70 },
  'push-button': { x: 32, y: 56 },
  'buzzer': { x: 28, y: 50 },
  'potentiometer': { x: 32, y: 52 },
};

// Get Arduino pin positions (digital pins D0-D13 on top row)
function getArduinoPinPosition(arduino: PlacedComponent, pin: DigitalPin): { x: number; y: number } {
  const xOffset = 28 + pin * 7 + 2;
  return {
    x: arduino.x + xOffset,
    y: arduino.y + 11,
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

// Generate a smooth wire path
function generateWirePath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const midY = Math.min(from.y, to.y) - 40;
  
  return `M ${from.x} ${from.y}
          C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

export function WireOverlay({ components, wires, isRunning = false }: WireOverlayProps) {
  const wirePaths = useMemo(() => {
    return wires.map((wire) => {
      const fromComponent = components.find((c) => c.instanceId === wire.fromComponent);
      const toComponent = components.find((c) => c.instanceId === wire.toComponent);

      if (!fromComponent || !toComponent) return null;

      const from = getComponentConnectionPoint(fromComponent);
      const to = getArduinoPinPosition(toComponent as PlacedComponent, wire.fromPin);
      const path = generateWirePath(from, to);

      // Check if the connected LED is on
      const isActive = isRunning && fromComponent.type === 'led' && fromComponent.state?.isOn;

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
        isActive,
      };
    }).filter(Boolean);
  }, [components, wires, isRunning]);

  if (wirePaths.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5, overflow: 'visible' }}
      width="100%"
      height="100%"
    >
      <defs>
        {/* Glow filter for active wires */}
        <filter id="wireGlowActive" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Subtle glow for inactive wires */}
        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated flow pattern */}
        <pattern id="flowDots" patternUnits="userSpaceOnUse" width="16" height="4">
          <circle cx="2" cy="2" r="1.5" fill="white" opacity="0.6">
            <animate 
              attributeName="cx" 
              from="2" 
              to="18" 
              dur="0.8s" 
              repeatCount="indefinite" 
            />
          </circle>
        </pattern>
      </defs>

      {wirePaths.map((wire) => wire && (
        <g key={wire.id}>
          {/* Wire shadow */}
          <path
            d={wire.path}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            transform="translate(2, 3)"
          />
          
          {/* Main wire */}
          <path
            d={wire.path}
            stroke={wire.color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            filter={wire.isActive ? "url(#wireGlowActive)" : "url(#wireGlow)"}
            style={{
              transition: 'filter 0.3s ease',
            }}
          />

          {/* Wire highlight */}
          <path
            d={wire.path}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            transform="translate(-0.5, -0.5)"
          />

          {/* Flow animation when active */}
          {wire.isActive && (
            <path
              d={wire.path}
              stroke="url(#flowDots)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Connection point at component */}
          <g transform={`translate(${wire.fromX}, ${wire.fromY})`}>
            <circle r="6" fill={wire.color} opacity="0.3" />
            <circle r="4" fill={wire.color} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </g>

          {/* Connection point at Arduino */}
          <g transform={`translate(${wire.toX}, ${wire.toY})`}>
            <circle r="5" fill={wire.color} opacity="0.3" />
            <circle r="3" fill={wire.color} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </g>

          {/* Pin label */}
          <g transform={`translate(${wire.toX}, ${wire.toY - 18})`}>
            <rect
              x="-14"
              y="-10"
              width="28"
              height="18"
              rx="6"
              fill={wire.color}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              filter="url(#wireGlow)"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontFamily="ui-monospace, monospace"
              fontWeight="bold"
            >
              D{wire.pin}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
