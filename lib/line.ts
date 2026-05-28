const LINE_API = "https://api.line.me/v2/bot/message";

function getToken() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return token;
}

export async function lineBroadcast(messages: LineMessage[]): Promise<void> {
  const res = await fetch(`${LINE_API}/broadcast`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`LINE broadcast failed: ${res.status} ${body}`);
  } else {
    console.log("LINE broadcast sent");
  }
}

export interface LineMessage {
  type: "text" | "flex";
  text?: string;
  altText?: string;
  contents?: unknown;
}

export function buildDigestMessage(
  topHeadline: string,
  whyItMatters: string,
  totalStories: number,
  appUrl: string
): LineMessage[] {
  return [
    {
      type: "flex",
      altText: `📻 StartupLens 今日播報 — ${topHeadline}`,
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#1a1a1a",
          contents: [
            {
              type: "text",
              text: "📻 StartupLens 今日播報",
              color: "#ffffff",
              size: "sm",
              weight: "bold",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: topHeadline,
              color: "#ffffff",
              size: "md",
              weight: "bold",
              wrap: true,
            },
            {
              type: "text",
              text: whyItMatters,
              color: "#aaaaaa",
              size: "sm",
              wrap: true,
            },
            {
              type: "text",
              text: `共 ${totalStories} 則精選報導`,
              color: "#666666",
              size: "xs",
            },
          ],
          backgroundColor: "#111111",
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#111111",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "查看完整播報",
                uri: `${appUrl}/broadcast`,
              },
              style: "primary",
              color: "#f59e0b",
            },
          ],
        },
      },
    },
  ];
}
