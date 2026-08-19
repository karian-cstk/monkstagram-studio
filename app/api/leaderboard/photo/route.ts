import { NextRequest, NextResponse } from "next/server";
import { saveUploadedPhoto } from "@/lib/photoOverrides";
import { leaderboardPeople } from "@/content/leaderboard";

// Lets someone attach a headshot for a tracked designer directly from the
// browser, for cases where no file made it into public/leaderboard/ yet.
// Saved under public/leaderboard/uploads/ and recorded in
// content/leaderboard-photos.json so it survives a refresh.
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const accountId = form.get("accountId");
  const file = form.get("file");

  if (typeof accountId !== "string" || !accountId) {
    return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!leaderboardPeople.some((p) => p.accountId === accountId)) {
    return NextResponse.json({ error: "Unknown accountId" }, { status: 404 });
  }

  try {
    const photo = await saveUploadedPhoto(accountId, file);
    return NextResponse.json({ accountId, photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
