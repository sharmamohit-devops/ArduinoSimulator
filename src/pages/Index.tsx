import { useSimulator } from '@/hooks/useSimulator';
import { ComponentPalette } from '@/components/simulator/ComponentPalette';
import { CanvasWorkspace } from '@/components/simulator/CanvasWorkspace';
import { CodePanel } from '@/components/simulator/CodePanel';
import { SimulatorToolbar } from '@/components/simulator/SimulatorToolbar';
import { ComponentType } from '@/types/simulator';
import { useState } from 'react';

const Index = () => {
  const {
    state,
    addComponent,
    moveComponent,
    removeComponent,
    startSimulation,
    stopSimulation,
    setViewMode,
    clearCanvas,
  } = useSimulator();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (_type: ComponentType) => {
    setIsDragging(true);
  };

  const handleDropComponent = (type: ComponentType, x: number, y: number) => {
    addComponent(type, x, y);
    setIsDragging(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <SimulatorToolbar
        viewMode={state.viewMode}
        isRunning={state.isRunning}
        hasComponents={state.components.length > 0}
        onViewModeChange={setViewMode}
        onStart={startSimulation}
        onStop={stopSimulation}
        onClear={clearCanvas}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Palette */}
        <ComponentPalette onDragStart={handleDragStart} />

        {/* Center & Right - Canvas and/or Code */}
        <main className="flex-1 flex overflow-hidden">
          {state.viewMode === 'component' ? (
            /* Component View - Full Canvas */
            <CanvasWorkspace
              components={state.components}
              isRunning={state.isRunning}
              onDropComponent={handleDropComponent}
              onMoveComponent={moveComponent}
              onRemoveComponent={removeComponent}
            />
          ) : (
            /* Code View - Split View */
            <div className="flex-1 flex">
              {/* Canvas - Left half */}
              <div className="w-1/2 border-r border-border">
                <CanvasWorkspace
                  components={state.components}
                  isRunning={state.isRunning}
                  onDropComponent={handleDropComponent}
                  onMoveComponent={moveComponent}
                  onRemoveComponent={removeComponent}
                />
              </div>
              {/* Code Panel - Right half */}
              <div className="w-1/2 p-4 bg-background">
                <CodePanel
                  components={state.components}
                  isRunning={state.isRunning}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Drag indicator overlay */}
      {isDragging && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-lg m-2" />
        </div>
      )}
    </div>
  );
};

export default Index;
