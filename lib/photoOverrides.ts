import fs from "node:fs";
import path from "node:path";

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "content",
  "leaderboard-photos.json"
);
const UPLOAD_DIR = path.join(process.cwd(), "public", "leaderboard", "uploads");

export function readPhotoOverrides(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writePhotoOverrides(overrides: Record<string, string>) {
  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2));
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function saveUploadedPhoto(
  accountId: string,
  file: File
): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new Error("Unsupported image type. Use PNG, JPEG, or WebP.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image too large (max 8MB).");
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const safeId = accountId.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${safeId}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const publicPath = `/leaderboard/uploads/${filename}`;
  const overrides = readPhotoOverrides();
  overrides[accountId] = publicPath;
  writePhotoOverrides(overrides);

  return publicPath;
}
