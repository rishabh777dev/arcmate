import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle
 * Interactive toggle button with Sun / Moon icons.
 * Supports variants:
 * - 'icon': Compact round/squircle icon button (default, best for top headers)
 * - 'pill': Rounded pill badge with icon and label
 * - 'sidebar': Styled to match the sidebar action buttons
 */
export default function ThemeToggle({ 
  variant = 'icon', 
  className = '', 
  showLabel = false 
}) {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
          isDark
            ? 'bg-[#1e1c18]/80 hover:bg-[#1e1c18] text-[#c8c0a8] hover:text-[#f2ebd8] border border-[rgba(242,235,216,0.1)] hover:border-[#e9b94a]/50'
            : 'bg-[#f0ede4] hover:bg-[#e6e2d6] text-[#49443c] hover:text-[#14120e] border border-[rgba(20,18,14,0.1)] hover:border-[#e0533c]/50'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-[#e9b94a] transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#e0533c] transition-transform duration-300 rotate-0 hover:-rotate-12" />
          )}
        </div>
        <span className="font-sans text-[11px] font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-[11px] font-medium cursor-pointer select-none ${
          isDark
            ? 'bg-[#1e1c18]/80 hover:bg-[rgba(242,235,216,0.08)] text-[#c8c0a8] hover:text-[#f2ebd8] border border-[rgba(242,235,216,0.08)] hover:border-[#e9b94a]/40'
            : 'bg-[#ede9df] hover:bg-[#e4dfd3] text-[#49443c] hover:text-[#14120e] border border-[rgba(20,18,14,0.08)] hover:border-[#e0533c]/40'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-[#e9b94a] transition-transform duration-300 group-hover:rotate-45" />
            <span>Light Theme</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-[#e0533c] transition-transform duration-300 group-hover:-rotate-12" />
            <span>Dark Theme</span>
          </>
        )}
      </button>
    );
  }

  // Default: 'icon' button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer select-none group ${
        isDark
          ? 'bg-[#1e1c18]/80 hover:bg-[#25221d] text-[#c8c0a8] hover:text-[#f2ebd8] border border-[rgba(242,235,216,0.1)] hover:border-[#e9b94a]/50 shadow-sm'
          : 'bg-[#f0ede4] hover:bg-[#e6e2d6] text-[#49443c] hover:text-[#14120e] border border-[rgba(20,18,14,0.1)] hover:border-[#e0533c]/50 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#e9b94a] transition-all duration-300 group-hover:scale-110 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#e0533c] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
        )}
      </div>
      {showLabel && (
        <span className="ml-1.5 text-xs font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
