import { ResistorValue, RESISTOR_VALUES } from '@/types/simulator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResistorValueSelectorProps {
  currentValue: ResistorValue;
  onValueChange: (value: ResistorValue) => void;
}

export function ResistorValueSelector({ currentValue, onValueChange }: ResistorValueSelectorProps) {
  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
      <Select value={currentValue} onValueChange={(value) => onValueChange(value as ResistorValue)}>
        <SelectTrigger className="h-6 w-20 text-xs bg-card/95 border-border backdrop-blur-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {(Object.keys(RESISTOR_VALUES) as ResistorValue[]).map((value) => (
            <SelectItem key={value} value={value} className="text-xs">
              <div className="flex items-center gap-2">
                {/* Mini color band preview */}
                <div className="flex gap-0.5">
                  {RESISTOR_VALUES[value].bands.slice(0, 3).map((color, i) => (
                    <span 
                      key={i}
                      className="w-1.5 h-3 rounded-[1px]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="font-mono">{RESISTOR_VALUES[value].label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
