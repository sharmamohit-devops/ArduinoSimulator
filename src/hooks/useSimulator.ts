import { useState, useCallback, useMemo } from 'react';
import {
  PlacedComponent,
  ComponentType,
  SimulatorState,
  Wire,
  DigitalPin,
  LEDColor,
  ResistorValue,
  DEFAULT_LED_PIN,
  DEFAULT_BUTTON_PIN,
  DEFAULT_BUZZER_PIN,
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
      
      // Assign default pin for components that need them
      if (type === 'led') {
        pin = getNextAvailablePin(newUsedPins, DEFAULT_LED_PIN) ?? undefined;
      } else if (type === 'push-button') {
        pin = getNextAvailablePin(newUsedPins, DEFAULT_BUTTON_PIN) ?? undefined;
      } else if (type === 'buzzer') {
        pin = getNextAvailablePin(newUsedPins, DEFAULT_BUZZER_PIN) ?? undefined;
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
        ledColor: type === 'led' ? 'red' : undefined,
        resistorValue: type === 'resistor' ? '220' : undefined,
        analogPin: type === 'potentiometer' ? 'A0' : undefined,
        state: type === 'led' || type === 'buzzer' 
          ? { isOn: false } 
          : type === 'push-button' 
          ? { isPressed: false } 
          : type === 'potentiometer'
          ? { potValue: 512 }
          : undefined,
      };

      // Create wire if there's an Arduino and this component has a pin
      const arduino = prev.components.find(c => c.type === 'arduino-uno');
      const newWires = [...prev.wires];
      
      if (arduino && pin !== undefined && type !== 'arduino-uno' && type !== 'resistor' && type !== 'potentiometer') {
        const wireColor = type === 'led' ? WIRE_COLORS.led 
          : type === 'buzzer' ? WIRE_COLORS.buzzer 
          : WIRE_COLORS.button;
        wire = {
          id: generateId(),
          fromComponent: instanceId,
          toComponent: arduino.instanceId,
          fromPin: pin,
          color: wireColor,
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

  // Change LED color
  const changeLEDColor = useCallback((instanceId: string, color: LEDColor) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.instanceId === instanceId && comp.type === 'led'
          ? { ...comp, ledColor: color }
          : comp
      ),
    }));
  }, []);

  // Change resistor value
  const changeResistorValue = useCallback((instanceId: string, value: ResistorValue) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.instanceId === instanceId && comp.type === 'resistor'
          ? { ...comp, resistorValue: value }
          : comp
      ),
    }));
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

  // Handle button press during simulation (toggle/latching behavior)
  const handleButtonPress = useCallback((instanceId: string, newPressedState: boolean) => {
    setState((prev) => {
      // Only allow interaction when simulation is running
      if (!prev.isRunning) return prev;

      // Update button state with toggle (latching) behavior
      const newComponents = prev.components.map((comp) => {
        if (comp.instanceId === instanceId && comp.type === 'push-button') {
          return { ...comp, state: { ...comp.state, isPressed: newPressedState } };
        }
        return comp;
      });

      // If button is pressed, turn on all LEDs and buzzers; if released, turn off
      const finalComponents = newComponents.map((comp) => {
        if (comp.type === 'led' || comp.type === 'buzzer') {
          return { ...comp, state: { ...comp.state, isOn: newPressedState } };
        }
        return comp;
      });

      return {
        ...prev,
        components: finalComponents,
      };
    });
  }, []);

  // Start simulation
  const startSimulation = useCallback(() => {
    setState((prev) => {
      // Reset all component states
      const resetComponents = prev.components.map((comp) => ({
        ...comp,
        state: comp.type === 'led' || comp.type === 'buzzer'
          ? { isOn: false }
          : comp.type === 'push-button'
          ? { isPressed: false }
          : comp.type === 'potentiometer'
          ? { potValue: comp.state?.potValue ?? 512 }
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
        state: comp.type === 'led' || comp.type === 'buzzer'
          ? { isOn: false }
          : comp.type === 'push-button'
          ? { isPressed: false }
          : comp.type === 'potentiometer'
          ? { potValue: comp.state?.potValue ?? 512 }
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
    changeLEDColor,
    changeResistorValue,
    setComponentState,
    handleButtonPress,
    startSimulation,
    stopSimulation,
    setViewMode,
    clearCanvas,
  };
}
