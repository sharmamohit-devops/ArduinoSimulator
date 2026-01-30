import { COMPONENT_DEFINITIONS, ComponentType, DEFAULT_LED_PIN, DEFAULT_BUTTON_PIN, DEFAULT_BUZZER_PIN } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { ResistorIcon } from './icons/ResistorIcon';
import { BuzzerIcon } from './icons/BuzzerIcon';
import { PotentiometerIcon } from './icons/PotentiometerIcon';
import { Cpu, GripVertical, CircuitBoard, Lightbulb, MousePointer2, Info, Zap } from 'lucide-react';

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
      return <CircuitBoard className="w-3.5 h-3.5" />;
    case 'output':
      return <Lightbulb className="w-3.5 h-3.5" />;
    case 'input':
      return <MousePointer2 className="w-3.5 h-3.5" />;
    case 'passive':
      return <span className="text-[11px] font-mono font-bold">Ω</span>;
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

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'board':
      return 'text-primary';
    case 'output':
      return 'text-amber-400';
    case 'input':
      return 'text-violet-400';
    case 'passive':
      return 'text-emerald-400';
    default:
      return 'text-muted-foreground';
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
    <aside className="w-80 sidebar-gradient border-r border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground tracking-tight">
              Component Library
            </h2>
            <p className="text-[11px] text-muted-foreground">Drag to canvas</p>
          </div>
        </div>
      </div>
      
      {/* Component List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {categoryOrder.map((category) => {
          const components = groupedComponents[category];
          if (!components) return null;
          
          return (
            <div key={category} className="fade-in-up">
              {/* Category Header */}
              <div className={`flex items-center gap-2 mb-3 text-[11px] uppercase tracking-wider font-semibold ${getCategoryColor(category)}`}>
                {getCategoryIcon(category)}
                <span>{getCategoryLabel(category)}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-current/30 to-transparent ml-2" />
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
                      className="group relative p-3.5 bg-card/80 border border-border/50 rounded-xl cursor-grab 
                                 hover:border-primary/50 hover:bg-card transition-all duration-300
                                 active:cursor-grabbing active:scale-[0.98] active:border-primary
                                 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Icon */}
                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-lg flex items-center justify-center min-w-[56px] min-h-[44px] group-hover:from-primary/20 group-hover:to-primary/5 transition-all duration-300">
                          {getComponentIcon(component.id)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {component.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {component.description}
                          </p>
                          {defaultPin && (
                            <span className="chip mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              Pin: {defaultPin}
                            </span>
                          )}
                        </div>
                        
                        {/* Drag handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      <div className="px-5 py-5 border-t border-border/50 bg-gradient-to-t from-background/50 to-transparent">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-[11px] space-y-2">
              <p className="font-semibold text-foreground">Pin Mapping</p>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">LED</span>
                  <span className="text-primary font-bold">D{DEFAULT_LED_PIN}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Button</span>
                  <span className="text-primary font-bold">D{DEFAULT_BUTTON_PIN}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Buzzer</span>
                  <span className="text-primary font-bold">D{DEFAULT_BUZZER_PIN}</span>
                </div>
              </div>
              <p className="text-muted-foreground/70 text-[10px]">
                Supports Digital Pins D2–D13
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
