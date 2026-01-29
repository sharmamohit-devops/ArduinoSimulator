import { useState, useCallback } from 'react';
import { PlacedComponent, ComponentType, SimulatorState } from '@/types/simulator';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useSimulator() {
  const [state, setState] = useState<SimulatorState>({
    components: [],
    isRunning: false,
    viewMode: 'component',
  });

  const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
    const newComponent: PlacedComponent = {
      instanceId: generateId(),
      type,
      x,
      y,
    };
    setState((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));
  }, []);

  const moveComponent = useCallback((instanceId: string, x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.instanceId === instanceId ? { ...comp, x, y } : comp
      ),
    }));
  }, []);

  const removeComponent = useCallback((instanceId: string) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.instanceId !== instanceId),
    }));
  }, []);

  const startSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const stopSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const setViewMode = useCallback((mode: 'component' | 'code') => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const clearCanvas = useCallback(() => {
    setState((prev) => ({ ...prev, components: [], isRunning: false }));
  }, []);

  return {
    state,
    addComponent,
    moveComponent,
    removeComponent,
    startSimulation,
    stopSimulation,
    setViewMode,
    clearCanvas,
  };
}
