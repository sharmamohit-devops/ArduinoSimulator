import { LEDColor, LED_COLORS } from '@/types/simulator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LEDColorSelectorProps {
  currentColor: LEDColor;
  onColorChange: (color: LEDColor) => void;
}

export function LEDColorSelector({ currentColor, onColorChange }: LEDColorSelectorProps) {
  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
      <Select value={currentColor} onValueChange={(value) => onColorChange(value as LEDColor)}>
        <SelectTrigger className="h-6 w-20 text-xs bg-card/95 border-border backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: LED_COLORS[currentColor].hex }}
            />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {(Object.keys(LED_COLORS) as LEDColor[]).map((color) => (
            <SelectItem key={color} value={color} className="text-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                  style={{ 
                    backgroundColor: LED_COLORS[color].hex,
                    boxShadow: `0 0 6px ${LED_COLORS[color].glow}40`
                  }}
                />
                <span>{LED_COLORS[color].label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
