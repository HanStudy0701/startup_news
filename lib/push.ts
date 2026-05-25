import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase";

function initVapid() {
  webpush.setVapidDetails(
    "mailto:admin@startuplens.app",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

export async function sendPushToAll(title: string, body: string, url = "/") {
  initVapid();

  const supabase = createServiceClient();
  const { data: users } = await supabase
    .from("users")
    .select("push_subscription")
    .not("push_subscription", "is", null);

  if (!users?.length) return;

  const payload = JSON.stringify({ title, body, url });

  const results = await Promise.allSettled(
    users
      .filter((u) => u.push_subscription)
      .map((u) =>
        webpush.sendNotification(u.push_subscription as webpush.PushSubscription, payload)
      )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`Push sent: ${results.length - failed} success, ${failed} failed`);
}
