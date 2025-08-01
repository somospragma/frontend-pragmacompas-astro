interface SelectProps {
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function Select({ label, placeholder, options, value, onChange, error }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <select
        className="w-full p-2 rounded bg-white text-black border border-gray-300 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
