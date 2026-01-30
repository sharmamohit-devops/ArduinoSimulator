import { COMPONENT_DEFINITIONS, ComponentType, DEFAULT_LED_PIN, DEFAULT_BUTTON_PIN, DEFAULT_BUZZER_PIN } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { ResistorIcon } from './icons/ResistorIcon';
import { BuzzerIcon } from './icons/BuzzerIcon';
import { PotentiometerIcon } from './icons/PotentiometerIcon';
import { Cpu, GripVertical, CircuitBoard, Lightbulb, MousePointer2, Info } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentType) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={80} />;
    case 'led':
      return <LEDIcon size={36} />;
    case 'push-button':
      return <PushButtonIcon size={44} />;
    case 'resistor':
      return <ResistorIcon size={60} />;
    case 'buzzer':
      return <BuzzerIcon size={40} />;
    case 'potentiometer':
      return <PotentiometerIcon size={48} />;
    default:
      return <Cpu className="w-6 h-6 text-muted-foreground" />;
  }
};

const getDefaultPin = (type: ComponentType): string | null => {
  switch (type) {
    case 'led':
      return `D${DEFAULT_LED_PIN}`;
    case 'push-button':
      return `D${DEFAULT_BUTTON_PIN}`;
    case 'buzzer':
      return `D${DEFAULT_BUZZER_PIN}`;
    case 'potentiometer':
      return 'A0';
    default:
      return null;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'board':
      return <CircuitBoard className="w-3 h-3" />;
    case 'output':
      return <Lightbulb className="w-3 h-3" />;
    case 'input':
      return <MousePointer2 className="w-3 h-3" />;
    case 'passive':
      return <span className="text-[10px] font-mono">Ω</span>;
    default:
      return null;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'board':
      return 'Microcontroller';
    case 'output':
      return 'Output Components';
    case 'input':
      return 'Input Components';
    case 'passive':
      return 'Passive Components';
    default:
      return category;
  }
};

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(type);
  };

  // Group components by category
  const groupedComponents = COMPONENT_DEFINITIONS.reduce((acc, comp) => {
    const category = comp.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(comp);
    return acc;
  }, {} as Record<string, typeof COMPONENT_DEFINITIONS>);

  const categoryOrder = ['board', 'output', 'input', 'passive'];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Component Library
        </h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Drag components to canvas</p>
      </div>
      
      {/* Component List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {categoryOrder.map((category) => {
          const components = groupedComponents[category];
          if (!components) return null;
          
          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-1.5 mb-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {getCategoryIcon(category)}
                <span>{getCategoryLabel(category)}</span>
              </div>
              
              {/* Components */}
              <div className="space-y-1.5">
                {components.map((component) => {
                  const defaultPin = getDefaultPin(component.id);
                  
                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.id)}
                      className="component-card group py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Icon */}
                        <div className="flex-shrink-0 p-1 bg-muted/30 rounded flex items-center justify-center min-w-[48px] min-h-[36px]">
                          {getComponentIcon(component.id)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium text-foreground">
                            {component.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">
                            {component.description}
                          </p>
                          {defaultPin && (
                            <p className="text-[9px] font-mono mt-1 text-primary/80">
                              Default: {defaultPin}
                            </p>
                          )}
                        </div>
                        
                        {/* Drag handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pin Info */}
      <div className="px-3 py-3 border-t border-border">
        <div className="bg-muted/30 rounded p-2.5 space-y-2">
          <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground/80 mb-1">Default Pin Mapping</p>
              <ul className="space-y-0.5">
                <li>• LED → D{DEFAULT_LED_PIN}</li>
                <li>• Push Button → D{DEFAULT_BUTTON_PIN}</li>
                <li>• Buzzer → D{DEFAULT_BUZZER_PIN}</li>
              </ul>
              <p className="mt-1.5 text-muted-foreground/80">
                Only Digital Pins (D2–D13) are supported
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
