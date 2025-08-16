# Vulnerability Playground

An interactive, educational web application demonstrating common web security vulnerabilities and their mitigations. This app empowers users to experiment with simulated attacks, understand their impact, and learn how to defend their applications through practical examples.

---

## Overview

Vulnerability Playground is built with a React frontend and an Express backend. Users can input data and see how it is handled both *insecurely* (vulnerable) and *securely* (protected), showcasing a variety of common attacks such as XSS, SQL Injection, CSRF, and more. The app emphasizes real-time feedback, gamified challenges, and rich educational content to raise awareness of web security best practices.

---

## Features

- **Multiple Attack Simulations:**  
  - Cross-Site Scripting (XSS)  
  - SQL & NoSQL Injection (simulated)  
  - Cross-Site Request Forgery (CSRF)  
  - Broken Authentication  
  - Insecure Deserialization  
  - Directory Traversal/Path Manipulation  
  - Insecure Direct Object Reference (IDOR)  
  - Unsafe File Uploads  
  - Social Engineering / Phishing simulation (mock scenarios)

- **Insecure vs Secure Modes:**  
  Toggle between vulnerable and protected input handling to see attacks in action and their mitigation.

- **Instant Visual Feedback:**  
  Alerts, warnings, and security health indicators help users recognize risks and safe states immediately.

- **Gamification:**  
  - Hacker Challenge mode encourages users to try breaking the app and then apply fixes.  
  - Security score, badges, and progress tracking.  
  - Knowledge quizzes and threat-spotting mini-games.

- **Interactive Tutorials & Explanations:**  
  Guided lessons with detailed attack descriptions, impact analysis, and mitigation techniques.

- **Data Flow Visualizations:**  
  Animated or graphic representations of how data moves through the app and where vulnerabilities exist or get blocked.

- **Personalized Learning:**  
  Progress tracking with personalized tips and challenge suggestions.

- **Community & Support:**  
  Built-in feedback system and optional discussion forum or Q&A platform.

---

## Tech Stack

- **Frontend:** React, with libraries for sanitization (e.g., DOMPurify), form validation, and interactive visualizations  
- **Backend:** Express.js with middleware for input validation, sanitization (e.g., express-validator), and simulated database behavior  
- **Security:** Clear separation of insecure and secure code paths for educational contrast  
- **Styling:** Modern CSS frameworks or component libraries for an engaging UI
