import { COMPONENT_DEFINITIONS, ComponentType, DEFAULT_LED_PIN, DEFAULT_BUTTON_PIN, DEFAULT_BUZZER_PIN } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { ResistorIcon } from './icons/ResistorIcon';
import { BuzzerIcon } from './icons/BuzzerIcon';
import { PotentiometerIcon } from './icons/PotentiometerIcon';
import { Cpu, Zap, GripVertical, CircuitBoard, Lightbulb, MousePointer2 } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentType) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={90} />;
    case 'led':
      return <LEDIcon size={40} />;
    case 'push-button':
      return <PushButtonIcon size={50} />;
    case 'resistor':
      return <ResistorIcon size={70} />;
    case 'buzzer':
      return <BuzzerIcon size={46} />;
    case 'potentiometer':
      return <PotentiometerIcon size={54} />;
    default:
      return <Cpu className="w-8 h-8 text-muted-foreground" />;
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

const getComponentColor = (type: ComponentType): string => {
  switch (type) {
    case 'arduino-uno':
      return 'from-primary/15 to-primary/5';
    case 'led':
      return 'from-red-500/15 to-red-500/5';
    case 'push-button':
      return 'from-violet-500/15 to-violet-500/5';
    case 'resistor':
      return 'from-amber-500/15 to-amber-500/5';
    case 'buzzer':
      return 'from-purple-500/15 to-purple-500/5';
    case 'potentiometer':
      return 'from-emerald-500/15 to-emerald-500/5';
    default:
      return 'from-muted/15 to-muted/5';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'board':
      return <CircuitBoard className="w-3.5 h-3.5" />;
    case 'output':
      return <Lightbulb className="w-3.5 h-3.5" />;
    case 'input':
      return <MousePointer2 className="w-3.5 h-3.5" />;
    case 'passive':
      return <span className="text-xs">Ω</span>;
    default:
      return null;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'board':
      return 'Microcontroller';
    case 'output':
      return 'Output';
    case 'input':
      return 'Input';
    case 'passive':
      return 'Passive';
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
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary" />
          Component Library
        </h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Drag to canvas</p>
      </div>
      
      {/* Component List by Category */}
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
              <div className="space-y-2">
                {components.map((component) => {
                  const defaultPin = getDefaultPin(component.id);
                  const colorClass = getComponentColor(component.id);
                  
                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.id)}
                      className="component-card group relative py-3"
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                      
                      <div className="relative flex items-center gap-3">
                        {/* Icon container */}
                        <div className="flex-shrink-0 p-1.5 bg-muted/50 rounded-md group-hover:bg-primary/10 transition-all duration-200 flex items-center justify-center min-w-[56px] min-h-[40px]">
                          {getComponentIcon(component.id)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {component.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                            {component.description}
                          </p>
                          {defaultPin && (
                            <p className="text-[9px] font-mono mt-1 inline-flex items-center gap-0.5 bg-primary/10 text-primary/80 px-1.5 py-0.5 rounded">
                              {defaultPin}
                            </p>
                          )}
                        </div>
                        
                        {/* Drag indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/60" />
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
      
      {/* Quick Start Guide */}
      <div className="px-3 py-3 border-t border-border">
        <div className="bg-muted/30 rounded-lg p-2.5">
          <p className="text-[10px] font-medium text-foreground/80 mb-1.5 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[8px] font-bold">?</span>
            Quick Start
          </p>
          <ol className="text-[10px] text-muted-foreground space-y-1">
            {[
              'Add Arduino first',
              'Add LED & Button',
              'Click Start',
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[8px] font-medium flex-shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}
