import { COMPONENT_DEFINITIONS, ComponentType } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { Cpu } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentType) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={64} />;
    case 'led':
      return <LEDIcon size={36} />;
    case 'push-button':
      return <PushButtonIcon size={36} />;
    default:
      return <Cpu className="w-8 h-8 text-muted-foreground" />;
  }
};

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(type);
  };

  return (
    <aside className="w-64 bg-panel border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          Components
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Drag to canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {COMPONENT_DEFINITIONS.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => handleDragStart(e, component.id)}
            className="component-card group"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 bg-muted rounded-md group-hover:bg-component-hover transition-colors">
                {getComponentIcon(component.id)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {component.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {component.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Drag components onto the canvas to build your circuit
        </p>
      </div>
    </aside>
  );
}
