export type ComponentType = 'arduino-uno' | 'led' | 'push-button';

// Available digital pins on Arduino Uno (D2-D13)
export const AVAILABLE_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type DigitalPin = typeof AVAILABLE_PINS[number];

// Default pin assignments
export const DEFAULT_LED_PIN: DigitalPin = 10;
export const DEFAULT_BUTTON_PIN: DigitalPin = 2;

export interface ComponentDefinition {
  id: ComponentType;
  name: string;
  description: string;
  defaultPin?: DigitalPin;
}

export interface PlacedComponent {
  instanceId: string;
  type: ComponentType;
  x: number;
  y: number;
  pin?: DigitalPin;
  // Runtime state during simulation
  state?: {
    isOn?: boolean;      // For LED
    isPressed?: boolean; // For Button
  };
}

export interface Wire {
  id: string;
  fromComponent: string;  // instanceId
  toComponent: string;    // instanceId (Arduino)
  fromPin: DigitalPin;
  color: string;
}

export interface SimulatorState {
  components: PlacedComponent[];
  wires: Wire[];
  isRunning: boolean;
  viewMode: 'component' | 'code';
  // Track which pins are in use
  usedPins: Map<DigitalPin, string>; // pin -> instanceId
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
    defaultPin: DEFAULT_LED_PIN,
  },
  {
    id: 'push-button',
    name: 'Push Button',
    description: 'Momentary tactile switch',
    defaultPin: DEFAULT_BUTTON_PIN,
  },
];

// Get the next available pin for a component type
export function getNextAvailablePin(
  usedPins: Map<DigitalPin, string>,
  preferredPin: DigitalPin,
  excludeInstanceId?: string
): DigitalPin | null {
  // First try the preferred pin
  const currentUser = usedPins.get(preferredPin);
  if (!currentUser || currentUser === excludeInstanceId) {
    return preferredPin;
  }
  
  // Find the first available pin
  for (const pin of AVAILABLE_PINS) {
    const user = usedPins.get(pin);
    if (!user || user === excludeInstanceId) {
      return pin;
    }
  }
  
  return null; // No pins available
}

// Get available pins for a component (excluding pins used by others)
export function getAvailablePins(
  usedPins: Map<DigitalPin, string>,
  currentInstanceId: string
): DigitalPin[] {
  return AVAILABLE_PINS.filter(pin => {
    const user = usedPins.get(pin);
    return !user || user === currentInstanceId;
  });
}

// Wire colors for visual distinction
export const WIRE_COLORS = {
  led: '#EF4444',      // Red for LED
  button: '#3B82F6',   // Blue for Button
  ground: '#000000',   // Black for ground
  power: '#DC2626',    // Dark red for power
};
