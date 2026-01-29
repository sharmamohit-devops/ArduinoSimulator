import { PlacedComponent } from '@/types/simulator';

interface CodePanelProps {
  components: PlacedComponent[];
  isRunning: boolean;
}

function generateArduinoCode(components: PlacedComponent[]): string {
  const hasArduino = components.some(c => c.type === 'arduino-uno');
  const leds = components.filter(c => c.type === 'led');
  const buttons = components.filter(c => c.type === 'push-button');

  if (components.length === 0) {
    return `// Arduino Simulator
// Add components to the canvas to generate code

void setup() {
  // Initialization code
}

void loop() {
  // Main program loop
}`;
  }

  let setupCode = '';
  let loopCode = '';
  let globalVars = '';

  // LED code generation
  leds.forEach((led, index) => {
    const pin = 13 - index;
    globalVars += `const int LED_PIN_${index + 1} = ${pin};\n`;
    setupCode += `  pinMode(LED_PIN_${index + 1}, OUTPUT);\n`;
    loopCode += `  digitalWrite(LED_PIN_${index + 1}, HIGH);\n  delay(500);\n  digitalWrite(LED_PIN_${index + 1}, LOW);\n  delay(500);\n`;
  });

  // Button code generation
  buttons.forEach((button, index) => {
    const pin = 2 + index;
    globalVars += `const int BUTTON_PIN_${index + 1} = ${pin};\n`;
    setupCode += `  pinMode(BUTTON_PIN_${index + 1}, INPUT_PULLUP);\n`;
    if (leds.length > 0) {
      loopCode = `  // Check button state\n  if (digitalRead(BUTTON_PIN_${index + 1}) == LOW) {\n    digitalWrite(LED_PIN_1, HIGH);\n  } else {\n    digitalWrite(LED_PIN_1, LOW);\n  }\n`;
    }
  });

  // If only Arduino, add basic blink code
  if (hasArduino && leds.length === 0 && buttons.length === 0) {
    globalVars = 'const int LED_BUILTIN_PIN = 13;\n';
    setupCode = '  pinMode(LED_BUILTIN_PIN, OUTPUT);\n  Serial.begin(9600);\n  Serial.println("Arduino Simulator Ready!");\n';
    loopCode = '  digitalWrite(LED_BUILTIN_PIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN_PIN, LOW);\n  delay(1000);\n';
  }

  return `// Auto-generated Arduino Code
// Components: ${hasArduino ? '1 Arduino Uno, ' : ''}${leds.length} LED(s), ${buttons.length} Button(s)

${globalVars}
void setup() {
${setupCode || '  // No components configured'}
}

void loop() {
${loopCode || '  // Add components to generate code'}
}`;
}

export function CodePanel({ components, isRunning }: CodePanelProps) {
  const code = generateArduinoCode(components);

  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    return code.split('\n').map((line, index) => {
      let highlighted = line;
      
      // Comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={index} className="syntax-comment">
            {line}
          </div>
        );
      }
      
      // Keywords
      const keywords = ['void', 'int', 'const', 'if', 'else', 'for', 'while', 'return', 'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP'];
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${kw}</span>`);
      });
      
      // Functions
      const functions = ['pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead', 'delay', 'Serial.begin', 'Serial.println', 'setup', 'loop'];
      functions.forEach(fn => {
        const regex = new RegExp(`\\b${fn}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="syntax-function">${fn}</span>`);
      });
      
      // Strings
      highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>');
      
      return (
        <div key={index} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-code rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-code border-b border-border/20">
        <span className="text-xs font-medium text-code-text/70 uppercase tracking-wide">
          sketch.ino
        </span>
        {isRunning && (
          <span className="text-xs text-success flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Running
          </span>
        )}
      </div>
      <pre className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-code-text">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}
