"use client";

import { useState, useEffect } from "react";

interface Digest {
  id: string;
  date: string;
  sea_opportunity_en: string;
  sea_opportunity_zh: string;
  sea_opportunity_admin: string | null;
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [authed, setAuthed] = useState(false);
  const [digests, setDigests] = useState<Digest[]>([]);
  const [selected, setSelected] = useState<Digest | null>(null);
  const [insight, setInsight] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDigests(adminEmail: string) {
    const res = await fetch("/api/admin/digests", {
      headers: { "x-admin-email": adminEmail },
    });
    if (res.ok) {
      const data = await res.json();
      setDigests(data);
      setAuthed(true);
    } else {
      setMessage("Unauthorized or no digests found.");
    }
  }

  function selectDigest(d: Digest) {
    setSelected(d);
    setInsight(d.sea_opportunity_admin || "");
    setMessage("");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/sea-insight", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": email,
      },
      body: JSON.stringify({
        date: selected.date,
        sea_opportunity_admin: insight,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Saved!");
      setDigests((prev) =>
        prev.map((d) =>
          d.date === selected.date ? { ...d, sea_opportunity_admin: insight } : d
        )
      );
    } else {
      setMessage("Save failed.");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl font-bold text-white text-center">
            StartupLens Admin
          </h1>
          <p className="text-white/40 text-sm text-center">
            Enter your admin email to continue
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
            onKeyDown={(e) => e.key === "Enter" && loadDigests(email)}
          />
          <button
            onClick={() => loadDigests(email)}
            className="w-full bg-accent hover:bg-accent-dark text-white rounded-xl py-3 font-medium transition-colors"
          >
            Sign In
          </button>
          {message && <p className="text-red-400 text-sm text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Admin · SEA Insights</h1>
          <span className="text-white/30 text-xs">{email}</span>
        </div>

        <div className="grid gap-2">
          {digests.map((d) => (
            <button
              key={d.date}
              onClick={() => selectDigest(d)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                selected?.date === d.date
                  ? "border-accent bg-accent/10"
                  : "border-white/10 hover:border-white/30 bg-surface-card"
              }`}
            >
              <span className="text-sm font-medium">{d.date}</span>
              <span className={`text-xs ${d.sea_opportunity_admin ? "text-accent" : "text-white/30"}`}>
                {d.sea_opportunity_admin ? "✓ Has insight" : "No insight"}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-4">
            <div className="bg-surface-card border border-white/5 rounded-xl p-4 space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-widest">AI Generated (EN)</p>
              <p className="text-white/70 text-sm leading-relaxed">{selected.sea_opportunity_en}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest block">
                Your Insight for {selected.date}
              </label>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                rows={5}
                placeholder="Add your expert perspective on this SEA opportunity..."
                className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent resize-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={save}
                disabled={saving || !insight.trim()}
                className="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white rounded-xl px-6 py-2.5 font-medium transition-colors text-sm"
              >
                {saving ? "Saving..." : "Save Insight"}
              </button>
              {message && (
                <span className={`text-sm ${message === "Saved!" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
