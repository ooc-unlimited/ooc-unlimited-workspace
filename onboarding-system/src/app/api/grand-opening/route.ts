import { NextRequest, NextResponse } from "next/server";
import { createGrandOpening, listGrandOpenings } from "@/lib/grand-opening";

export async function GET() {
  const gos = listGrandOpenings();
  return NextResponse.json(gos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.agent_id || !body.event_date) {
    return NextResponse.json({ error: "agent_id and event_date required" }, { status: 400 });
  }
  const go = createGrandOpening(body.agent_id, body.event_date);
  return NextResponse.json(go, { status: 201 });
}

