import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  BACKEND_TRIP_PLAN_PATH,
  BACKEND_USER_ID_COOKIE,
  buildBackendTripPrompt,
  buildBackendTripRequest,
  getTravelAiBackendBaseUrl,
  normalizeBackendTripPlan,
  readOrCreateAnonymousUserId,
  type BackendTripPlanResponse
} from "@/lib/travelAiBackend";

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
  styles: z.array(z.string()),
  prompt: z.string().optional(),
  memory: z
    .object({
      lastDestination: z.string().optional(),
      lastBudget: z.number().optional(),
      lastStyles: z.array(z.string()).optional(),
      lastPrompt: z.string().optional()
    })
    .optional()
});

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as
      | { detail?: unknown; message?: unknown; error?: unknown }
      | null;
    if (payload) {
      if (typeof payload.error === "string") return payload.error;
      if (typeof payload.message === "string") return payload.message;
      if (typeof payload.detail === "string") return payload.detail;
      if (payload.detail && typeof payload.detail === "object") {
        const detail = payload.detail as Record<string, unknown>;
        if (typeof detail.message === "string") return detail.message;
        if (typeof detail.error === "string") return detail.error;
      }
    }
  }

  const text = await response.text().catch(() => "");
  return text.trim() || `Backend request failed with status ${response.status}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = Schema.parse(body);

    const backendBaseUrl = getTravelAiBackendBaseUrl();
    const requestCookies = cookies();
    const requestUserId = readOrCreateAnonymousUserId(
      requestCookies.get(BACKEND_USER_ID_COOKIE)?.value ?? req.headers.get("x-aste-user-id")
    );
    const prompt = buildBackendTripPrompt(input);
    const backendRequest = buildBackendTripRequest(input, requestUserId, prompt);

    const backendResponse = await fetch(new URL(BACKEND_TRIP_PLAN_PATH, backendBaseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(backendRequest),
      cache: "no-store"
    });

    if (!backendResponse.ok) {
      const message = await readErrorMessage(backendResponse);
      return NextResponse.json({ ok: false, error: message }, { status: backendResponse.status });
    }

    const backendTrip = (await backendResponse.json()) as BackendTripPlanResponse;
    const trip = normalizeBackendTripPlan(input, backendTrip, prompt, requestUserId);

    const response = NextResponse.json({ ok: true, trip });
    response.cookies.set({
      name: BACKEND_USER_ID_COOKIE,
      value: requestUserId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad request" }, { status: 400 });
  }
}
