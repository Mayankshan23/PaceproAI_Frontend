import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CustomSelect - Robust, 100% Accessible Mobile & Desktop Dropdown
 * 
 * Features:
 * - Uses semantic native select with luxury custom styling
 * - 100% guaranteed to work on iOS, Android, and Desktop without portal or event listener glitches
 * - Min-height 44px for touch-friendly tap targets
 * - Smooth hover & active focus rings
 */
export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  id,
  name
}) => {
  return (
    <div className={`custom-select-wrapper relative w-full ${className}`}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full min-h-[44px] pl-4 pr-10 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none appearance-none cursor-pointer select-none bg-[var(--bg-input)] text-[var(--text-primary)] border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-sky-500/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {placeholder && (
          <option value="" disabled className="text-slate-400 dark:text-zinc-500 bg-white dark:bg-[#141418]">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white dark:bg-[#18181e] text-slate-800 dark:text-zinc-100 py-2 text-sm"
          >
            {opt.label}
          </option>
        ))}
      </select>

      {/* Sleek Chevron Arrow */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={17} />
      </div>
    </div>
  );
};
