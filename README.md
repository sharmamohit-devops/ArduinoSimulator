# Web-Based Arduino Simulator ⚡

A browser-based Arduino simulator developed as part of my **application and work for the FOSSEE Semester-Long Internship** under the **Open Source Hardware (OSHW) project**, IIT Bombay.

The simulator allows users to visually build simple Arduino circuits, automatically manage pin connections, generate Arduino C/C++ code, and observe logic-level simulation — all without physical hardware.

---

## 🚀 What is this project?

This project is built to make **learning embedded systems more intuitive and accessible**.

Instead of starting with physical wiring, hardware availability, and debugging issues, users can focus on understanding:
- how Arduino pins are assigned,
- how circuit connections translate into embedded code,
- and how digital input-output logic behaves in real time.

The simulator acts as a **visual and logical bridge** between circuit design and Arduino programming.

---

## 🌐 Live Simulator

Access the deployed simulator here:

👉 **https://mohit-fossee.vercel.app/**

The simulator runs entirely in the browser and does not require any installation or hardware setup.

---

## ✨ Key Features

- 🧩 Drag-and-drop interface for circuit construction  
- 🔌 Visual Arduino Uno with realistic-looking components  
- 🔄 Automatic digital pin assignment  
- 🚫 Conflict-free pin reassignment  
- 🧠 Auto-generated Arduino C/C++ code  
- 💡 Logic-level simulation (Button → LED behavior)  
- ⚙️ Real-time visual feedback during simulation  

---

## 🏗️ System Architecture Overview

The simulator follows a **modular and layered architecture**, consisting of:

- **User Interface Layer**  
  Manages component visuals, drag-and-drop actions, pin selection, and simulation controls.

- **State Management Layer**  
  Maintains a centralized system state including components, pin assignments, and logic values.

- **Code Generation Module**  
  Dynamically generates valid Arduino C/C++ code based on the current circuit configuration.

- **Logic-Level Simulation Engine**  
  Simulates digital input-output behavior using HIGH / LOW logic abstraction.

This architecture ensures clarity, maintainability, and scope for future extension.

---

## 🔧 Supported Components

Currently supported components include:

- Arduino Uno  
- LED  
- Push Button  

> The simulator focuses on digital logic learning and does not model analog or timing-level behavior.

---

## 🧪 How It Works

1. Place the Arduino and components on the workspace  
2. Digital pins are assigned automatically  
3. Reassign pins if required (conflict-free)  
4. Arduino C/C++ code is generated dynamically  
5. Run the simulation and interact with the circuit  

Each step helps users understand how **hardware configuration affects embedded software behavior**.

---

## ⚠️ Current Limitations

- Logic-level simulation only  
- Limited component library  
- No project saving or direct code export  
- No analog or timing-accurate simulation  

These limitations are intentional to keep the simulator simple and beginner-friendly.

---

## 🔮 Future Improvements

- Support for additional sensors and actuators  
- Serial monitor simulation  
- PWM and timing-based behavior  
- Project saving and sharing features  
- Expanded educational components  

---

## 🎯 Purpose

This simulator is intended for **educational and demonstration purposes**, particularly for:
- students learning Arduino and embedded systems,
- beginners exploring digital I/O concepts,
- classroom and self-learning environments.

---

## 🙏 Acknowledgements

This project was **designed and developed by me as part of my application and work for the FOSSEE Semester-Long Internship** under the **Open Source Hardware (OSHW) project**, IIT Bombay. The simulator was built to demonstrate my understanding of embedded systems concepts, system architecture, and the design of educational simulation tools.

I would like to thank the **FOSSEE team, IIT Bombay**, for providing an opportunity to apply under the OSHW initiative, which motivated the development of this project. The internship problem statement helped shape the scope and objectives of the simulator.

I am also grateful to my faculty members and peers for their feedback and discussions, which contributed to improving the clarity, usability, and overall quality of the project.

---




