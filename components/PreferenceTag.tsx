"use client";

interface PreferenceTagProps {
  id: string;
  label: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function PreferenceTag({ id, label, selected, onToggle }: PreferenceTagProps) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        selected
          ? "border-accent bg-accent/10 text-accent"
          : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
