import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.css';

/**
 * CustomSelect - Luxury Theme-Adaptive Custom Dropdown
 * 
 * Avoids browser OS default select styling issues.
 * Provides custom dark/light glassmorphic menu with check indicators,
 * smooth animations, and click-outside closure.
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
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange && onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      className={`custom-select-container ${className}`} 
      ref={containerRef}
      id={id ? `select-wrapper-${id}` : undefined}
    >
      {/* Hidden Native Select for Form Compatibility & Accessibility */}
      <input type="hidden" name={name} value={value || ''} />

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="custom-select-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDown 
          size={16} 
          className={`custom-select-chevron ${isOpen ? 'open' : ''}`} 
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} strokeWidth={2.5} className="custom-select-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
