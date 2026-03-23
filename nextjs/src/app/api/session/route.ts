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

  const res = await fetch(
    `${apiUrl}/agent/v1/projects/${projectId}/agent/sessions/`,
    {
      method: "POST",
      headers: { "X-API-Key": apiKey },
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
