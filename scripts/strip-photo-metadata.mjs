// Strip camera metadata (GPS, device, timestamps) from JPEG and PNG files, losslessly.
//
// Drone and phone photos carry the exact GPS position of the house they show.
// Run this on every new image before it is committed under public/.
//
// Usage:
//   node scripts/strip-photo-metadata.mjs [--check] <file-or-folder>...
//   npm run photos:clean      (cleans public/images)
//   npm run photos:check      (fails if any image under public/images still has metadata)
//
// JPEG: removes APP1 (EXIF, XMP), APP13 (IPTC) and the APP2 multi-picture index,
// plus anything after the end of the image (drones append a preview JPEG there).
// The image data itself and the ICC colour profile are untouched.
// PNG: removes eXIf, tEXt, iTXt and zTXt chunks.
//
// EXIF also stores which way up a photo is. Removing it would turn a photo
// that relies on it sideways, so such files are refused until their pixels are
// rotated. On macOS: `sips -r <degrees> <file>` with the degrees printed below.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const JPEG_DROP = new Set([0xe1, 0xed]);
const PNG_DROP = new Set(["eXIf", "tEXt", "iTXt", "zTXt"]);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ROTATE_FOR = { 3: 180, 6: 90, 8: 270 };

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const targets = args.filter((a) => a !== "--check");
if (targets.length === 0) {
  console.error("Usage: node scripts/strip-photo-metadata.mjs [--check] <file-or-folder>...");
  process.exit(2);
}

let failures = 0;
for (const file of targets.flatMap(listImages)) {
  try {
    const result = processFile(file);
    if (result) console.log(result);
  } catch (error) {
    failures += 1;
    console.error(`${file}: ${error.message}`);
  }
}
process.exit(failures > 0 ? 1 : 0);

function listImages(path) {
  if (statSync(path).isDirectory()) {
    return readdirSync(path).flatMap((name) => (name.startsWith(".") ? [] : listImages(join(path, name))));
  }
  return [".jpg", ".jpeg", ".png"].includes(extname(path).toLowerCase()) ? [path] : [];
}

function processFile(file) {
  const input = readFileSync(file);
  const { output, orientation } = isPng(input) ? stripPng(input) : stripJpeg(input);
  if (output.length === input.length) return null;
  if (orientation && orientation !== 1) {
    const degrees = ROTATE_FOR[orientation];
    throw new Error(`relies on EXIF orientation ${orientation}; rotate the pixels first${degrees ? ` (sips -r ${degrees})` : ""}, then run again`);
  }
  if (checkOnly) throw new Error(`still has metadata (${input.length - output.length} bytes); run npm run photos:clean`);
  writeFileSync(file, output);
  return `${file}: removed ${input.length - output.length} bytes of metadata`;
}

function isPng(buf) {
  return buf.subarray(0, 8).equals(PNG_SIGNATURE);
}

function stripJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG or PNG");
  const parts = [buf.subarray(0, 2)];
  let orientation = null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`unexpected byte at offset ${i}`);
    const marker = buf[i + 1];
    if (marker === 0xda) {
      // Start of scan: image data up to the first end-of-image marker (0xFF is byte-stuffed inside scans).
      const end = buf.indexOf(Buffer.from([0xff, 0xd9]), i);
      parts.push(buf.subarray(i, end === -1 ? buf.length : end + 2));
      break;
    }
    const length = buf.readUInt16BE(i + 2);
    const segment = buf.subarray(i, i + 2 + length);
    if (marker === 0xe1) orientation ??= readOrientation(segment.subarray(4));
    if (!JPEG_DROP.has(marker) && !isMultiPictureIndex(marker, segment)) parts.push(segment);
    i += 2 + length;
  }
  return { output: Buffer.concat(parts), orientation };
}

function isMultiPictureIndex(marker, segment) {
  return marker === 0xe2 && segment.toString("latin1", 4, 8) === "MPF\0";
}

/** Orientation tag (0x0112) from the first IFD of an APP1 EXIF payload, or null. */
function readOrientation(payload) {
  if (payload.subarray(0, 6).toString("latin1") !== "Exif\0\0") return null;
  const tiff = payload.subarray(6);
  const little = tiff.toString("latin1", 0, 2) === "II";
  const u16 = (o) => (little ? tiff.readUInt16LE(o) : tiff.readUInt16BE(o));
  const u32 = (o) => (little ? tiff.readUInt32LE(o) : tiff.readUInt32BE(o));
  const ifd = u32(4);
  const count = u16(ifd);
  for (let k = 0; k < count; k += 1) {
    const entry = ifd + 2 + k * 12;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return null;
}

function stripPng(buf) {
  const parts = [buf.subarray(0, 8)];
  let i = 8;
  while (i < buf.length) {
    const length = buf.readUInt32BE(i);
    const type = buf.toString("latin1", i + 4, i + 8);
    const end = i + 12 + length;
    if (!PNG_DROP.has(type)) parts.push(buf.subarray(i, end));
    i = end;
  }
  return { output: Buffer.concat(parts), orientation: null };
}
