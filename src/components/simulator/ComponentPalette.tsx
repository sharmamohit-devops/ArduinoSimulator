import { COMPONENT_DEFINITIONS, ComponentType, DEFAULT_LED_PIN, DEFAULT_BUTTON_PIN } from '@/types/simulator';
import { ArduinoIcon } from './icons/ArduinoIcon';
import { LEDIcon } from './icons/LEDIcon';
import { PushButtonIcon } from './icons/PushButtonIcon';
import { Cpu, Zap } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentType) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'arduino-uno':
      return <ArduinoIcon size={80} />;
    case 'led':
      return <LEDIcon size={40} />;
    case 'push-button':
      return <PushButtonIcon size={44} />;
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

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(type);
  };

  return (
    <aside className="w-72 bg-panel border-r border-border flex flex-col h-full shadow-panel">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Components
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Drag components to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {COMPONENT_DEFINITIONS.map((component) => {
          const defaultPin = getDefaultPin(component.id);
          
          return (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
              className="component-card group relative"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-2 bg-muted rounded-lg group-hover:bg-component-hover transition-colors flex items-center justify-center min-w-[70px] min-h-[60px]">
                  {getComponentIcon(component.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {component.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {component.description}
                  </p>
                  {defaultPin && (
                    <p className="text-xs text-primary font-mono mt-1">
                      Default: {defaultPin}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Drag indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border bg-muted/30 space-y-2">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Quick Start:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Add Arduino Uno first</li>
            <li>Add LED &amp; Button</li>
            <li>Auto-wiring connects pins</li>
            <li>Click Start to simulate</li>
          </ol>
        </div>
      </div>
    </aside>
  );
}
