import { useState, useEffect, useRef } from 'react';
import { Input } from './ui';
import { useStoreHistory } from '@/hooks/useStoreHistory';

interface StoreSuggestProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StoreSuggest({ value, onChange, className }: StoreSuggestProps) {
  const { stores } = useStoreHistory();
  const [input, setInput] = useState(value);
  const [debouncedInput, setDebouncedInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const filtered = debouncedInput.trim()
    ? stores
        .filter((s) => s.toLowerCase().includes(debouncedInput.toLowerCase()))
        .slice(0, 5)
        .sort()
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (store: string) => {
    setInput(store);
    onChange(store);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ''}`}>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="e.g., Bravo, Lala, G12"
      />
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((store) => (
            <div
              key={store}
              onMouseDown={() => handleSelect(store)}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 hover:text-green-700"
            >
              {store}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
