import { COMPONENT_DEFINITIONS, ComponentType, DEFAULT_LED_PIN, DEFAULT_BUTTON_PIN } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { Cpu, Zap, GripVertical } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentType) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={90} />;
    case 'led':
      return <LEDIcon size={44} />;
    case 'push-button':
      return <PushButtonIcon size={50} />;
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
    default:
      return 'from-gray-500/20 to-gray-600/20';
  }
};

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(type);
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-sidebar to-[hsl(220,25%,8%)] border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Components
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Drag components to the canvas</p>
      </div>
      
      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {COMPONENT_DEFINITIONS.map((component) => {
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
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:from-primary/20 group-hover:to-primary/5 transition-all duration-300 flex items-center justify-center min-w-[80px] min-h-[70px]">
                  {getComponentIcon(component.id)}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {component.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {component.description}
                  </p>
                  {defaultPin && (
                    <p className="text-xs font-mono mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Default: {defaultPin}
                    </p>
                  )}
                </div>
                
                {/* Drag indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Start Guide */}
      <div className="p-4 border-t border-border bg-gradient-to-t from-muted/20 to-transparent">
        <div className="bg-card/50 rounded-xl p-4 border border-border/50">
          <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">?</span>
            Quick Start
          </p>
          <ol className="text-xs text-muted-foreground space-y-2">
            {[
              'Add Arduino Uno first',
              'Add LED & Push Button',
              'Wires connect automatically',
              'Click START to simulate',
              'Click button to toggle LED'
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
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
