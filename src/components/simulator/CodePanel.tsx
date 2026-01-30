import { PlacedComponent } from '@/types/simulator';
import { useState, useEffect, useMemo } from 'react';
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

// VS Code Dark+ theme colors
const VSCODE_COLORS = {
  keyword: '#C586C0',      // Pink/purple for keywords
  type: '#4EC9B0',         // Teal for types
  function: '#DCDCAA',     // Yellow for functions
  variable: '#9CDCFE',     // Light blue for variables
  string: '#CE9178',       // Orange for strings
  number: '#B5CEA8',       // Light green for numbers
  comment: '#6A9955',      // Green for comments
  operator: '#D4D4D4',     // Light gray for operators
  bracket: '#FFD700',      // Gold for brackets
  constant: '#4FC1FF',     // Bright blue for constants
  macro: '#569CD6',        // Blue for preprocessor
};

// Syntax highlighting function
function highlightCode(code: string): JSX.Element[] {
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    const tokens: JSX.Element[] = [];
    let remaining = line;
    let tokenIndex = 0;

    // Helper to add token
    const addToken = (text: string, color: string, bold = false) => {
      tokens.push(
        <span 
          key={tokenIndex++} 
          style={{ color, fontWeight: bold ? 600 : 400 }}
        >
          {text}
        </span>
      );
    };

    // Process the line
    while (remaining.length > 0) {
      let matched = false;

      // Comments (// ...)
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        addToken(commentMatch[1], VSCODE_COLORS.comment);
        remaining = remaining.slice(commentMatch[1].length);
        matched = true;
        continue;
      }

      // Preprocessor directives (#include, #define)
      const macroMatch = remaining.match(/^(#\w+)/);
      if (macroMatch) {
        addToken(macroMatch[1], VSCODE_COLORS.macro, true);
        remaining = remaining.slice(macroMatch[1].length);
        matched = true;
        continue;
      }

      // Strings ("...")
      const stringMatch = remaining.match(/^("[^"]*")/);
      if (stringMatch) {
        addToken(stringMatch[1], VSCODE_COLORS.string);
        remaining = remaining.slice(stringMatch[1].length);
        matched = true;
        continue;
      }

      // Keywords
      const keywordMatch = remaining.match(/^(void|int|const|if|else|while|for|return|break|continue|switch|case|default)\b/);
      if (keywordMatch) {
        addToken(keywordMatch[1], VSCODE_COLORS.keyword, true);
        remaining = remaining.slice(keywordMatch[1].length);
        matched = true;
        continue;
      }

      // Arduino types
      const typeMatch = remaining.match(/^(boolean|byte|char|double|float|long|short|unsigned|String)\b/);
      if (typeMatch) {
        addToken(typeMatch[1], VSCODE_COLORS.type);
        remaining = remaining.slice(typeMatch[1].length);
        matched = true;
        continue;
      }

      // Arduino constants
      const constantMatch = remaining.match(/^(HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|true|false|LED_BUILTIN)\b/);
      if (constantMatch) {
        addToken(constantMatch[1], VSCODE_COLORS.constant, true);
        remaining = remaining.slice(constantMatch[1].length);
        matched = true;
        continue;
      }

      // User-defined constants (UPPERCASE with underscore)
      const userConstMatch = remaining.match(/^([A-Z][A-Z0-9_]*)\b/);
      if (userConstMatch) {
        addToken(userConstMatch[1], VSCODE_COLORS.constant);
        remaining = remaining.slice(userConstMatch[1].length);
        matched = true;
        continue;
      }

      // Arduino functions
      const funcMatch = remaining.match(/^(pinMode|digitalWrite|digitalRead|analogWrite|analogRead|Serial|delay|millis|micros|begin|println|print|setup|loop)\b/);
      if (funcMatch) {
        addToken(funcMatch[1], VSCODE_COLORS.function);
        remaining = remaining.slice(funcMatch[1].length);
        matched = true;
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^(\d+)/);
      if (numMatch) {
        addToken(numMatch[1], VSCODE_COLORS.number);
        remaining = remaining.slice(numMatch[1].length);
        matched = true;
        continue;
      }

      // Brackets and parentheses
      const bracketMatch = remaining.match(/^([{}[\]()])/);
      if (bracketMatch) {
        addToken(bracketMatch[1], VSCODE_COLORS.bracket);
        remaining = remaining.slice(1);
        matched = true;
        continue;
      }

      // Operators
      const opMatch = remaining.match(/^([+\-*/%=<>!&|;,.])/);
      if (opMatch) {
        addToken(opMatch[1], VSCODE_COLORS.operator);
        remaining = remaining.slice(1);
        matched = true;
        continue;
      }

      // Variables (camelCase or lowercase)
      const varMatch = remaining.match(/^([a-z][a-zA-Z0-9]*)\b/);
      if (varMatch) {
        addToken(varMatch[1], VSCODE_COLORS.variable);
        remaining = remaining.slice(varMatch[1].length);
        matched = true;
        continue;
      }

      // Default: single character
      if (!matched) {
        addToken(remaining[0], '#D4D4D4');
        remaining = remaining.slice(1);
      }
    }

    return (
      <div key={lineIndex} className="leading-6">
        {tokens.length > 0 ? tokens : <span>&nbsp;</span>}
      </div>
    );
  });
}

