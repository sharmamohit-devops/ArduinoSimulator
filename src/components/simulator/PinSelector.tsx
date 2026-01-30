import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DigitalPin, AVAILABLE_PINS } from '@/types/simulator';

interface PinSelectorProps {
  currentPin: DigitalPin;
  usedPins: Map<DigitalPin, string>;
  instanceId: string;
  componentType: 'led' | 'push-button' | 'buzzer';
  onPinChange: (pin: DigitalPin) => void;
  disabled?: boolean;
}

export function PinSelector({
  currentPin,
  usedPins,
  instanceId,
  componentType,
  onPinChange,
  disabled = false,
}: PinSelectorProps) {
  const label = componentType === 'led' ? 'LED' : componentType === 'push-button' ? 'BTN' : 'BZR';

  // Check if a pin is available for this instance
  const isPinAvailable = (pin: DigitalPin): boolean => {
    const user = usedPins.get(pin);
    return !user || user === instanceId;
  };

  return (
    <div 
      className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 bg-card border border-border rounded shadow-md px-2 py-1">
        <span className="text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
        <Select
          value={currentPin.toString()}
          onValueChange={(value) => onPinChange(parseInt(value) as DigitalPin)}
          disabled={disabled}
        >
          <SelectTrigger className="h-6 w-16 text-xs border-0 bg-muted focus:ring-0 focus:ring-offset-0">
            <SelectValue>D{currentPin}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-lg z-50">
            <div className="px-2 py-1 text-[10px] text-muted-foreground border-b border-border mb-1">
              Digital Pins (D2–D13)
            </div>
            {AVAILABLE_PINS.map((pin) => {
              const available = isPinAvailable(pin);
              const isCurrent = pin === currentPin;
              
              return (
                <SelectItem 
                  key={pin} 
                  value={pin.toString()}
                  disabled={!available && !isCurrent}
                  className={`text-xs cursor-pointer ${
                    !available && !isCurrent 
                      ? 'text-muted-foreground/50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    D{pin}
                    {!available && !isCurrent && (
                      <span className="text-[9px] text-muted-foreground">(in use)</span>
                    )}
                    {isCurrent && (
                      <span className="text-[9px] text-primary">✓</span>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
