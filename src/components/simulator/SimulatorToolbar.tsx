import { Play, Square, LayoutGrid, Code, RotateCcw, CircuitBoard } from 'lucide-react';

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
    <header className="h-12 bg-toolbar border-b border-border flex items-center justify-between px-4">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded flex items-center justify-center">
          <CircuitBoard className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-wide">
            Ms Simulator
          </h1>
          <p className="text-[10px] text-muted-foreground">
            FOSSEE OSHW • Arduino Circuit Simulator
          </p>
        </div>
      </div>

      {/* Center: View mode toggle + Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
          <button
            onClick={() => onViewModeChange('component')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'component'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Circuit
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        {/* Simulation Status Indicator */}
        <div className={`status-indicator ${isRunning ? 'status-running' : 'status-stopped'}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success' : 'bg-muted-foreground/50'}`} />
          <span>Status: {isRunning ? 'RUNNING' : 'STOPPED'}</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Reset Circuit Button */}
        <button
          onClick={onClear}
          disabled={!hasComponents || isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium 
                     text-muted-foreground hover:text-foreground hover:bg-muted 
                     transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Reset Circuit - Clears all components and restores defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Circuit
        </button>
        
        <div className="w-px h-5 bg-border" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="sim-btn-start flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="sim-btn-stop flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Stop</span>
          </button>
        )}
      </div>
    </header>
  );
}
