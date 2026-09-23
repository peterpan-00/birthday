/**
 * Migration & Upload Utility: Local Private Photos -> Vercel Private Blob
 *
 * Requirements:
 * - Reads local private/photos/ directory
 * - Validates expected photo IDs against ALLOWED_PHOTO_IDS
 * - Uploads ONLY supported image types (.jpg, .jpeg, .png, .webp, .avif)
 * - Writes deterministic Blob pathnames: birthday/photos/[id].[ext]
 * - Strictly enforces private access (access: "private")
 * - Never prints secrets, tokens, or private blob URLs
 * - Can be safely rerun (checks existing blobs, avoids redundant uploads)
 * - Reports missing or extra local photos
 *
 * Usage:
 *   npx tsx scripts/upload-private-photos.ts
 *   npx tsx scripts/upload-private-photos.ts --force
 */

import fs from "fs";
import path from "path";
import { put, head } from "@vercel/blob";

// Simple .env.local loader for CLI runs when not using dotenv
function loadEnvLocal() {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const fullPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnvLocal();

// Registry of configured photo IDs
const CONFIGURED_PHOTO_IDS = [
  "mau-01", "mau-02", "mau-03", "mau-04", "mau-05", "mau-06", "mau-07",
  "mau-08", "mau-09", "mau-10", "mau-11", "mau-12", "mau-13", "mau-14",
  "mau-15", "mau-16", "mau-17", "mau-18", "mau-19", "mau-20", "mau-21",
  "mau-22", "mau-23", "mau-24", "mau-25", "mau-26", "mau-27", "mau-28",
  "mau-29", "mau-30", "mau-31",
];

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

async function main() {
  console.log("\n========================================================");
  console.log("🌸 Private Photo Migration: Local -> Vercel Private Blob");
  console.log("========================================================\n");

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const hasOidc = Boolean(process.env.VERCEL_OIDC_TOKEN);

  if (!token && !hasOidc) {
    console.error("❌ ERROR: Missing BLOB_READ_WRITE_TOKEN.");
    console.error("Please add your Vercel Blob token to .env.local:\n");
    console.error("  BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...\n");
    console.error("Obtain it from your Vercel Dashboard -> Storage -> Blob Store -> .env.local tab.\n");
    process.exit(1);
  }

  const isForced = process.argv.includes("--force");
  const photosDir = path.join(process.cwd(), "private", "photos");

  if (!fs.existsSync(photosDir)) {
    console.error(`❌ Local directory not found: ${photosDir}`);
    process.exit(1);
  }

  const localFiles = fs.readdirSync(photosDir);
  console.log(`📁 Found ${localFiles.length} file(s) in local private/photos/ directory.`);

  const configuredSet = new Set(CONFIGURED_PHOTO_IDS);
  const foundPhotoIds = new Set<string>();
  const extraFiles: string[] = [];
  const unsupportedFiles: string[] = [];
  const validUploads: { filePath: string; filename: string; photoId: string; ext: string }[] = [];

  for (const filename of localFiles) {
    if (filename.startsWith(".") || filename === "README.txt") continue;

    const ext = path.extname(filename).toLowerCase();
    const baseId = path.basename(filename, ext);

    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      unsupportedFiles.push(filename);
      continue;
    }

    if (!configuredSet.has(baseId)) {
      extraFiles.push(filename);
      continue;
    }

    foundPhotoIds.add(baseId);
    validUploads.push({
      filePath: path.join(photosDir, filename),
      filename,
      photoId: baseId,
      ext,
    });
  }

  // Report missing photos from configured set
  const missingPhotoIds = CONFIGURED_PHOTO_IDS.filter((id) => !foundPhotoIds.has(id));

  console.log(`✓ Valid photos identified for upload: ${validUploads.length}`);
  if (missingPhotoIds.length > 0) {
    console.warn(`⚠️  Warning: ${missingPhotoIds.length} configured photo ID(s) missing locally:`);
    console.warn(`   ${missingPhotoIds.join(", ")}`);
  }
  if (extraFiles.length > 0) {
    console.log(`ℹ️  Extra files not in configured registry (skipped): ${extraFiles.join(", ")}`);
  }
  if (unsupportedFiles.length > 0) {
    console.log(`ℹ️  Non-image or unsupported files (skipped): ${unsupportedFiles.join(", ")}`);
  }

  console.log("\n🚀 Starting secure private uploads...\n");

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const item of validUploads) {
    const destinationPath = `birthday/photos/${item.filename}`;
    const contentType = MIME_MAP[item.ext] || "image/jpeg";
    const fileBuffer = fs.readFileSync(item.filePath);
    const localSize = fileBuffer.byteLength;

    // Safe re-run check: verify if blob already exists with same size
    if (!isForced) {
      try {
        const existing = await head(destinationPath, {
          token: token || undefined,
        });
        if (existing && existing.size === localSize) {
          console.log(`⏩ [SKIPPED] ${item.photoId} (already uploaded: ${destinationPath}, ${localSize} bytes)`);
          skippedCount++;
          continue;
        }
      } catch {
        // Blob does not exist yet, proceed with upload
      }
    }

    try {
      // Strictly private upload with deterministic path
      await put(destinationPath, fileBuffer, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType,
        token,
      });

      console.log(`✅ [UPLOADED] ${item.photoId} -> ${destinationPath} (${(localSize / 1024).toFixed(1)} KB, private)`);
      uploadedCount++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ [FAILED] ${item.photoId}: ${message}`);
      errorCount++;
    }
  }

  console.log("\n========================================================");
  console.log("📊 Migration Summary");
  console.log("========================================================");
  console.log(`Total Configured IDs: ${CONFIGURED_PHOTO_IDS.length}`);
  console.log(`Found Locally:        ${validUploads.length}`);
  console.log(`Newly Uploaded:       ${uploadedCount}`);
  console.log(`Already Present:      ${skippedCount}`);
  console.log(`Errors:               ${errorCount}`);
  console.log(`Missing Locally:      ${missingPhotoIds.length}`);
  console.log("========================================================\n");

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
