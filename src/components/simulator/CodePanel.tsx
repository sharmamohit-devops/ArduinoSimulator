import { PlacedComponent } from '@/types/simulator';

interface CodePanelProps {
  components: PlacedComponent[];
  isRunning: boolean;
}

function generateArduinoCode(components: PlacedComponent[]): string {
  const hasArduino = components.some(c => c.type === 'arduino-uno');
  const leds = components.filter(c => c.type === 'led');
  const buttons = components.filter(c => c.type === 'push-button');

  if (components.length === 0 || !hasArduino) {
    return `// Arduino Simulator - FOSSEE OSHW
// Add an Arduino Uno and components to generate code

void setup() {
  // Initialization code
}

void loop() {
  // Main program loop
}`;
  }

  // Build pin definitions
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

  // Generate loop logic based on components
  if (buttons.length > 0 && leds.length > 0) {
    // Button controls LED
    const buttonVar = buttons.length === 1 ? 'BUTTON_PIN' : 'BUTTON_PIN_1';
    const ledVar = leds.length === 1 ? 'LED_PIN' : 'LED_PIN_1';
    
    loopLines.push(`  // Read button state (LOW when pressed due to INPUT_PULLUP)`);
    loopLines.push(`  int buttonState = digitalRead(${buttonVar});`);
    loopLines.push(``);
    loopLines.push(`  // Button pressed -> LED ON, Button released -> LED OFF`);
    loopLines.push(`  if (buttonState == LOW) {`);
    loopLines.push(`    digitalWrite(${ledVar}, HIGH);  // LED ON`);
    loopLines.push(`  } else {`);
    loopLines.push(`    digitalWrite(${ledVar}, LOW);   // LED OFF`);
    loopLines.push(`  }`);
  } else if (leds.length > 0) {
    // Just LEDs - blink pattern
    const ledVar = leds.length === 1 ? 'LED_PIN' : 'LED_PIN_1';
    loopLines.push(`  // Blink LED`);
    loopLines.push(`  digitalWrite(${ledVar}, HIGH);`);
    loopLines.push(`  delay(500);`);
    loopLines.push(`  digitalWrite(${ledVar}, LOW);`);
    loopLines.push(`  delay(500);`);
  } else if (buttons.length > 0) {
    // Just buttons - read and print
    const buttonVar = buttons.length === 1 ? 'BUTTON_PIN' : 'BUTTON_PIN_1';
    setupLines.push(`  Serial.begin(9600);`);
    loopLines.push(`  // Read and print button state`);
    loopLines.push(`  int buttonState = digitalRead(${buttonVar});`);
    loopLines.push(`  if (buttonState == LOW) {`);
    loopLines.push(`    Serial.println("Button PRESSED");`);
    loopLines.push(`  }`);
    loopLines.push(`  delay(100);  // Debounce`);
  } else {
    // Just Arduino
    loopLines.push(`  // Add LED and Button components`);
    loopLines.push(`  // to generate interactive code`);
  }

  return `// Arduino Simulator - Auto-Generated Code
// FOSSEE OSHW Internship Task
// Components: Arduino Uno${leds.length > 0 ? `, ${leds.length} LED(s)` : ''}${buttons.length > 0 ? `, ${buttons.length} Button(s)` : ''}

${pinDefs.join('\n')}

void setup() {
${setupLines.join('\n') || '  // No components configured'}
}

void loop() {
${loopLines.join('\n') || '  // Add components to generate code'}
}`;
}

export function CodePanel({ components, isRunning }: CodePanelProps) {
  const code = generateArduinoCode(components);

  // Enhanced syntax highlighting
  const highlightCode = (code: string) => {
    return code.split('\n').map((line, index) => {
      // Comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={index} className="syntax-comment">
            {line}
          </div>
        );
      }
      
      let highlighted = line;
      
      // Keywords
      const keywords = ['void', 'int', 'const', 'if', 'else', 'for', 'while', 'return', 'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP'];
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${kw}</span>`);
      });
      
      // Functions
      const functions = ['pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead', 'delay', 'Serial.begin', 'Serial.println', 'setup', 'loop'];
      functions.forEach(fn => {
        const regex = new RegExp(`\\b${fn.replace('.', '\\.')}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="syntax-function">${fn}</span>`);
      });
      
      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
      
      // Strings
      highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>');
      
      return (
        <div key={index} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-code rounded-lg overflow-hidden border border-border/30">
      <div className="flex items-center justify-between px-4 py-2 bg-code border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <span className="text-xs font-medium text-code-text/70 ml-2">
            sketch.ino
          </span>
        </div>
        {isRunning && (
          <span className="text-xs text-success flex items-center gap-1.5 bg-success/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Running
          </span>
        )}
      </div>
      <pre className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-code-text font-mono">
        <code className="block">{highlightCode(code)}</code>
      </pre>
      <div className="px-4 py-2 bg-code border-t border-border/20">
        <p className="text-xs text-code-text/50">
          Read-only • Code updates automatically with pin changes
        </p>
      </div>
    </div>
  );
}
