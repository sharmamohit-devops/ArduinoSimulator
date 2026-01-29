import { PlacedComponent } from '@/types/simulator';
import { useState, useEffect } from 'react';
import { Code, RotateCcw, Copy, Check } from 'lucide-react';

interface CodePanelProps {
  components: PlacedComponent[];
  isRunning: boolean;
}

const DEFAULT_CODE = `// Arduino Simulator - FOSSEE OSHW
// Write your own Arduino code here!

const int LED_PIN = 10;      // LED connected to D10
const int BUTTON_PIN = 2;    // Button connected to D2

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println("Arduino Ready!");
}

void loop() {
  // Read button state
  int buttonState = digitalRead(BUTTON_PIN);
  
  // Toggle LED based on button
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("LED ON");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  
  delay(50);  // Small delay for debouncing
}`;

function generateCodeFromComponents(components: PlacedComponent[]): string {
  const hasArduino = components.some(c => c.type === 'arduino-uno');
  const leds = components.filter(c => c.type === 'led');
  const buttons = components.filter(c => c.type === 'push-button');

  if (!hasArduino || (leds.length === 0 && buttons.length === 0)) {
    return DEFAULT_CODE;
  }

  const pinDefs: string[] = [];
  const setupLines: string[] = [];
  const loopLines: string[] = [];

  // LED definitions
  leds.forEach((led, index) => {
    const varName = leds.length === 1 ? 'LED_PIN' : `LED_PIN_${index + 1}`;
    pinDefs.push(`const int ${varName} = ${led.pin};`);
    setupLines.push(`  pinMode(${varName}, OUTPUT);`);
  });

  // Button definitions
  buttons.forEach((button, index) => {
    const varName = buttons.length === 1 ? 'BUTTON_PIN' : `BUTTON_PIN_${index + 1}`;
    pinDefs.push(`const int ${varName} = ${button.pin};`);
    setupLines.push(`  pinMode(${varName}, INPUT_PULLUP);`);
  });

  // Generate loop logic
  if (buttons.length > 0 && leds.length > 0) {
    const buttonVar = buttons.length === 1 ? 'BUTTON_PIN' : 'BUTTON_PIN_1';
    const ledVar = leds.length === 1 ? 'LED_PIN' : 'LED_PIN_1';
    
    loopLines.push(`  // Read button state (LOW = pressed with INPUT_PULLUP)`);
    loopLines.push(`  int buttonState = digitalRead(${buttonVar});`);
    loopLines.push(``);
    loopLines.push(`  // Toggle LED: Button pressed -> ON, Released -> OFF`);
    loopLines.push(`  if (buttonState == LOW) {`);
    loopLines.push(`    digitalWrite(${ledVar}, HIGH);  // LED ON`);
    loopLines.push(`  } else {`);
    loopLines.push(`    digitalWrite(${ledVar}, LOW);   // LED OFF`);
    loopLines.push(`  }`);
  } else if (leds.length > 0) {
    const ledVar = leds.length === 1 ? 'LED_PIN' : 'LED_PIN_1';
    loopLines.push(`  // Blink LED pattern`);
    loopLines.push(`  digitalWrite(${ledVar}, HIGH);`);
    loopLines.push(`  delay(500);`);
    loopLines.push(`  digitalWrite(${ledVar}, LOW);`);
    loopLines.push(`  delay(500);`);
  } else if (buttons.length > 0) {
    const buttonVar = buttons.length === 1 ? 'BUTTON_PIN' : 'BUTTON_PIN_1';
    setupLines.push(`  Serial.begin(9600);`);
    loopLines.push(`  int buttonState = digitalRead(${buttonVar});`);
    loopLines.push(`  if (buttonState == LOW) {`);
    loopLines.push(`    Serial.println("Button PRESSED");`);
    loopLines.push(`  }`);
    loopLines.push(`  delay(100);`);
  }

  return `// Arduino Simulator - Auto-Generated Code
// FOSSEE OSHW Internship
// Components: Arduino${leds.length > 0 ? `, ${leds.length} LED` : ''}${buttons.length > 0 ? `, ${buttons.length} Button` : ''}

${pinDefs.join('\n')}

void setup() {
${setupLines.join('\n') || '  // Configure pins here'}
}

void loop() {
${loopLines.join('\n') || '  // Main code here'}
}`;
}

export function CodePanel({ components, isRunning }: CodePanelProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update code when components change (only if not manually editing)
  useEffect(() => {
    if (!isEditing) {
      const generatedCode = generateCodeFromComponents(components);
      setCode(generatedCode);
    }
  }, [components, isEditing]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setIsEditing(true);
  };

  const handleReset = () => {
    const generatedCode = generateCodeFromComponents(components);
    setCode(generatedCode);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-code rounded-lg border border-border/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-xs font-medium text-foreground/80">sketch.ino</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {isRunning && (
            <span className="text-[10px] text-success flex items-center gap-1 bg-success/15 px-2 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              RUNNING
            </span>
          )}
          
          {isEditing && (
            <span className="text-[10px] text-warning bg-warning/15 px-2 py-0.5 rounded font-medium">
              MODIFIED
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to auto-generated code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 relative overflow-hidden">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/20 border-r border-border/15 overflow-hidden pointer-events-none">
          <div className="p-3 font-mono text-xs leading-relaxed text-muted-foreground/40">
            {code.split('\n').map((_, i) => (
              <div key={i} className="text-right pr-1.5">{i + 1}</div>
            ))}
          </div>
        </div>
        
        {/* Editor */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-full bg-transparent text-code-text font-mono text-xs resize-none outline-none p-3 pl-14 leading-relaxed"
          spellCheck={false}
          placeholder="Write your Arduino code here..."
        />
      </div>
      
      {/* Footer */}
      <div className="px-3 py-1.5 bg-muted/20 border-t border-border/15 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {isEditing ? '✏️ Custom' : '🔄 Auto-generated'}
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">
          {code.split('\n').length} lines
        </p>
      </div>
    </div>
  );
}
