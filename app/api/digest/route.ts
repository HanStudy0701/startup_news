import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_digests")
    .select("*")
    .eq("date", date)
    .single();

  if (error || !data) {
    // Try most recent digest if today's not ready
    const { data: latest } = await supabase
      .from("daily_digests")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (!latest) {
      return NextResponse.json({ error: "No digest found" }, { status: 404 });
    }
    return NextResponse.json(latest);
  }

  return NextResponse.json(data);
}