export function CodePanel({ components, isRunning }: CodePanelProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHighlight, setShowHighlight] = useState(true);

  // Update code when components change (only if not manually editing)
  useEffect(() => {
    if (!isEditing) {
      const generatedCode = generateCodeFromComponents(components);
      setCode(generatedCode);
    }
  }, [components, isEditing]);

  const highlightedCode = useMemo(() => highlightCode(code), [code]);

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

  const lineNumbers = code.split('\n').length;

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-lg border border-border/50" style={{ background: '#1E1E1E' }}>
      {/* VS Code style header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#252526', borderBottom: '1px solid #3C3C3C' }}>
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 cursor-pointer" />
          </div>
          {/* File tab */}
          <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ background: '#1E1E1E' }}>
            <Code className="w-4 h-4" style={{ color: '#519ABA' }} />
            <span className="text-sm font-medium" style={{ color: '#CCCCCC' }}>sketch.ino</span>
            {isEditing && <span className="w-2 h-2 rounded-full bg-white/60" />}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: '#2D4F2D', color: '#4EC9B0' }}>
              <span className="w-2 h-2 rounded-full bg-[#4EC9B0] animate-pulse" />
              RUNNING
            </span>
          )}
          
          {isEditing && (
            <span className="text-xs px-2.5 py-1 rounded" style={{ background: '#4D3D00', color: '#CCA700' }}>
              MODIFIED
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: '#CCCCCC' }}
            title="Reset to auto-generated code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: '#CCCCCC' }}
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" style={{ color: '#4EC9B0' }} /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Code Editor with syntax highlighting */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#1E1E1E' }}>
        {/* Line numbers */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-12 overflow-hidden pointer-events-none select-none"
          style={{ background: '#1E1E1E', borderRight: '1px solid #3C3C3C' }}
        >
          <div className="p-3 font-mono text-xs text-right pr-3" style={{ color: '#858585' }}>
            {Array.from({ length: lineNumbers }, (_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
        </div>
        
        {/* Syntax highlighted overlay */}
        <div 
          className="absolute left-12 top-0 right-0 bottom-0 p-3 font-mono text-sm overflow-auto pointer-events-none"
          style={{ 
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
            color: '#D4D4D4',
          }}
        >
          {showHighlight && highlightedCode}
        </div>
        
        {/* Actual textarea for editing */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          onFocus={() => setShowHighlight(true)}
          className="absolute left-12 top-0 right-0 bottom-0 w-[calc(100%-3rem)] h-full bg-transparent font-mono text-sm resize-none outline-none p-3 leading-6"
          style={{ 
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
            color: 'transparent',
            caretColor: '#AEAFAD',
          }}
          spellCheck={false}
          placeholder="Write your Arduino code here..."
        />
      </div>
      
      {/* VS Code style footer */}
      <div 
        className="px-4 py-1.5 flex items-center justify-between text-xs"
        style={{ background: '#007ACC', color: 'white' }}
      >
        <div className="flex items-center gap-4">
          <span>{isEditing ? '✏️ Editing' : '⚡ Auto-generated'}</span>
          <span>Arduino C++</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {lineNumbers}, Col 1</span>
          <span>UTF-8</span>
          <span>CRLF</span>
        </div>
      </div>
    </div>
  );
}
