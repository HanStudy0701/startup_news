import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 text-center px-6">
      <span className="text-5xl">🔭</span>
      <h1 className="font-display text-2xl font-bold text-white">Page not found</h1>
      <p className="text-white/40 text-sm">This page doesn't exist.</p>
      <Link
        href="/"
        className="mt-2 text-accent hover:underline text-sm"
      >
        ← Back to today's digest
      </Link>
    </div>
  );
}
