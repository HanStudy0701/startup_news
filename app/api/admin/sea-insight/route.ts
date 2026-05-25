import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const authHeader = request.headers.get("x-admin-email");
  if (authHeader !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, sea_opportunity_admin } = await request.json();
  if (!date || !sea_opportunity_admin) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("daily_digests")
    .update({ sea_opportunity_admin })
    .eq("date", date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
