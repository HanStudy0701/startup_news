import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const authHeader = request.headers.get("x-admin-email");
  if (authHeader !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("daily_digests")
    .select("id, date, sea_opportunity_en, sea_opportunity_zh, sea_opportunity_admin")
    .order("date", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
