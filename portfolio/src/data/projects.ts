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
  /** Optional pipeline stages, rendered as large stacked typography in
   *  the feature visual (e.g. Understand / Translate / Validate). */
  stages?: string[];
  /** Optional single emphasized line under the summary, rendered with
   *  the viewport-triggered highlight system. `|` separates phrases. */
  line?: string;
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
    slug: 'zest-tty',
    name: 'Zest-TTY',
    kind: 'Developer tooling · Transpiler',
    summary:
      'Source-to-Odin transpiler that converts supported code into validated Odin code.',
    detail:
      'Zest-TTY is deterministic — no AI layer. Supported source goes through a typed intermediate representation and expression passes, and the Odin emitter output goes through validation. The MVP covers a documented subset on purpose: unsupported constructs degrade honestly into warnings and TODO-style output instead of pretending to work.',
    points: [
      'Understand → Translate → Validate pipeline',
      'Line/parser processing into a typed intermediate representation',
      'Expression passes plus an Odin emitter and validation path',
      'Documented subset; honest TODO/warning degradation outside it',
      'Deterministic tests with a canonical test gate',
      'Cross-platform releases: Linux x86_64, macOS x86_64/ARM64, Windows x86_64',
      'Version stamping, SHA256 checksums, SBOMs and installers',
      'Deterministic by design — no AI layer',
    ],
    stack: ['Odin', 'CLI', 'Transpiler', 'Cross-platform'],
    featured: true,
    stages: ['Understand', 'Translate', 'Validate'],
    line: 'Source code becomes | something the target language | can validate.',
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
