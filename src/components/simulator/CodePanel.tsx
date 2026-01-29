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
    <div className="h-full flex flex-col code-panel border border-border/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[hsl(220,30%,8%)] to-[hsl(220,25%,10%)] border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-warning/80 hover:bg-warning cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-success/80 hover:bg-success cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">sketch.ino</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-xs text-success flex items-center gap-1.5 bg-success/20 px-2 py-1 rounded-full font-medium">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              RUNNING
            </span>
          )}
          
          {isEditing && (
            <span className="text-xs text-warning bg-warning/20 px-2 py-1 rounded-full font-medium">
              MODIFIED
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to auto-generated code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 relative overflow-hidden">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[hsl(220,30%,5%)] border-r border-border/20 overflow-hidden pointer-events-none">
          <div className="p-4 font-mono text-sm leading-relaxed text-muted-foreground/50">
            {code.split('\n').map((_, i) => (
              <div key={i} className="text-right pr-2">{i + 1}</div>
            ))}
          </div>
        </div>
        
        {/* Editor */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="code-editor pl-16 w-full h-full"
          spellCheck={false}
          placeholder="Write your Arduino code here..."
        />
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-[hsl(220,30%,6%)] border-t border-border/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isEditing ? '✏️ Custom code • ' : '🔄 Auto-generated • '}
          Click to edit
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          {code.split('\n').length} lines
        </p>
      </div>
    </div>
  );
}
