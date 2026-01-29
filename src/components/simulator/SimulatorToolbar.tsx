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
    <header className="h-16 bg-gradient-to-r from-[hsl(220,25%,8%)] via-[hsl(220,25%,10%)] to-[hsl(220,25%,8%)] border-b border-border flex items-center justify-between px-6">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <CircuitBoard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground font-display tracking-wide flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ms
            </span>
            <span>Simulator</span>
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" />
            FOSSEE OSHW • Task 2 &amp; 3
          </p>
        </div>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 border border-border/50">
        <button
          onClick={() => onViewModeChange('component')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            viewMode === 'component'
              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          style={{
            boxShadow: viewMode === 'component' ? '0 0 20px hsl(var(--primary) / 0.3)' : 'none'
          }}
        >
          <LayoutGrid className="w-4 h-4" />
          Circuit
        </button>
        <button
          onClick={() => onViewModeChange('code')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            viewMode === 'code'
              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          style={{
            boxShadow: viewMode === 'code' ? '0 0 20px hsl(var(--primary) / 0.3)' : 'none'
          }}
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium 
                       text-muted-foreground hover:text-destructive hover:bg-destructive/10 
                       border border-transparent hover:border-destructive/30 transition-all duration-200"
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
            className="sim-btn-start flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            <span>START</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="sim-btn-stop flex items-center gap-2"
          >
            <Square className="w-5 h-5" />
            <span>STOP</span>
          </button>
        )}
      </div>
    </header>
  );
}
