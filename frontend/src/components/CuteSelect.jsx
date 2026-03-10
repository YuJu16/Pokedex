import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * CuteSelect - A custom cute pink dropdown that replaces the native <select>
 * Props:
 *   - value: current selected value (or '' for the placeholder)
 *   - onChange: (value) => void  (passes the raw value, not an event)
 *   - options: [{ value: string, label: string }]
 *   - placeholder: string (label shown when nothing is selected)
 *   - icon: React node (optional icon on the left)
 */
export default function CuteSelect({ value, onChange, options, placeholder, icon }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;
    const isDefault = !value;

    return (
        <div className="relative" ref={ref}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={cn(
                    "glass-input flex items-center gap-2 pr-10 cursor-pointer text-left min-w-[180px] hover:border-primary/50 transition-all",
                    isDefault ? "text-muted-foreground" : "text-foreground font-medium"
                )}
            >
                {icon && <span className="text-primary/60">{icon}</span>}
                <span className="truncate flex-1">{selectedLabel}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 text-primary/50"
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute top-full mt-2 left-0 z-50 w-full min-w-[200px] max-h-72 overflow-y-auto bg-white/95 backdrop-blur-md border-2 border-primary/20 rounded-2xl shadow-xl py-2"
                    >
                        {/* Placeholder option */}
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-primary/8 rounded-xl mx-1",
                                !value ? "text-primary font-bold" : "text-muted-foreground"
                            )}
                        >
                            {!value && <Check size={14} className="text-primary shrink-0" />}
                            {value && <span className="w-3.5 shrink-0" />}
                            {placeholder}
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-primary/10 mx-3 my-1" />

                        {/* Options */}
                        {options.map(option => {
                            const isSelected = value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { onChange(option.value); setOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors rounded-xl mx-0",
                                        isSelected
                                            ? "text-primary font-bold bg-primary/10"
                                            : "text-foreground hover:bg-primary/8 hover:text-primary"
                                    )}
                                >
                                    {isSelected
                                        ? <Check size={14} className="text-primary shrink-0" />
                                        : <span className="w-3.5 shrink-0" />
                                    }
                                    {option.label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
