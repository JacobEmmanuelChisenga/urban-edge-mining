import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = path.resolve("assets/images");
const OUT = SRC;

function maxWidthFor(filePath) {
  const p = filePath.replace(/\\/g, "/");
  if (p.includes("/heroes/")) return 1920;
  if (p.includes("/logo/")) return 480;
  if (p.includes("/clients/")) return 320;
  if (p.includes("/leadership/")) return 480;
  if (p.includes("/about/")) return 1200;
  return 960;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return null;

  const rel = path.relative(SRC, filePath);
  const outExt = ext === ".png" ? ".png" : ".webp";
  const outPath = path.join(OUT, rel.replace(/\.(jpe?g|webp)$/i, outExt).replace(/\.png$/i, ".png"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const before = fs.statSync(filePath).size;
  const maxWidth = maxWidthFor(filePath);
  const image = sharp(filePath, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  let pipeline = image.resize({
    width: meta.width > maxWidth ? maxWidth : undefined,
    withoutEnlargement: true,
  });

  if (outExt === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.webp({ quality: 80, effort: 4 });
  }

  await pipeline.toFile(outPath);
  const after = fs.statSync(outPath).size;
  return { rel, before, after, out: path.relative(SRC, outPath).replace(/\\/g, "/") };
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name !== "IMAGE-GUIDE.txt") files.push(full);
  }
  return files;
}

const results = [];
for (const file of walk(SRC)) {
  try {
    results.push(await optimizeFile(file));
  } catch (err) {
    console.error("Failed:", path.relative(SRC, file), err.message);
  }
}

const saved = results.reduce((s, r) => s + (r.before - r.after), 0);
console.log("Created", results.length, "optimized files in assets/images/");
console.log("Saved", (saved / 1024 / 1024).toFixed(2), "MB vs originals\n");
for (const r of results.sort((a, b) => b.before - b.after - (a.before - a.after)).slice(0, 15)) {
  console.log(`${r.rel}: ${(r.before / 1024 / 1024).toFixed(2)}MB → ${(r.after / 1024).toFixed(0)}KB`);
}
