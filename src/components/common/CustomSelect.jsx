import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect - Accessible, mobile-optimized dropdown component
 * 
 * Features:
 * - Rendered via React Portal (document.body) to escape any parent `overflow-hidden` or clipping contexts
 * - High z-index (z-50 / z-[99999])
 * - Viewport bounds protection: max-w-[calc(100vw-2rem)] with automatic positioning & clamping
 * - Smooth scrollable options: max-h-60 overflow-y-auto
 * - Touch friendly touch targets: min-h-[44px] px-4 py-3 active:bg-sky-50
 * - Synchronizes directly with FastAPI Pydantic payload values
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
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Calculate coordinates for portal rendering whenever opened
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Desired dropdown width: matches trigger width or minimum 220px, but capped by viewport padding
    const maxAvailableWidth = viewportWidth - 32; // 16px padding on left and right
    const computedWidth = Math.min(Math.max(rect.width, 220), maxAvailableWidth);

    // Clamp horizontal position so popover never goes off-screen
    let left = rect.left;
    if (left + computedWidth > viewportWidth - 16) {
      left = viewportWidth - computedWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    // Determine whether to open downwards or upwards based on viewport space
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 240; // Max expected height

    let top = rect.bottom + 6;
    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      top = Math.max(16, rect.top - menuHeight - 6);
    }

    setMenuPosition({
      top: top + window.scrollY,
      left: left + window.scrollX,
      width: computedWidth
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`custom-select-container relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between gap-2 transition-all outline-none cursor-pointer select-none bg-[var(--bg-input)] text-[var(--text-primary)] ${
          isOpen
            ? 'border-sky-500 ring-2 ring-sky-100 dark:ring-sky-900/40 shadow-sm'
            : 'border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-sky-500/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`truncate font-medium ${!selectedOption ? 'text-slate-400 dark:text-zinc-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-500' : ''
          }`}
        />
      </button>

      {/* Portal Dropdown Menu */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
            }}
            className="z-[99999] max-w-[calc(100vw-2rem)] max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141418] shadow-2xl animate-fade-in py-1.5 focus:outline-none"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`min-h-[44px] px-4 py-3 flex items-center justify-between gap-3 text-sm cursor-pointer select-none transition-colors ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-sky-50 dark:active:bg-sky-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {opt.icon && <span className="shrink-0 text-base">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-sky-500 shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};
