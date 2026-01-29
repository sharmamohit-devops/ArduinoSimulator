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
      return 'from-blue-500/20 to-cyan-500/20';
    case 'led':
      return 'from-red-500/20 to-orange-500/20';
    case 'push-button':
      return 'from-purple-500/20 to-pink-500/20';
    case 'resistor':
      return 'from-amber-500/20 to-yellow-500/20';
    case 'buzzer':
      return 'from-violet-500/20 to-purple-500/20';
    case 'potentiometer':
      return 'from-emerald-500/20 to-teal-500/20';
    default:
      return 'from-gray-500/20 to-gray-600/20';
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
    <aside className="w-80 bg-gradient-to-b from-sidebar to-[hsl(220,25%,8%)] border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Component Library
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Drag components to the canvas</p>
      </div>
      
      {/* Component List by Category */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {categoryOrder.map((category) => {
          const components = groupedComponents[category];
          if (!components) return null;
          
          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground uppercase tracking-wider">
                {getCategoryIcon(category)}
                <span>{getCategoryLabel(category)}</span>
              </div>
              
              {/* Components */}
              <div className="space-y-3">
                {components.map((component) => {
                  const defaultPin = getDefaultPin(component.id);
                  const colorClass = getComponentColor(component.id);
                  
                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.id)}
                      className="component-card group relative"
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-center gap-4">
                        {/* Icon container */}
                        <div className="flex-shrink-0 p-2 bg-gradient-to-br from-muted to-muted/50 rounded-lg group-hover:from-primary/20 group-hover:to-primary/5 transition-all duration-300 flex items-center justify-center min-w-[70px] min-h-[50px]">
                          {getComponentIcon(component.id)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {component.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {component.description}
                          </p>
                          {defaultPin && (
                            <p className="text-[10px] font-mono mt-1.5 inline-flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              Pin: {defaultPin}
                            </p>
                          )}
                        </div>
                        
                        {/* Drag indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
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
      <div className="p-4 border-t border-border bg-gradient-to-t from-muted/20 to-transparent">
        <div className="bg-card/50 rounded-xl p-3 border border-border/50">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">?</span>
            Quick Start
          </p>
          <ol className="text-[11px] text-muted-foreground space-y-1.5">
            {[
              'Add Arduino Uno first',
              'Add LED, Button, Resistor',
              'Components auto-wire',
              'Click START to simulate',
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[9px] font-bold flex-shrink-0">
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
