import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Subscribe a user to push notifications
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, subscription } = body as {
    userId: string;
    subscription: PushSubscriptionJSON;
  };

  if (!userId || !subscription) {
    return NextResponse.json({ error: "Missing userId or subscription" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("users")
    .update({ push_subscription: subscription })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Unsubscribe
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = createServiceClient();
  await supabase
    .from("users")
    .update({ push_subscription: null })
    .eq("id", userId);

  return NextResponse.json({ success: true });
}
