# Web-Based Arduino Simulator ⚡

A **browser-based Arduino simulator** developed as part of my **application and work for the FOSSEE Semester-Long Internship** under the **Open Source Hardware (OSHW) project**, IIT Bombay.

The simulator enables users to visually design simple Arduino circuits, automatically manage digital pin assignments, generate Arduino C/C++ code in real time, and interact with logic-level simulations — all without requiring physical hardware.

---

## 🚀 About the Project

This project aims to make **learning embedded systems simpler, clearer, and more accessible**, especially for beginners.

Instead of dealing with physical wiring, component availability, and hardware debugging, users can focus on understanding:
- how digital pins are assigned and managed,
- how circuit connections translate into embedded firmware,
- and how basic digital input-output logic behaves.

The simulator serves as a **visual and logical bridge** between circuit design and Arduino programming, helping learners connect theory with practice.

---

## 🌐 Live Simulator

Access the deployed simulator here:

👉 [https://arduinosimulator.vercel.app/](https://arduinosimulator.vercel.app/)

The simulator runs entirely in the browser and does not require installation, external libraries, or physical Arduino hardware.

---

## ✨ Key Features

- 🧩 Intuitive drag-and-drop interface for circuit construction  
- 🔌 Visual Arduino Uno with realistic-looking components  
- 🔄 Automatic digital pin assignment with safe defaults  
- 🚫 Conflict-free pin reassignment using dropdown menus  
- 🧠 Automatic generation of Arduino C/C++ source code  
- 💡 Logic-level simulation (Push Button → LED behavior)  
- ⚙️ Immediate visual feedback during simulation  

---

## 🏗️ System Architecture Overview

The simulator is built using a **modular and layered architecture**, designed for clarity and extensibility:

- **User Interface Layer**  
  Handles component visualization, drag-and-drop interaction, pin selection, and simulation controls.

- **State Management Layer**  
  Maintains a centralized system state containing component data, pin assignments, and logic states.

- **Code Generation Module**  
  Dynamically generates valid Arduino C/C++ code based on the current circuit configuration.

- **Logic-Level Simulation Engine**  
  Evaluates digital input-output behavior using HIGH / LOW logic abstraction.

This separation of concerns ensures maintainability and allows future features to be added without major redesign.

---

## 🔧 Supported Components

The current implementation supports:

- Arduino Uno  
- LED  
- Push Button  

> The simulator focuses on **digital logic learning** and does not model analog signals, electrical parameters, or timing-accurate behavior.

---

## 🧪 How It Works

1. Place the Arduino board and components on the workspace  
2. Digital pins are assigned automatically using predefined defaults  
3. Reassign pins if required (with conflict prevention)  
4. Arduino C/C++ code is generated dynamically  
5. Start the simulation and interact with the circuit  

Each step helps users understand how **hardware configuration directly influences embedded software behavior**.

---

## ⚠️ Current Limitations

- Simulation is limited to logic-level behavior  
- Component library is intentionally minimal  
- Project saving and direct code export are not supported  
- No analog or timing-accurate simulation  

These limitations are intentional to keep the simulator **simple, focused, and beginner-friendly**.

---

## 🔮 Future Improvements

- Support for additional sensors and actuators  
- Serial monitor simulation  
- PWM and basic timing-based behavior  
- Project saving and sharing functionality  
- Expanded features for educational use  

---

## 🎯 Intended Use

This simulator is intended for **educational and demonstration purposes**, particularly for:
- students learning Arduino and embedded systems,
- beginners exploring digital input-output concepts,
- classroom teaching and self-learning environments.

---

## 🙏 Acknowledgements

This project was **designed and developed by me as part of my application and work for the FOSSEE Semester-Long Internship** under the **Open Source Hardware (OSHW) project**, IIT Bombay. The simulator was created to demonstrate practical understanding of embedded systems concepts, system architecture, and the design of educational simulation tools.

I would like to thank the **FOSSEE team, IIT Bombay**, for providing the opportunity to apply under the OSHW initiative, which motivated the development of this project. I am also grateful to my faculty members and peers for their feedback and discussions, which helped improve the clarity, usability, and overall quality of the simulator.

---

