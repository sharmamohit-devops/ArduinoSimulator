import { Play, Square, LayoutGrid, Code, Trash2, CircuitBoard } from 'lucide-react';

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
    <header className="h-16 bg-toolbar border-b border-border flex items-center justify-between px-6 shadow-panel">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <CircuitBoard className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">Arduino Simulator</h1>
          <p className="text-xs text-muted-foreground">FOSSEE OSHW Internship — Task 2 &amp; 3</p>
        </div>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('component')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'component'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary-foreground hover:bg-muted'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Circuit
        </button>
        <button
          onClick={() => onViewModeChange('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'code'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary-foreground hover:bg-muted'
          }`}
        >
          <Code className="w-4 h-4" />
          Code
        </button>
      </div>

      {/* Right: Simulation controls */}
      <div className="flex items-center gap-3">
        {hasComponents && !isRunning && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium 
                       text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
        
        <div className="w-px h-8 bg-border" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="sim-btn-start flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Start Simulation
          </button>
        ) : (
          <button
            onClick={onStop}
            className="sim-btn-stop flex items-center gap-2 animate-pulse"
          >
            <Square className="w-4 h-4" />
            Stop Simulation
          </button>
        )}
      </div>
    </header>
  );
}
