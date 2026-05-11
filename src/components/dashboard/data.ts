export const PROJECTS = [
  { 
    id: 'P_01', 
    name: 'PAUSIFY', 
    category: 'SYSTEMS',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'An intelligent Android service that automatically manages media playback by detecting human speech in real-time using a hybrid Voice Activity Detection (VAD) engine.',
    details: [
      'Hybrid VAD Pipeline (WebRTC + Silero VAD)',
      'State-Machine Orchestration with SpeechStateMachine',
      'System-Level Audio Control via AudioManager',
      'Low-Latency Audio Processing with RingBuffer'
    ],
    architecture: 'Service-oriented architecture with VoiceMonitorService as orchestrator. Employs a producer-consumer pattern for real-time audio analysis with ONNX AI inference.',
    metrics: { AI: 'ONNX', LATENCY: 'Low', BACKGROUND: 'Full' },
    stack: ['Kotlin', 'ONNX Runtime', 'Silero VAD', 'WebRTC'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Pausify',
    images: ['/Pausify1.png', '/Pausify2.png', '/Pausify3.png'],
    featured: true,
    whyItMatters: 'Enhances hands-free productivity by using edge AI to automatically synchronize media playback with real-world interactions.'
  },
  { 
    id: 'P_02', 
    name: 'SOSAFE', 
    category: 'SECURITY',
    status: 'STABLE',
    ver: '1.2.0',
    primaryDescription: 'A mission-critical emergency response platform featuring a redundant real-time communication engine that synchronizes live location tracking with multi-mode audio streaming and automated guardian alerting.',
    details: [
      'Hybrid Audio Streaming (WebRTC + AAC chunking)',
      'Dynamic WebRTC Signaling via Firestore',
      'Persistent Foreground Architecture with WakeLocks',
      'Critical Alerting System bypassing DND'
    ],
    architecture: 'Reactive, role-based architecture (Sender/Guardian) built with Jetpack Compose and Kotlin Coroutines. Employs a centralized Firestore-as-a-Bus pattern for state synchronization.',
    metrics: { REDUNDANCY: 'Multi-Mode', LATENCY: 'Sub-Second', TRACKING: 'High-Avail' },
    stack: ['Kotlin', 'Jetpack Compose', 'WebRTC', 'Firebase'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/sosafe',
    images: ['/SoSafe1.png', '/SoSafe2.png', '/SoSafe3.png', '/SoSafe4.png'],
    whyItMatters: 'Bridges the reliability gap in personal safety technology by providing a redundant, forensic-ready architecture.'
  },
  { 
    id: 'P_03', 
    name: 'AUTOCOMMITBOT', 
    category: 'AUTOMATION',
    status: 'STABLE',
    ver: '1.1.0',
    primaryDescription: "An intelligent Git automation CLI that maintains a consistent contribution history using Google's Gemini AI for context-aware commit messages and the GitHub CLI for secure authentication.",
    details: [
      'AI-Powered Commit Generation with fallback chain',
      'Secure Tokenless Auth via GitHub CLI',
      'Secret Shield Detection for sensitive files',
      'Two-Stage Background Execution on Windows',
      'Simulated Developer Behavior (Natural Activity Mode)'
    ],
    architecture: 'Python-based CLI application orchestrating Git operations via subprocesses. Employs a two-stage background execution model with a silent network watcher and a minimized worker process via ShellExecuteW.',
    metrics: { BACKGROUND: 'Full', OFFLINE: 'Polling', API: 'Fallback' },
    stack: ['Python', 'GitHub CLI', 'Gemini API', 'Rich'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/auto-commit-bot',
    images: ['/autocommitbot.png'],
    featured: true,
    whyItMatters: 'Bridges the gap between consistent contribution tracking and meaningful code history without sacrificing commit quality or security.'
  },
  { 
    id: 'P_04', 
    name: 'SIFER', 
    category: 'AUTOMATION',
    status: 'STABLE',
    ver: '4.0.2',
    primaryDescription: 'An automated, location-aware Android utility that dynamically manages device audio profiles and "Do Not Disturb" states using high-precision geofencing.',
    details: [
      'Low-Power Geofencing with Google Play Services',
      'State-Aware Action Engine for overlapping zones',
      'Deep System Integration with AudioManager',
      'Privacy-Centric Mapping with OpenStreetMap'
    ],
    architecture: 'MVVM with an event-driven service layer. Persists zones via Room, delegates boundary detection to Android, and applies audio policies via ActionEngine.',
    metrics: { BATTERY: 'Optimized', OFFLINE: 'Full', LATENCY: 'Zero' },
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'Geofencing API'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Sifer',
    images: ['/Sifer1.png', '/Sifer2.png', '/Sifer3.png'],
    whyItMatters: 'Eliminates the cognitive load of manual sound management by bridging the gap between location awareness and system-level configuration.'
  },
  { 
    id: 'P_05', 
    name: 'MINIMAL NEW TAB', 
    category: 'EXTENSION',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'A high-performance Chrome extension that replaces the default new tab page with a customizable, privacy-focused productivity dashboard.',
    details: [
      'Dynamic backgrounds with real-time luminance analysis',
      'Integrated sidebar with Calendar, Todo, Pomodoro, and Notes',
      'Optimized asset management using IndexedDB'
    ],
    architecture: 'Manifest V3 Chrome Extension with zero server dependency. Utilizes DOM for UI, 2D Canvas for physics, and WebGL for fluid dynamics.',
    metrics: { OFFLINE: 'Full', RENDER: 'WebGL', MEDIA: 'Optimized' },
    stack: ['JavaScript', 'HTML5', 'CSS3', 'WebGL'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Minimal_Tab',
    images: ['/minimaltab1.png', '/minimaltab2.png'],
    whyItMatters: 'Provides a privacy-respecting, highly performant hub with sophisticated local media handling and dynamic UI adaptation.'
  },

];

export const experiences = [
  {
    role: 'Backend Systems Developer',
    period: '2023 - PRESENT',
    company: 'PROJECT-BASED',
    tags: ['BACKEND', 'SYSTEMS'],
    logs: [
      'Built voice-triggered audio control system with sub-50ms response time.',
      'Implemented real-time monitoring with efficient background thread handling.',
      'Optimized system lifecycle to auto-suspend idle services.'
    ],
    active: true
  },
  {
    role: 'App Developer (Personal)',
    period: '2022 - 2023',
    company: 'COMMUNICATION PROJECTS',
    tags: ['ANDROID', 'WEBRTC'],
    logs: [
      'Developed continuous P2P voice network with dynamic cloud fallback routing.',
      'Synchronized live geolocation tracking across highly constrained network states.'
    ]
  },
  {
    role: 'Open Source Contributor',
    period: '2021 - 2022',
    company: 'AUTOMATION PROJECTS',
    tags: ['PYTHON', 'AI'],
    logs: [
      'Authored autonomous CLI agent validating and generating git commits via AI context analysis.',
      'Formulated secure CI/CD deployment routines using robust git-hook automation.'
    ]
  }
];
