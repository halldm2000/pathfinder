import { useState } from "react";

interface Props {
  onSend: (content: string) => void;
  placeholder: string;
  disabled: boolean;
}

export function QueryBar({ onSend, placeholder, disabled }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-zinc-800 bg-zinc-900 shrink-0"
    >
      <div className="flex gap-2 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-nvidia disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-nvidia text-black font-medium text-sm rounded-lg hover:bg-nvidia/90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Send All
        </button>
      </div>
    </form>
  );
}
