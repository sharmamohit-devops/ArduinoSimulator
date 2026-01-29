export type ComponentType = 'arduino-uno' | 'led' | 'push-button' | 'resistor' | 'buzzer' | 'potentiometer';

// Available digital pins on Arduino Uno (D2-D13)
export const AVAILABLE_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type DigitalPin = typeof AVAILABLE_PINS[number];

// Analog pins for potentiometer
export const ANALOG_PINS = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'] as const;
export type AnalogPin = typeof ANALOG_PINS[number];

// Default pin assignments
export const DEFAULT_LED_PIN: DigitalPin = 10;
export const DEFAULT_BUTTON_PIN: DigitalPin = 2;
export const DEFAULT_BUZZER_PIN: DigitalPin = 9;
export const DEFAULT_POTENTIOMETER_PIN: AnalogPin = 'A0';

// LED color options
export type LEDColor = 'red' | 'green' | 'blue' | 'yellow' | 'white';

export const LED_COLORS: Record<LEDColor, { hex: string; glow: string; label: string }> = {
  red: { hex: '#FF3333', glow: '#FF0000', label: 'Red' },
  green: { hex: '#33FF66', glow: '#00FF00', label: 'Green' },
  blue: { hex: '#3388FF', glow: '#0066FF', label: 'Blue' },
  yellow: { hex: '#FFDD33', glow: '#FFCC00', label: 'Yellow' },
  white: { hex: '#FFFFFF', glow: '#EEEEFF', label: 'White' },
};

// Resistor values with color codes
export type ResistorValue = '220' | '330' | '470' | '1k' | '4.7k' | '10k' | '47k' | '100k';

export const RESISTOR_VALUES: Record<ResistorValue, { 
  ohms: number; 
  label: string; 
  bands: [string, string, string, string]; // color bands
}> = {
  '220': { ohms: 220, label: '220Ω', bands: ['#FF0000', '#FF0000', '#A52A2A', '#FFD700'] },
  '330': { ohms: 330, label: '330Ω', bands: ['#FFA500', '#FFA500', '#A52A2A', '#FFD700'] },
  '470': { ohms: 470, label: '470Ω', bands: ['#FFFF00', '#9400D3', '#A52A2A', '#FFD700'] },
  '1k': { ohms: 1000, label: '1kΩ', bands: ['#A52A2A', '#000000', '#FF0000', '#FFD700'] },
  '4.7k': { ohms: 4700, label: '4.7kΩ', bands: ['#FFFF00', '#9400D3', '#FF0000', '#FFD700'] },
  '10k': { ohms: 10000, label: '10kΩ', bands: ['#A52A2A', '#000000', '#FFA500', '#FFD700'] },
  '47k': { ohms: 47000, label: '47kΩ', bands: ['#FFFF00', '#9400D3', '#FFA500', '#FFD700'] },
  '100k': { ohms: 100000, label: '100kΩ', bands: ['#A52A2A', '#000000', '#FFFF00', '#FFD700'] },
};

export interface ComponentDefinition {
  id: ComponentType;
  name: string;
  description: string;
  defaultPin?: DigitalPin;
  category: 'board' | 'output' | 'input' | 'passive';
}

export interface PlacedComponent {
  instanceId: string;
  type: ComponentType;
  x: number;
  y: number;
  pin?: DigitalPin;
  analogPin?: AnalogPin;
  ledColor?: LEDColor;
  resistorValue?: ResistorValue;
  // Runtime state during simulation
  state?: {
    isOn?: boolean;           // For LED, Buzzer
    isPressed?: boolean;      // For Button
    potValue?: number;        // 0-1023 for potentiometer
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
    category: 'board',
  },
  {
    id: 'led',
    name: 'LED',
    description: 'Light Emitting Diode',
    defaultPin: DEFAULT_LED_PIN,
    category: 'output',
  },
  {
    id: 'resistor',
    name: 'Resistor',
    description: 'Current limiting resistor',
    category: 'passive',
  },
  {
    id: 'push-button',
    name: 'Push Button',
    description: 'Momentary tactile switch',
    defaultPin: DEFAULT_BUTTON_PIN,
    category: 'input',
  },
  {
    id: 'buzzer',
    name: 'Buzzer',
    description: 'Piezo buzzer for sound',
    defaultPin: DEFAULT_BUZZER_PIN,
    category: 'output',
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    description: 'Variable resistor (10kΩ)',
    category: 'input',
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
  buzzer: '#8B5CF6',   // Purple for Buzzer
  potentiometer: '#10B981', // Green for Potentiometer
  ground: '#000000',   // Black for ground
  power: '#DC2626',    // Dark red for power
};
