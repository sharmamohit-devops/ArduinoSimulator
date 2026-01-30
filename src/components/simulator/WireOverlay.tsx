import { PlacedComponent, Wire, DigitalPin } from '@/types/simulator';
import { useMemo } from 'react';

interface WireOverlayProps {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning?: boolean;
}

// Wokwi-style wire colors - bright and distinct
const WOKWI_COLORS = {
  red: '#E53935',
  blue: '#1E88E5', 
  green: '#43A047',
  yellow: '#FDD835',
  orange: '#FB8C00',
  purple: '#8E24AA',
  cyan: '#00ACC1',
  pink: '#D81B60',
};

// Component connection point offsets (relative to component position)
const COMPONENT_CONNECTIONS: Record<string, { x: number; y: number }> = {
  'led': { x: 30, y: 75 },
  'push-button': { x: 32, y: 56 },
  'buzzer': { x: 28, y: 50 },
  'potentiometer': { x: 32, y: 52 },
};

// Get Arduino pin positions (digital pins D0-D13 on top row)
function getArduinoPinPosition(arduino: PlacedComponent, pin: DigitalPin): { x: number; y: number } {
  const xOffset = 28 + pin * 7 + 2;
  return {
    x: arduino.x + xOffset,
    y: arduino.y + 8,
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

// Get wire color based on component type (Wokwi style)
function getWokwiColor(componentType: string): string {
  switch (componentType) {
    case 'led':
      return WOKWI_COLORS.red;
    case 'push-button':
      return WOKWI_COLORS.blue;
    case 'buzzer':
      return WOKWI_COLORS.purple;
    case 'potentiometer':
      return WOKWI_COLORS.green;
    default:
      return WOKWI_COLORS.orange;
  }
}

// Generate Wokwi-style wire path with right-angle bends
function generateWokwiPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  index: number
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Calculate intermediate points for clean routing
  const offset = 20 + (index * 8); // Stagger wires to avoid overlap
  
  if (dy < 0) {
    // Component is below Arduino - wire goes up
    const bendY = to.y - offset;
    
    // Create smooth bezier curve path (Wokwi style)
    const cp1Y = from.y - Math.abs(dy) * 0.3;
    const cp2Y = bendY + 10;
    
    return `M ${from.x} ${from.y}
            C ${from.x} ${cp1Y}, 
              ${from.x} ${bendY}, 
              ${from.x + dx * 0.3} ${bendY}
            L ${to.x - dx * 0.1} ${bendY}
            C ${to.x} ${bendY}, 
              ${to.x} ${cp2Y}, 
              ${to.x} ${to.y}`;
  } else {
    // Simple curved path
    const midY = from.y - 50 - (index * 15);
    return `M ${from.x} ${from.y}
            C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  }
}

export function WireOverlay({ components, wires, isRunning = false }: WireOverlayProps) {
  const wirePaths = useMemo(() => {
    return wires.map((wire, index) => {
      const fromComponent = components.find((c) => c.instanceId === wire.fromComponent);
      const toComponent = components.find((c) => c.instanceId === wire.toComponent);

      if (!fromComponent || !toComponent) return null;

      const from = getComponentConnectionPoint(fromComponent);
      const to = getArduinoPinPosition(toComponent as PlacedComponent, wire.fromPin);
      const path = generateWokwiPath(from, to, index);
      const color = getWokwiColor(fromComponent.type);

      // Check if the connected component is active
      const isActive = isRunning && (
        (fromComponent.type === 'led' && fromComponent.state?.isOn) ||
        (fromComponent.type === 'buzzer' && fromComponent.state?.isOn) ||
        (fromComponent.type === 'push-button' && fromComponent.state?.isPressed)
      );

      return {
        id: wire.id,
        path,
        color,
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
        {/* Wokwi-style wire gradient for 3D effect */}
        {wirePaths.map((wire) => wire && (
          <linearGradient
            key={`grad-${wire.id}`}
            id={`wireGrad-${wire.id}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={wire.color} stopOpacity="1" />
            <stop offset="30%" stopColor={adjustBrightness(wire.color, 1.3)} stopOpacity="1" />
            <stop offset="70%" stopColor={wire.color} stopOpacity="1" />
            <stop offset="100%" stopColor={adjustBrightness(wire.color, 0.7)} stopOpacity="1" />
          </linearGradient>
        ))}

        {/* Glow filter for active wires */}
        <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop shadow for wires */}
        <filter id="wireShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {wirePaths.map((wire) => wire && (
        <g key={wire.id}>
          {/* Wire shadow/outline for depth */}
          <path
            d={wire.path}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main wire body - Wokwi style solid color */}
          <path
            d={wire.path}
            stroke={wire.color}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={wire.isActive ? "url(#activeGlow)" : undefined}
            style={{
              transition: 'filter 0.2s ease',
            }}
          />

          {/* Wire highlight for 3D effect */}
          <path
            d={wire.path}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: 'translate(-0.5px, -0.5px)' }}
          />

          {/* Connection dot at component end */}
          <g transform={`translate(${wire.fromX}, ${wire.fromY})`}>
            {/* Outer glow ring */}
            <circle 
              r="7" 
              fill="none" 
              stroke={wire.color} 
              strokeWidth="2"
              opacity={wire.isActive ? "0.5" : "0.2"}
              style={{
                transition: 'opacity 0.2s ease',
              }}
            />
            {/* Main dot */}
            <circle 
              r="4" 
              fill={wire.color}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Inner highlight */}
            <circle 
              r="1.5" 
              fill="#ffffff"
              opacity="0.6"
              transform="translate(-0.5, -0.5)"
            />
          </g>

          {/* Connection dot at Arduino end */}
          <g transform={`translate(${wire.toX}, ${wire.toY})`}>
            {/* Outer ring */}
            <circle 
              r="5" 
              fill="none" 
              stroke={wire.color} 
              strokeWidth="1.5"
              opacity={wire.isActive ? "0.5" : "0.2"}
            />
            {/* Main dot */}
            <circle 
              r="3" 
              fill={wire.color}
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Highlight */}
            <circle 
              r="1" 
              fill="#ffffff"
              opacity="0.5"
              transform="translate(-0.3, -0.3)"
            />
          </g>

          {/* Pin label badge - Wokwi style */}
          <g transform={`translate(${wire.toX}, ${wire.toY - 16})`}>
            {/* Badge shadow */}
            <rect
              x="-12"
              y="-8"
              width="24"
              height="14"
              rx="3"
              fill="rgba(0,0,0,0.3)"
              transform="translate(1, 1)"
            />
            {/* Badge background */}
            <rect
              x="-12"
              y="-8"
              width="24"
              height="14"
              rx="3"
              fill={wire.color}
            />
            {/* Badge highlight */}
            <rect
              x="-11"
              y="-7"
              width="22"
              height="6"
              rx="2"
              fill="rgba(255,255,255,0.2)"
            />
            {/* Pin text */}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="9"
              fill="white"
              fontFamily="ui-monospace, 'SF Mono', monospace"
              fontWeight="700"
            >
              D{wire.pin}
            </text>
          </g>

          {/* Active flow animation - Current flows FROM Arduino TO Component */}
          {wire.isActive && (
            <>
              {/* Outer glow particle */}
              <circle r="4" fill={wire.color} opacity="0.4">
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={reversePath(wire.path)}
                  keyPoints="1;0"
                  keyTimes="0;1"
                />
              </circle>
              {/* Main particle */}
              <circle r="3" fill="#ffffff" opacity="0.9">
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={reversePath(wire.path)}
                  keyPoints="1;0"
                  keyTimes="0;1"
                />
              </circle>
              {/* Inner colored particle */}
              <circle r="2" fill={wire.color}>
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={reversePath(wire.path)}
                  keyPoints="1;0"
                  keyTimes="0;1"
                />
              </circle>
              {/* Second trailing particle */}
              <circle r="2.5" fill="#ffffff" opacity="0.6">
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={reversePath(wire.path)}
                  keyPoints="1;0"
                  keyTimes="0;1"
                  begin="0.15s"
                />
              </circle>
              <circle r="1.5" fill={wire.color} opacity="0.8">
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={reversePath(wire.path)}
                  keyPoints="1;0"
                  keyTimes="0;1"
                  begin="0.15s"
                />
              </circle>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.min(255, Math.round(r * factor));
  const newG = Math.min(255, Math.round(g * factor));
  const newB = Math.min(255, Math.round(b * factor));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
}

// Helper function to reverse path direction for animation (Arduino → Component)
function reversePath(path: string): string {
  // The animateMotion will use keyPoints="1;0" to reverse direction
  // This keeps the path but animation goes from end to start
  return path;
}
