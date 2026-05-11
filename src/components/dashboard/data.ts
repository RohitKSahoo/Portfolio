export const PROJECTS = [
  { 
    id: 'P_01', 
    name: 'PAUSIFY', 
    category: 'SYSTEMS',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'Automatically pauses and resumes media playback using real-time voice detection with sub-50ms latency.',
    details: ['Real-time voice detection', 'Audio focus handling', 'Silence-based resume logic'],
    architecture: 'State-machine driven audio control engine with low-latency signal processing and noise robustness.',
    metrics: { LATENCY: '<50ms', RELIABILITY: 'High', STABILITY: 'Fault-Tolerant' },
    stack: ['Kotlin'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Pausify',
    image: '/pausify_module_1775283678626.png',
    featured: true,
    whyItMatters: 'Designed to eliminate manual interruptions during conversations while listening to music.'
  },
  { 
    id: 'P_02', 
    name: 'SOSAFE', 
    category: 'COMMUNICATION',
    status: 'STABLE',
    ver: '1.2.0',
    primaryDescription: 'Enables seamless voice communication with automatic P2P to cloud failover and live tracking.',
    details: ['WebRTC Audio streaming (P2P)', 'Live location tracking (Firestore)', 'Cloud fallback (Cloudinary)'],
    architecture: 'Hybrid real-time communication system with dynamic failover between P2P and Cloud streaming.',
    metrics: { SYNC_LATENCY: '<1s', RELIABILITY: 'High', STABILITY: 'Multi-Channel' },
    stack: ['Kotlin', 'WebRTC'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/sosafe',
    image: '/sosafe_module_1775283699833.png',
    whyItMatters: 'Ensures continuous communication in low-bandwidth scenarios.'
  },
  { 
    id: 'P_03', 
    name: 'AUTOCOMMITBOT', 
    category: 'AUTOMATION',
    status: 'STABLE',
    ver: '1.1.0',
    primaryDescription: 'Automates Git version control entirely by writing commits driven by AI context analysis.',
    details: ['AI-generated commits (Gemini API)', 'Diff analysis via GitPython', 'Background Execution (Task)'],
    architecture: 'Autonomous CLI agent for context-aware version control with failsafe fallback execution.',
    metrics: { AUTOMATION: 'High', FAILOVER: 'Enabled', MODE: 'Background' },
    stack: ['Python', 'Gemini'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/auto-commit-bot',
    image: '/autocommit_module_1775283716495.png',
    featured: true,
    whyItMatters: 'Designed to eliminate manual commit overhead and guarantee semantic git histories.'
  },
  { 
    id: 'P_04', 
    name: 'SIFER', 
    category: 'SECURITY',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'A project on GitHub.',
    details: ['Project details here'],
    architecture: 'System architecture here.',
    metrics: { STATUS: 'Active' },
    stack: ['Python'], // Placeholder
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Sifer',
    image: '/monitor_module_ui_1775283735380.png', // Placeholder
    whyItMatters: 'Project importance here.'
  },
  { 
    id: 'P_05', 
    name: 'MINIMAL_TAB', 
    category: 'EXTENSION',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'A browser extension. (Forked with added features)',
    details: ['Forked project', 'Added custom features'],
    architecture: 'Extension architecture.',
    metrics: { STATUS: 'Forked' },
    stack: ['JavaScript'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Minimal_Tab',
    image: '/monitor_module_ui_1775283735380.png', // Placeholder
    whyItMatters: 'Customized for better productivity.'
  },
  { 
    id: 'P_06', 
    name: 'PORTFOLIO', 
    category: 'FRONTEND',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'This interactive portfolio website.',
    details: ['Interactive UI', 'Dashboard theme', 'Animated avatar'],
    architecture: 'React with Framer Motion and Tailwind CSS.',
    metrics: { STATUS: 'Active' },
    stack: ['TypeScript', 'React'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Portfolio',
    image: '/monitor_module_ui_1775283735380.png', // Placeholder
    whyItMatters: 'Showcases projects and skills in a premium, interactive way.'
  }
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
