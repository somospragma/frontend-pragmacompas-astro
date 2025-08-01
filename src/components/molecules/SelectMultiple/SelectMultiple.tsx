import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface Option {
  label: string;
  value: string;
}

interface SelectMultipleProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function SelectMultiple({ label, options, value, onChange, error }: SelectMultipleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.label.toLowerCase().includes(search.trim().toLowerCase())),
    [options, search]
  );

  const handleToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="mb-4 relative" ref={containerRef}>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full p-2 rounded bg-white text-black border border-gray-300 cursor-pointer"
          placeholder="Select options..."
          onClick={toggleOpen}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          readOnly={!isOpen}
        />
        <button type="button" className="absolute inset-y-0 right-2 flex items-center" onClick={toggleOpen}>
          ⌄
        </button>
      </div>
      {isOpen &&
        createPortal(
          <ul
            className="absolute z-50 bg-white text-black border border-gray-300 mt-1 rounded shadow-md max-h-60 overflow-y-auto"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      value.includes(opt.value) ? "bg-blue-100 font-semibold" : ""
                    }`}
                    onClick={() => handleToggle(opt.value)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span className="block px-4 py-2 text-gray-500">No results</span>
              </li>
            )}
          </ul>,
          document.body
        )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
