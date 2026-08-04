import fs from "fs";
import path from "path";

const ROOT = path.resolve("assets/images");

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

let removed = 0;
let saved = 0;
for (const file of walk(ROOT)) {
  if (!/\.jpe?g$/i.test(file)) continue;
  const webp = file.replace(/\.jpe?g$/i, ".webp");
  if (fs.existsSync(webp)) {
    const size = fs.statSync(file).size;
    fs.unlinkSync(file);
    removed++;
    saved += size;
  }
}

console.log(`Removed ${removed} redundant JPEGs, freed ${(saved / 1024 / 1024).toFixed(2)} MB`);
