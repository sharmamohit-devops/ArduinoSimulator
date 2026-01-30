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
    <header className="h-14 bg-toolbar border-b border-border flex items-center justify-between px-5">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 rounded-lg flex items-center justify-center">
          <CircuitBoard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            <span className="text-primary">Ms</span> Simulator
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-wide">
            FOSSEE OSHW • Arduino Circuit Simulator
          </p>
        </div>
      </div>

      {/* Center: View mode toggle + Status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-0.5 bg-secondary/50 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('component')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'component'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Circuit
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'code'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>

        {/* Simulation Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${
          isRunning 
            ? 'bg-success/10 text-success border-success/30' 
            : 'bg-secondary/30 text-muted-foreground border-border'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted-foreground/40'}`} />
          Status: {isRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Circuit Button */}
        <button
          onClick={onClear}
          disabled={!hasComponents || isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                     text-muted-foreground hover:text-foreground hover:bg-secondary 
                     transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                     border border-transparent hover:border-border"
          title="Reset Circuit - Clears all components"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <div className="w-px h-6 bg-border" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                       bg-success text-success-foreground hover:bg-success/90
                       transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                       shadow-sm hover:shadow-md"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                       bg-destructive text-destructive-foreground hover:bg-destructive/90
                       transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
      </div>
    </header>
  );
}
