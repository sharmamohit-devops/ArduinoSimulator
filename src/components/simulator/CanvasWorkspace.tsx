import { useRef, useState, useCallback } from 'react';
import { PlacedComponent, ComponentType, Wire, DigitalPin, LEDColor, ResistorValue, RESISTOR_VALUES } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { ResistorIcon } from './icons/ResistorIcon';
import { BuzzerIcon } from './icons/BuzzerIcon';
import { PotentiometerIcon } from './icons/PotentiometerIcon';
import { WireOverlay } from './WireOverlay';
import { PinSelector } from './PinSelector';
import { LEDColorSelector } from './LEDColorSelector';
import { ResistorValueSelector } from './ResistorValueSelector';
import { X, Cpu, Zap } from 'lucide-react';

interface CanvasWorkspaceProps {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning: boolean;
  usedPins: Map<DigitalPin, string>;
  onDropComponent: (type: ComponentType, x: number, y: number) => void;
  onMoveComponent: (instanceId: string, x: number, y: number) => void;
  onRemoveComponent: (instanceId: string) => void;
  onChangePin: (instanceId: string, newPin: DigitalPin) => void;
  onChangeLEDColor: (instanceId: string, color: LEDColor) => void;
  onChangeResistorValue: (instanceId: string, value: ResistorValue) => void;
  onButtonPress: (instanceId: string, isPressed: boolean) => void;
}

const getComponentSize = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return { width: 140, height: 91 };
    case 'led':
      return { width: 60, height: 84 };
    case 'push-button':
      return { width: 64, height: 64 };
    case 'resistor':
      return { width: 80, height: 32 };
    case 'buzzer':
      return { width: 56, height: 56 };
    case 'potentiometer':
      return { width: 64, height: 58 };
    default:
      return { width: 60, height: 60 };
  }
};

const getComponentLabel = (type: ComponentType, component: PlacedComponent): string => {
  switch (type) {
    case 'led':
      return 'LED';
    case 'push-button':
      return 'Button';
    case 'resistor':
      return component.resistorValue ? RESISTOR_VALUES[component.resistorValue].label : '220Ω';
    case 'buzzer':
      return 'Buzzer';
    case 'potentiometer':
      return 'Pot';
    default:
      return '';
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
  onChangeLEDColor,
  onChangeResistorValue,
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
        return <ArduinoIcon size={140} />;
      case 'led':
        return (
          <LEDIcon 
            size={56} 
            color={component.ledColor || 'red'}
            isOn={component.state?.isOn ?? false}
          />
        );
      case 'push-button':
        return (
          <PushButtonIcon 
            size={64} 
            isPressed={component.state?.isPressed ?? false}
            interactive={isRunning}
            onToggle={() => onButtonPress(component.instanceId, !(component.state?.isPressed ?? false))}
          />
        );
      case 'resistor':
        return <ResistorIcon size={80} value={component.resistorValue || '220'} />;
      case 'buzzer':
        return <BuzzerIcon size={56} isOn={component.state?.isOn ?? false} />;
      case 'potentiometer':
        return <PotentiometerIcon size={64} value={component.state?.potValue ?? 512} />;
      default:
        return null;
    }
  };

  const hasArduino = components.some(c => c.type === 'arduino-uno');

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-hidden canvas-workspace"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Wire overlay - render behind components */}
      {hasArduino && <WireOverlay components={components} wires={wires} isRunning={isRunning} />}

      {/* Empty state */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-md px-8 fade-in-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl" />
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center">
                <Cpu className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Build Your Circuit</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Drag components from the library. Start with an <span className="text-primary font-medium">Arduino Uno</span>, 
              then add <span className="text-amber-400 font-medium">LEDs</span> and <span className="text-violet-400 font-medium">Buttons</span>.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                LED → D10
              </span>
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Button → D2
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Placed components */}
      {components.map((component) => {
        const size = getComponentSize(component.type);
        const showPinSelector = ['led', 'push-button', 'buzzer'].includes(component.type) && component.pin !== undefined && hasArduino;
        const isLED = component.type === 'led';
        const isResistor = component.type === 'resistor';
        
        return (
          <div
            key={component.instanceId}
            className={`absolute group component-float ${
              draggedComponent === component.instanceId ? 'z-50' : 'z-10'
            } ${isRunning && component.type === 'push-button' ? 'cursor-pointer' : 'cursor-move'}`}
            style={{
              left: component.x,
              top: component.y,
              width: size.width,
              height: size.height,
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            {/* Delete button */}
            {!isRunning && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveComponent(component.instanceId);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200
                           hover:scale-110 hover:bg-destructive/90 z-20 shadow-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* Component label */}
            {component.type !== 'arduino-uno' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 glass px-2.5 py-1 rounded-lg text-[10px] font-semibold text-foreground whitespace-nowrap shadow-lg">
                {getComponentLabel(component.type, component)}
                {component.pin && (
                  <span className="ml-1.5 text-primary font-mono">D{component.pin}</span>
                )}
                {component.analogPin && (
                  <span className="ml-1.5 text-primary font-mono">{component.analogPin}</span>
                )}
              </div>
            )}
            
            {/* Component icon */}
            <div className={isRunning && component.type === 'push-button' ? '' : 'pointer-events-none'}>
              {renderComponent(component)}
            </div>

            {/* LED color selector */}
            {isLED && !isRunning && (
              <LEDColorSelector
                currentColor={component.ledColor || 'red'}
                onColorChange={(color) => onChangeLEDColor(component.instanceId, color)}
              />
            )}

            {/* Resistor value selector */}
            {isResistor && !isRunning && (
              <ResistorValueSelector
                currentValue={component.resistorValue || '220'}
                onValueChange={(value) => onChangeResistorValue(component.instanceId, value)}
              />
            )}

            {/* Pin selector */}
            {showPinSelector && !isRunning && (
              <div className={isLED ? 'absolute -bottom-16 left-1/2 -translate-x-1/2' : ''}>
                <PinSelector
                  currentPin={component.pin!}
                  usedPins={usedPins}
                  instanceId={component.instanceId}
                  componentType={component.type as 'led' | 'push-button' | 'buzzer'}
                  onPinChange={(newPin) => onChangePin(component.instanceId, newPin)}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Instructions */}
      {!isRunning && components.length > 0 && (
        <div className="absolute bottom-4 right-4 glass px-4 py-3 rounded-xl text-sm">
          {!hasArduino ? (
            <span className="text-warning flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              Add an Arduino Uno to enable wiring
            </span>
          ) : (
            <span className="text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-primary/20 text-primary rounded-md text-xs font-mono mx-1 border border-primary/30">Start</kbd> to run simulation
            </span>
          )}
        </div>
      )}
    </div>
  );
}
