import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none border ${
        isDark
          ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300'
          : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-indigo-600 shadow-sm'
      } ${className}`}
      title={isDark ? 'Mudar para Modo Claro (Apple Ceramic)' : 'Mudar para Modo Escuro (Space Black)'}
      aria-label="Alternar tema claro e escuro"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 transition-transform duration-300 rotate-0 text-amber-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 transition-transform duration-300 rotate-90 text-amber-500" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-medium pr-1 text-[#1d1d1f] dark:text-[#f5f5f7]">
          {isDark ? 'Escuro' : 'Claro'}
        </span>
      )}
    </button>
  );
};
