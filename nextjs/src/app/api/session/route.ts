import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.KAPA_API_KEY;
  const projectId = process.env.KAPA_PROJECT_ID;
  const apiUrl = process.env.KAPA_API_URL || "https://api.kapa.ai";

  if (!apiKey || !projectId) {
    return NextResponse.json(
      { error: "Missing KAPA_API_KEY or KAPA_PROJECT_ID" },
      { status: 500 }
    );
  }

  // In a real app, derive this from your auth layer (e.g. NextAuth session, JWT, etc.).
  // The frontend must never control this value.
  const external_owner_id = "demo-user";

  const res = await fetch(
    `${apiUrl}/agent/v1/projects/${projectId}/agent/sessions/`,
    {
      method: "POST",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ external_owner_id }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Kapa API error: ${res.status}` },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}
