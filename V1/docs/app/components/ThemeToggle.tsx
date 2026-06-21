'use client';
import { useEffect, useState } from 'react';
import { IconSun, IconMoon, IconMonitor } from './icons';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'tema';

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    setTheme(saved);
    setMounted(true);
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const opts: { key: Theme; Icon: typeof IconSun; label: string }[] = [
    { key: 'light', Icon: IconSun, label: 'Claro' },
    { key: 'dark', Icon: IconMoon, label: 'Escuro' },
    { key: 'system', Icon: IconMonitor, label: 'Sistema' },
  ];

  return (
    <div
      role="group"
      aria-label="Tema"
      className="flex items-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5"
    >
      {opts.map(({ key, Icon, label }) => {
        const active = mounted && theme === key;
        return (
          <button
            key={key}
            onClick={() => choose(key)}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`flex h-7 flex-1 items-center justify-center rounded-md transition-colors ${
              active
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--fg-subtle)] hover:text-[var(--fg)]'
            }`}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
