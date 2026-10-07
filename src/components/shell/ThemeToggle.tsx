import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLight =
      document.documentElement.classList.contains('light') ||
      (!document.documentElement.classList.contains('dark') &&
        typeof localStorage !== 'undefined' &&
        localStorage.getItem('theme') === 'light');
    setTheme(isLight ? 'light' : 'dark');

    const handleThemeChange = () => {
      const currentIsLight = document.documentElement.classList.contains('light');
      setTheme(currentIsLight ? 'light' : 'dark');
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
    }
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900/50 ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all active:scale-95 shadow-xs cursor-pointer ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-orange-400 hover:text-orange-300 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700 hover:text-orange-500 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
