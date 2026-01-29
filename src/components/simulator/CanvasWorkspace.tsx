import { useRef, useState, useCallback } from 'react';
import { PlacedComponent, ComponentType, Wire, DigitalPin } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { WireOverlay } from './WireOverlay';
import { PinSelector } from './PinSelector';
import { X } from 'lucide-react';

interface CanvasWorkspaceProps {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning: boolean;
  usedPins: Map<DigitalPin, string>;
  onDropComponent: (type: ComponentType, x: number, y: number) => void;
  onMoveComponent: (instanceId: string, x: number, y: number) => void;
  onRemoveComponent: (instanceId: string) => void;
  onChangePin: (instanceId: string, newPin: DigitalPin) => void;
  onButtonPress: (instanceId: string, isPressed: boolean) => void;
}

const getComponentSize = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return { width: 120, height: 78 };
    case 'led':
      return { width: 48, height: 68 };
    case 'push-button':
      return { width: 56, height: 56 };
    default:
      return { width: 60, height: 60 };
  }
};

export function CanvasWorkspace({
  components,
  wires,
  isRunning,
  usedPins,
  onDropComponent,
  onMoveComponent,
  onRemoveComponent,
  onChangePin,
  onButtonPress,
}: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType') as ComponentType;
    
    if (componentType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const size = getComponentSize(componentType);
      const x = e.clientX - rect.left - size.width / 2;
      const y = e.clientY - rect.top - size.height / 2;
      onDropComponent(componentType, Math.max(0, x), Math.max(0, y));
    }
  }, [onDropComponent]);

  const handleComponentMouseDown = useCallback((
    e: React.MouseEvent,
    component: PlacedComponent
  ) => {
    if (isRunning && component.type === 'push-button') return;
    
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDraggedComponent(component.instanceId);
    setDragOffset({
      x: e.clientX - rect.left - component.x,
      y: e.clientY - rect.top - component.y,
    });
  }, [isRunning]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      onMoveComponent(draggedComponent, Math.max(0, newX), Math.max(0, newY));
    }
  }, [draggedComponent, dragOffset, onMoveComponent]);

  const handleMouseUp = useCallback(() => {
    setDraggedComponent(null);
  }, []);

  const renderComponent = (component: PlacedComponent) => {
    switch (component.type) {
      case 'arduino-uno':
        return <ArduinoIcon size={120} />;
      case 'led':
        return (
          <LEDIcon 
            size={48} 
            isOn={component.state?.isOn ?? false}
          />
        );
      case 'push-button':
        return (
          <PushButtonIcon 
            size={56} 
            isPressed={component.state?.isPressed ?? false}
            interactive={isRunning}
            onPress={() => onButtonPress(component.instanceId, true)}
            onRelease={() => onButtonPress(component.instanceId, false)}
          />
        );
      default:
        return null;
    }
  };

  const hasArduino = components.some(c => c.type === 'arduino-uno');

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-canvas canvas-grid relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Wire overlay - render behind components */}
      {hasArduino && <WireOverlay components={components} wires={wires} />}

      {/* Empty state */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Drop Components Here</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start by adding an Arduino Uno, then add LED and Button
            </p>
          </div>
        </div>
      )}

      {/* Placed components */}
      {components.map((component) => {
        const size = getComponentSize(component.type);
        const showPinSelector = component.type !== 'arduino-uno' && component.pin !== undefined && hasArduino;
        
        return (
          <div
            key={component.instanceId}
            className={`absolute group transition-shadow ${
              draggedComponent === component.instanceId ? 'z-50 shadow-drag' : 'z-10 hover:shadow-component'
            } ${isRunning && component.type === 'push-button' ? 'cursor-pointer' : 'cursor-move'}`}
            style={{
              left: component.x,
              top: component.y,
              width: size.width,
              height: size.height,
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            {/* Delete button - hide during simulation */}
            {!isRunning && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveComponent(component.instanceId);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                           hover:scale-110 z-20"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            
            {/* Component label */}
            {component.type !== 'arduino-uno' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-foreground border border-border shadow-sm whitespace-nowrap">
                {component.type === 'led' ? 'LED' : 'Button'}
              </div>
            )}
            
            {/* Component icon */}
            <div className={isRunning && component.type === 'push-button' ? '' : 'pointer-events-none'}>
              {renderComponent(component)}
            </div>

            {/* Pin selector dropdown - hide during simulation */}
            {showPinSelector && !isRunning && (
              <PinSelector
                currentPin={component.pin!}
                usedPins={usedPins}
                instanceId={component.instanceId}
                componentType={component.type as 'led' | 'push-button'}
                onPinChange={(newPin) => onChangePin(component.instanceId, newPin)}
              />
            )}

            {/* Pin badge during simulation */}
            {showPinSelector && isRunning && (
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-mono font-bold">
                D{component.pin}
              </div>
            )}
          </div>
        );
      })}

      {/* Running indicator */}
      {isRunning && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-success/90 text-success-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          <span className="w-2 h-2 bg-success-foreground rounded-full animate-pulse-glow" />
          Simulation Running — Press the button!
        </div>
      )}

      {/* Instructions when not running */}
      {!isRunning && components.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border px-3 py-2 rounded-lg text-xs text-muted-foreground max-w-xs">
          {!hasArduino ? (
            <span className="text-warning font-medium">Add an Arduino Uno to enable wiring</span>
          ) : (
            <span>Click <strong>Start</strong> to run the simulation</span>
          )}
        </div>
      )}
    </div>
  );
}
