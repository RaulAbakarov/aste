import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMockTrip } from "@/lib/mockGenerator";

const Schema = z.object({
  tripType: z.enum(["round", "oneway"]),
  from: z.string().min(1),
  to: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  travelers: z.object({
    adults: z.number().int().min(1).max(9),
    children: z.number().int().min(0).max(6),
    infants: z.number().int().min(0).max(4)
  }),
  budget: z.number().min(50),
  currency: z.string().default("USD"),
  styles: z.array(z.string())
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = Schema.parse(body);
    // Simulate AI thinking time
    await new Promise((r) => setTimeout(r, 1200));
    const trip = generateMockTrip(input as any);
    return NextResponse.json({ ok: true, trip });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad request" }, { status: 400 });
  }
}
