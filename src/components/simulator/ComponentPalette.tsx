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
    <aside className="w-72 bg-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-gradient-to-b from-sidebar-accent/30 to-transparent">
        <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Component Library
        </h2>
        <p className="text-[11px] text-muted-foreground mt-1">Drag components to canvas</p>
      </div>
      
      {/* Component List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categoryOrder.map((category) => {
          const components = groupedComponents[category];
          if (!components) return null;
          
          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium px-1">
                {getCategoryIcon(category)}
                <span>{getCategoryLabel(category)}</span>
              </div>
              
              {/* Components */}
              <div className="space-y-2">
                {components.map((component) => {
                  const defaultPin = getDefaultPin(component.id);
                  
                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.id)}
                      className="group relative p-3 bg-card border border-border rounded-lg cursor-grab 
                                 hover:border-primary/50 hover:bg-card/80 transition-all duration-200
                                 active:cursor-grabbing active:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 p-2 bg-secondary/50 rounded-md flex items-center justify-center min-w-[52px] min-h-[40px]">
                          {getComponentIcon(component.id)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {component.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {component.description}
                          </p>
                          {defaultPin && (
                            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-mono 
                                           bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Pin: {defaultPin}
                            </span>
                          )}
                        </div>
                        
                        {/* Drag handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4 text-muted-foreground/50" />
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
      
      {/* Pin Info Footer */}
      <div className="px-4 py-4 border-t border-border bg-gradient-to-t from-sidebar-accent/20 to-transparent">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground/90">Default Pin Mapping</p>
            <ul className="space-y-0.5 font-mono">
              <li>LED → <span className="text-primary">D{DEFAULT_LED_PIN}</span></li>
              <li>Button → <span className="text-primary">D{DEFAULT_BUTTON_PIN}</span></li>
              <li>Buzzer → <span className="text-primary">D{DEFAULT_BUZZER_PIN}</span></li>
            </ul>
            <p className="text-muted-foreground/70 text-[10px] pt-1">
              Digital Pins D2–D13 supported
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
