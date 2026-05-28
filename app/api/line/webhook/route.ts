import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verify that the request is genuinely from LINE
function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) return false;
  const hash = crypto
    .createHmac("SHA256", secret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  console.log("LINE webhook events:", JSON.stringify(body.events));

  // Handle events (e.g., follow, message) here in the future
  // For now, just acknowledge receipt
  return NextResponse.json({ ok: true });
}
