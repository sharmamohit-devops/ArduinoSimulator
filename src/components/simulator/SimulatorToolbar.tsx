import { Play, Square, LayoutGrid, Code, Trash2 } from 'lucide-react';

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
    <header className="h-14 bg-toolbar border-b border-border flex items-center justify-between px-4 shadow-panel">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Arduino Simulator</h1>
          <p className="text-xs text-muted-foreground">FOSSEE OSHW Task 1</p>
        </div>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('component')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'component'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Component View
        </button>
        <button
          onClick={() => onViewModeChange('code')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'code'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <Code className="w-4 h-4" />
          Code View
        </button>
      </div>

      {/* Right: Simulation controls */}
      <div className="flex items-center gap-2">
        {hasComponents && (
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="sim-btn-start flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={onStop}
            className="sim-btn-stop flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
      </div>
    </header>
  );
}
