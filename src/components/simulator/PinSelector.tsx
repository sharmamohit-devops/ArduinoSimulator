import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DigitalPin, getAvailablePins } from '@/types/simulator';

interface PinSelectorProps {
  currentPin: DigitalPin;
  usedPins: Map<DigitalPin, string>;
  instanceId: string;
  componentType: 'led' | 'push-button';
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
  const availablePins = getAvailablePins(usedPins, instanceId);
  const label = componentType === 'led' ? 'LED' : 'BTN';
  const color = componentType === 'led' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div 
      className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 bg-card border border-border rounded-md shadow-lg px-2 py-1">
        <span className={`text-[10px] font-bold text-white ${color} px-1.5 py-0.5 rounded`}>
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
          <SelectContent className="bg-popover border border-border shadow-xl z-50">
            {availablePins.map((pin) => (
              <SelectItem 
                key={pin} 
                value={pin.toString()}
                className="text-xs cursor-pointer"
              >
                D{pin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
