import { NextResponse } from "next/server";
import { getGrandOpening } from "@/lib/grand-opening";

interface Params {
  params: { id: string };
}

export function GET(_req: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const go = getGrandOpening(id);
  if (!go) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(go);
}

