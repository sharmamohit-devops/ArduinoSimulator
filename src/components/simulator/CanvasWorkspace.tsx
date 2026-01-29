import { useRef, useState, useCallback } from 'react';
import { PlacedComponent, ComponentType } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { X } from 'lucide-react';

interface CanvasWorkspaceProps {
  components: PlacedComponent[];
  isRunning: boolean;
  onDropComponent: (type: ComponentType, x: number, y: number) => void;
  onMoveComponent: (instanceId: string, x: number, y: number) => void;
  onRemoveComponent: (instanceId: string) => void;
}

const getPlacedComponentIcon = (type: ComponentType, isRunning: boolean) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={100} />;
    case 'led':
      return <LEDIcon size={56} isOn={isRunning} />;
    case 'push-button':
      return <PushButtonIcon size={56} />;
    default:
      return null;
  }
};

const getComponentSize = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return { width: 100, height: 70 };
    case 'led':
      return { width: 56, height: 56 };
    case 'push-button':
      return { width: 56, height: 56 };
    default:
      return { width: 60, height: 60 };
  }
};

export function CanvasWorkspace({
  components,
  isRunning,
  onDropComponent,
  onMoveComponent,
  onRemoveComponent,
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
      const x = e.clientX - rect.left - 40;
      const y = e.clientY - rect.top - 30;
      onDropComponent(componentType, Math.max(0, x), Math.max(0, y));
    }
  }, [onDropComponent]);

  const handleComponentMouseDown = useCallback((
    e: React.MouseEvent,
    component: PlacedComponent
  ) => {
    e.preventDefault();
    setDraggedComponent(component.instanceId);
    setDragOffset({
      x: e.clientX - component.x,
      y: e.clientY - component.y,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x + rect.left;
      const newY = e.clientY - rect.top - dragOffset.y + rect.top;
      onMoveComponent(
        draggedComponent,
        Math.max(0, e.clientX - dragOffset.x),
        Math.max(0, e.clientY - dragOffset.y)
      );
    }
  }, [draggedComponent, dragOffset, onMoveComponent]);

  const handleMouseUp = useCallback(() => {
    setDraggedComponent(null);
  }, []);

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
              Drag components from the palette on the left to start building your circuit
            </p>
          </div>
        </div>
      )}

      {/* Placed components */}
      {components.map((component) => {
        const size = getComponentSize(component.type);
        return (
          <div
            key={component.instanceId}
            className={`absolute cursor-move group transition-shadow ${
              draggedComponent === component.instanceId ? 'z-50 shadow-drag' : 'z-10 hover:shadow-component'
            }`}
            style={{
              left: component.x,
              top: component.y,
              width: size.width,
              height: size.height,
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            {/* Delete button */}
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
            
            {/* Component icon */}
            <div className="pointer-events-none">
              {getPlacedComponentIcon(component.type, isRunning)}
            </div>
          </div>
        );
      })}

      {/* Running indicator */}
      {isRunning && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-success/90 text-success-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          <span className="w-2 h-2 bg-success-foreground rounded-full animate-pulse-glow" />
          Simulation Running
        </div>
      )}
    </div>
  );
}
