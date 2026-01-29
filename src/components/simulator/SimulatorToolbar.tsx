import { Play, Square, LayoutGrid, Code, Trash2, CircuitBoard, Zap } from 'lucide-react';

interface SimulatorToolbarProps {
  viewMode: 'component' | 'code';
  isRunning: boolean;
  hasComponents: boolean;
  onViewModeChange: (mode: 'component' | 'code') => void;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function SimulatorToolbar({
  viewMode,
  isRunning,
  hasComponents,
  onViewModeChange,
  onStart,
  onStop,
  onClear,
}: SimulatorToolbarProps) {
  return (
    <header className="h-14 bg-toolbar border-b border-border flex items-center justify-between px-5">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <CircuitBoard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground font-display tracking-wide flex items-center gap-1.5">
            <span className="text-primary">Ms</span>
            <span className="text-foreground/90">Simulator</span>
          </h1>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-primary/70" />
            FOSSEE OSHW • Task 2 &amp; 3
          </p>
        </div>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
        <button
          onClick={() => onViewModeChange('component')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === 'component'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Circuit
        </button>
        <button
          onClick={() => onViewModeChange('code')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === 'code'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Code
        </button>
      </div>

      {/* Right: Simulation controls */}
      <div className="flex items-center gap-2">
        {hasComponents && !isRunning && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium 
                       text-muted-foreground hover:text-destructive hover:bg-destructive/10 
                       transition-all duration-200"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
        
        <div className="w-px h-6 bg-border/60" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="sim-btn-start flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="sim-btn-stop flex items-center gap-1.5"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
        )}
      </div>
    </header>
  );
}
