export type ComponentType = 'arduino-uno' | 'led' | 'push-button';

export interface ComponentDefinition {
  id: ComponentType;
  name: string;
  description: string;
}

export interface PlacedComponent {
  instanceId: string;
  type: ComponentType;
  x: number;
  y: number;
  props?: Record<string, unknown>;
}

export interface SimulatorState {
  components: PlacedComponent[];
  isRunning: boolean;
  viewMode: 'component' | 'code';
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    id: 'arduino-uno',
    name: 'Arduino Uno',
    description: 'ATmega328P microcontroller board',
  },
  {
    id: 'led',
    name: 'LED',
    description: 'Light Emitting Diode',
  },
  {
    id: 'push-button',
    name: 'Push Button',
    description: 'Momentary tactile switch',
  },
];
