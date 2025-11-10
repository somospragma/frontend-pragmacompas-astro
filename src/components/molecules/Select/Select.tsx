import { useId } from "react";

interface SelectProps {
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
}

/**
 * Sanitizes input values to prevent XSS attacks
 */
const sanitizeValue = (value: string): string => {
  return value.replace(/[<>]/g, "");
};

export function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) {
  const selectId = useId();
  const errorId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value);
    onChange(sanitizedValue);
  };

  const computedAriaDescribedBy = [ariaDescribedBy, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={selectId} className="block text-sm font-medium text-white mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="requerido">
            *
          </span>
        )}
      </label>
      <select
        id={selectId}
        className="w-full p-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        aria-describedby={computedAriaDescribedBy}
        aria-invalid={!!error}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
