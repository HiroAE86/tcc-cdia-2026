// SVG icons (Lucide-style, stroke 1.75). No emoji as structural icons.
type P = { className?: string; size?: number };
const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconHome = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 9.5 12 3l9 6.5" />
    <path d="M5 9v11h14V9" />
  </svg>
);

export const IconPresent = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M12 16v4M8 20h8" />
    <path d="m10 8 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCards = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="6" width="13" height="14" rx="2" />
    <path d="M8 6V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-1" />
  </svg>
);

export const IconDoc = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export const IconSearch = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconArrowLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const IconArrowRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const IconShuffle = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

export const IconCheck = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconX = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconPlay = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m7 4 13 8-13 8z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSun = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const IconMoon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const IconMonitor = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
