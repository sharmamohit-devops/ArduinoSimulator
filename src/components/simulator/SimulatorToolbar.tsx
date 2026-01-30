import { Play, Square, LayoutGrid, Code, RotateCcw, CircuitBoard, Sparkles } from 'lucide-react';

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
    <header className="h-16 toolbar-gradient border-b border-border/50 flex items-center justify-between px-6">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all duration-300" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 rounded-xl flex items-center justify-center group-hover:border-primary/60 transition-all duration-300">
            <CircuitBoard className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ms</span>
            <span>Simulator</span>
            <Sparkles className="w-4 h-4 text-primary/60" />
          </h1>
          <p className="text-xs text-muted-foreground tracking-wide">
            Arduino Circuit Simulator • FOSSEE OSHW
          </p>
        </div>
      </div>

      {/* Center: View mode toggle + Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center p-1 bg-secondary/40 rounded-xl border border-border/50">
          <button
            onClick={() => onViewModeChange('component')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'component'
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Circuit
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'code'
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>

        {/* Simulation Status */}
        <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
          isRunning 
            ? 'bg-success/15 text-success border-success/40 shadow-lg shadow-success/10' 
            : 'bg-secondary/30 text-muted-foreground border-border/50'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-success status-pulse' : 'bg-muted-foreground/40'}`} />
          {isRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Reset Circuit Button */}
        <button
          onClick={onClear}
          disabled={!hasComponents || isRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                     text-muted-foreground hover:text-foreground
                     bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-border
                     transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:bg-secondary/30"
          title="Reset Circuit"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <div className="w-px h-8 bg-border/50" />
        
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!hasComponents}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                       text-success-foreground disabled:opacity-40 disabled:cursor-not-allowed
                       disabled:transform-none disabled:shadow-none"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={onStop}
            className="btn-danger flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                       text-destructive-foreground"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
      </div>
    </header>
  );
}
