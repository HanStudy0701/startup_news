"use client";

import { useState, useEffect } from "react";

export default function NotificationButton({ userId }: { userId?: string }) {
  const [state, setState] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") setState("denied");
    else if (Notification.permission === "granted") setState("subscribed");
  }, []);

  async function subscribe() {
    if (!userId) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription: sub.toJSON() }),
    });
    setState("subscribed");
  }

  if (state === "unsupported") return null;

  return (
    <button
      onClick={state === "idle" ? subscribe : undefined}
      title={state === "subscribed" ? "Notifications on" : state === "denied" ? "Notifications blocked" : "Enable notifications"}
      className={`text-lg transition-opacity ${
        state === "subscribed" ? "opacity-100 text-accent" : "opacity-50 hover:opacity-80"
      }`}
    >
      🔔
    </button>
  );
}
