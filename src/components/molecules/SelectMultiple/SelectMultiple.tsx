import { useState, useRef, useEffect, useMemo, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { sanitizeSearchQuery, isValidOption, combineAriaDescribedBy } from "@/shared/utils/inputValidation";

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
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  "aria-describedby"?: string;
}

export function SelectMultiple({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = "Select options...",
  "aria-describedby": ariaDescribedBy,
}: SelectMultipleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

  const selectId = useId();
  const listboxId = useId();
  const errorId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setFocusedOptionIndex(-1);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, closeDropdown]);

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });

      // Focus the input for screen reader navigation
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    const sanitizedSearch = sanitizeSearchQuery(search);
    return options.filter((opt) => opt.label.toLowerCase().includes(sanitizedSearch.toLowerCase()));
  }, [options, search]);

  // Handle option selection with validation
  const handleToggle = useCallback(
    (val: string) => {
      if (!isValidOption(val, options)) {
        return; // Ignore invalid options
      }

      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    },
    [value, onChange, options]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedOptionIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
          }
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (focusedOptionIndex >= 0) {
            const option = filteredOptions[focusedOptionIndex];
            if (option) {
              handleToggle(option.value);
            }
          }
          break;

        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;

        case "Tab":
          closeDropdown();
          break;
      }
    },
    [disabled, isOpen, focusedOptionIndex, filteredOptions, handleToggle, closeDropdown]
  );

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeSearchQuery(e.target.value);
    setSearch(sanitizedValue);
    setFocusedOptionIndex(-1); // Reset focus when searching
  }, []);

  const computedAriaDescribedBy = combineAriaDescribedBy(ariaDescribedBy, error ? errorId : null);

  // Get selected options count for screen readers
  const selectedCount = value.length;
  const ariaLabel = `${label}, ${selectedCount} options selected`;

  return (
    <div className="mb-4 relative" ref={containerRef}>
      <label htmlFor={selectId} className="block text-sm font-medium text-white mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="requerido">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={selectId}
          ref={inputRef}
          className="w-full p-2 rounded bg-white text-black border border-gray-300 cursor-pointer 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={placeholder}
          onClick={toggleOpen}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          readOnly={!isOpen}
          disabled={disabled}
          required={required}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-describedby={computedAriaDescribedBy}
          aria-label={ariaLabel}
          aria-invalid={!!error}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center disabled:opacity-50"
          onClick={toggleOpen}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
        >
          ⌄
        </button>
      </div>

      {isOpen &&
        createPortal(
          <ul
            id={listboxId}
            ref={listRef}
            className="absolute z-50 bg-white text-black border border-gray-300 mt-1 rounded shadow-md max-h-60 overflow-y-auto focus:outline-none"
            style={{ top: position.top, left: position.left, width: position.width }}
            role="listbox"
            aria-label={`${label} options`}
            aria-multiselectable="true"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isSelected = value.includes(opt.value);
                const isFocused = index === focusedOptionIndex;

                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        isSelected ? "bg-blue-100 font-semibold" : ""
                      } ${isFocused ? "bg-gray-200" : ""}`}
                      onClick={() => handleToggle(opt.value)}
                      aria-label={`${opt.label}, ${isSelected ? "selected" : "not selected"}`}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })
            ) : (
              <li role="option" aria-selected="false">
                <span className="block px-4 py-2 text-gray-500">No results</span>
              </li>
            )}
          </ul>,
          document.body
        )}

      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
