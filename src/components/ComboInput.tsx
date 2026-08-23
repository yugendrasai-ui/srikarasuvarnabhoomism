import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ComboInputProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  listClassName?: string;
  hideBorder?: boolean;
}

const ComboInput = ({
  value,
  onChange,
  options,
  placeholder,
  error,
  icon,
  containerClassName = "",
  inputClassName = "",
  listClassName = "",
  hideBorder = false,
}: ComboInputProps) => {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setTyped("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = typed.length > 0
    ? options.filter((o) => o.toLowerCase().includes(typed.toLowerCase()))
    : options;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTyped(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setTyped("");
    setOpen(false);
  };

  const borderClass = hideBorder
    ? ""
    : open
      ? "ring-2 ring-[#5C32E6] border-[#5C32E6] border"
      : error
        ? "border-red-400 bg-red-50 border"
        : "border-gray-200 bg-gray-50 border";

  return (
    <div ref={ref} className={`relative ${containerClassName}`}>
      <div className={`flex items-center rounded-xl overflow-hidden transition-all ${borderClass}`}>
        {icon && <div className="pl-4 text-gray-400">{icon}</div>}
        <input
          value={typed.length > 0 ? typed : value}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none w-full ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      {open && (
        <div className={`absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1.5 max-h-64 overflow-y-auto ${listClassName}`}>
          {filtered.length === 0 ? (
            <p className="px-4 py-2.5 text-sm text-gray-400 italic">No match — press Enter to use "{typed}"</p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-[#5C32E6] transition-colors ${
                  value === opt ? "bg-purple-50 text-[#5C32E6] font-bold" : "text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ComboInput;
