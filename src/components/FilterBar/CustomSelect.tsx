import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  className?: string;
}

/** Accessible animated dropdown — a self-contained reusable select primitive. */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  icon,
  value,
  onChange,
  options,
  ariaLabel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const isSelected = Boolean(value && value !== options[0]?.value);

  // Close the dropdown when the user clicks anywhere outside the component.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Support Escape to close and Enter/Space to open for keyboard navigation.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', isOpen ? 'z-50' : 'z-10', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn(
          'w-full h-9 px-3 bg-white border rounded-lg text-xs font-semibold flex items-center justify-between gap-2.5 transition-all shadow-2xs cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
            : isSelected
            ? 'border-indigo-200 bg-indigo-50/40 text-indigo-950 hover:border-indigo-300'
            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
        )}
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className={cn('shrink-0', isSelected ? 'text-indigo-600' : 'text-slate-400')}>{icon}</span>
          <span className="truncate">{selectedOption ? selectedOption.label : label}</span>
        </span>
        <ChevronDown
          className={cn(
            'size-3.5 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-indigo-600'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            role="listbox"
            aria-label={ariaLabel}
            className="absolute left-0 mt-1.5 w-full min-w-[210px] max-h-64 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl z-50 p-1 divide-y divide-slate-100"
          >
            <div className="py-0.5">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                {label}
              </div>
              {options.map((opt) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left',
                      active
                        ? 'bg-indigo-50 text-indigo-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    )}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {active && <Check className="size-3.5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
