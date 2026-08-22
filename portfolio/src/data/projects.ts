export type FlowStep = { label: string; branch?: boolean };

export type Project = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  detail: string;
  points: string[];
  stack: string[];
  href?: string;
  featured?: boolean;
  /** Optional linear/branching request flow, rendered as a small diagram
   *  in the project detail panel. Steps in the same array index render
   *  side by side as a branch (e.g. two providers off one router). */
  flow?: FlowStep[][];
};

export const projects: Project[] = [
  {
    slug: 'blink',
    name: 'Blink',
    kind: 'Desktop AI assistant',
    summary:
      'A local-first AI assistant focused on speed, privacy and flexibility.',
    detail:
      "Blink runs on your machine, not someone else's server. It talks to multiple AI providers, keeps chat history encrypted in SQLite, and is moving from Electron to Tauri for a lighter footprint and faster startup.",
    points: [
      'Multiple AI providers, including OpenRouter',
      'Optional local inference through Ollama',
      'Desktop automation',
      'Local storage with encryption',
      'SQLite for structured, queryable history',
      'Electron → Tauri migration in progress',
      'Connectors and plugins planned',
    ],
    stack: ['Tauri', 'Rust', 'TypeScript', 'SQLite'],
    href: 'https://github.com/WarquahF',
    featured: true,
    flow: [
      [{ label: 'Your prompt' }],
      [{ label: 'Provider router (Rust)' }],
      [{ label: 'OpenRouter', branch: true }, { label: 'Ollama (local)', branch: true }],
      [{ label: 'Response' }],
      [{ label: 'Encrypted SQLite log' }],
    ],
  },
  {
    slug: 'nugget',
    name: 'Nugget',
    kind: 'Desktop AI assistant',
    summary:
      'A desktop AI assistant built with Electron, AI services and voice interaction.',
    detail:
      'Nugget was the proving ground before Blink — a focused, lightweight client wrapping AI services and voice interaction in a single desktop app.',
    points: ['Electron shell', 'Voice interaction', 'AI service integration'],
    stack: ['Electron', 'AI', 'Voice'],
    href: 'https://github.com/WarquahF',
  },
];

export const archive: { name: string; note: string }[] = [
  { name: 'QuickBlink', note: 'Shipped' },
];
