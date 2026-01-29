import { useState, useCallback, useMemo } from 'react';
import {
  PlacedComponent,
  ComponentType,
  SimulatorState,
  Wire,
  DigitalPin,
  DEFAULT_LED_PIN,
  DEFAULT_BUTTON_PIN,
  getNextAvailablePin,
  WIRE_COLORS,
} from '@/types/simulator';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useSimulator() {
  const [state, setState] = useState<SimulatorState>({
    components: [],
    wires: [],
    isRunning: false,
    viewMode: 'component',
    usedPins: new Map(),
  });

  // Find the Arduino component
  const arduinoComponent = useMemo(() => 
    state.components.find(c => c.type === 'arduino-uno'),
    [state.components]
  );

  // Add component with auto-wiring
  const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
    setState((prev) => {
      const newUsedPins = new Map(prev.usedPins);
      let pin: DigitalPin | undefined;
      let wire: Wire | undefined;
      
      // Assign default pin for LED and Button
      if (type === 'led') {
        pin = getNextAvailablePin(newUsedPins, DEFAULT_LED_PIN) ?? undefined;
      } else if (type === 'push-button') {
        pin = getNextAvailablePin(newUsedPins, DEFAULT_BUTTON_PIN) ?? undefined;
      }

      const instanceId = generateId();
      
      // Register pin usage
      if (pin !== undefined) {
        newUsedPins.set(pin, instanceId);
      }

      const newComponent: PlacedComponent = {
        instanceId,
        type,
        x,
        y,
        pin,
        state: type === 'led' ? { isOn: false } : type === 'push-button' ? { isPressed: false } : undefined,
      };

      // Create wire if there's an Arduino and this component has a pin
      const arduino = prev.components.find(c => c.type === 'arduino-uno');
      const newWires = [...prev.wires];
      
      if (arduino && pin !== undefined && type !== 'arduino-uno') {
        wire = {
          id: generateId(),
          fromComponent: instanceId,
          toComponent: arduino.instanceId,
          fromPin: pin,
          color: type === 'led' ? WIRE_COLORS.led : WIRE_COLORS.button,
        };
        newWires.push(wire);
      }

      return {
        ...prev,
        components: [...prev.components, newComponent],
        wires: newWires,
        usedPins: newUsedPins,
      };
    });
  }, []);

  // Move component
  const moveComponent = useCallback((instanceId: string, x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.instanceId === instanceId ? { ...comp, x, y } : comp
      ),
    }));
  }, []);

  // Remove component and its wires
  const removeComponent = useCallback((instanceId: string) => {
    setState((prev) => {
      const component = prev.components.find(c => c.instanceId === instanceId);
      const newUsedPins = new Map(prev.usedPins);
      
      // Free up the pin
      if (component?.pin !== undefined) {
        newUsedPins.delete(component.pin);
      }

      // If removing Arduino, remove all wires
      const isArduino = component?.type === 'arduino-uno';
      
      return {
        ...prev,
        components: prev.components.filter((comp) => comp.instanceId !== instanceId),
        wires: isArduino 
          ? [] 
          : prev.wires.filter((wire) => wire.fromComponent !== instanceId),
        usedPins: newUsedPins,
      };
    });
  }, []);

  // Change pin assignment for a component
  const changeComponentPin = useCallback((instanceId: string, newPin: DigitalPin) => {
    setState((prev) => {
      const component = prev.components.find(c => c.instanceId === instanceId);
      if (!component) return prev;

      const newUsedPins = new Map(prev.usedPins);
      
      // Free old pin
      if (component.pin !== undefined) {
        newUsedPins.delete(component.pin);
      }
      
      // Assign new pin
      newUsedPins.set(newPin, instanceId);

      // Update component
      const newComponents = prev.components.map((comp) =>
        comp.instanceId === instanceId ? { ...comp, pin: newPin } : comp
      );

      // Update wire
      const newWires = prev.wires.map((wire) =>
        wire.fromComponent === instanceId ? { ...wire, fromPin: newPin } : wire
      );

      return {
        ...prev,
        components: newComponents,
        wires: newWires,
        usedPins: newUsedPins,
      };
    });
  }, []);

  // Set component runtime state (for simulation)
  const setComponentState = useCallback((instanceId: string, newState: Partial<PlacedComponent['state']>) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.instanceId === instanceId
          ? { ...comp, state: { ...comp.state, ...newState } }
          : comp
      ),
    }));
  }, []);

  // Handle button press during simulation
  const handleButtonPress = useCallback((instanceId: string, isPressed: boolean) => {
    if (!state.isRunning) return;

    setState((prev) => {
      // Update button state
      const newComponents = prev.components.map((comp) => {
        if (comp.instanceId === instanceId && comp.type === 'push-button') {
          return { ...comp, state: { ...comp.state, isPressed } };
        }
        return comp;
      });

      // If button is pressed, turn on all LEDs; if released, turn off all LEDs
      // This simulates: Button -> Arduino -> LED circuit
      const finalComponents = newComponents.map((comp) => {
        if (comp.type === 'led') {
          return { ...comp, state: { ...comp.state, isOn: isPressed } };
        }
        return comp;
      });

      return {
        ...prev,
        components: finalComponents,
      };
    });
  }, [state.isRunning]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setState((prev) => {
      // Reset all component states
      const resetComponents = prev.components.map((comp) => ({
        ...comp,
        state: comp.type === 'led' 
          ? { isOn: false }
          : comp.type === 'push-button'
          ? { isPressed: false }
          : comp.state,
      }));

      return {
        ...prev,
        components: resetComponents,
        isRunning: true,
      };
    });
  }, []);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setState((prev) => {
      // Reset all component states
      const resetComponents = prev.components.map((comp) => ({
        ...comp,
        state: comp.type === 'led'
          ? { isOn: false }
          : comp.type === 'push-button'
          ? { isPressed: false }
          : comp.state,
      }));

      return {
        ...prev,
        components: resetComponents,
        isRunning: false,
      };
    });
  }, []);

  // Set view mode
  const setViewMode = useCallback((mode: 'component' | 'code') => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setState({
      components: [],
      wires: [],
      isRunning: false,
      viewMode: state.viewMode,
      usedPins: new Map(),
    });
  }, [state.viewMode]);

  return {
    state,
    arduinoComponent,
    addComponent,
    moveComponent,
    removeComponent,
    changeComponentPin,
    setComponentState,
    handleButtonPress,
    startSimulation,
    stopSimulation,
    setViewMode,
    clearCanvas,
  };
}
