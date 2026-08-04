import fs from "fs";
import path from "path";

const htmlFiles = fs.readdirSync(".").filter((f) => f.endsWith(".html"));

const replacements = [
  ["assets/images/", "assets/images-opt/"],
  ["workers-placing-new-coating-asphalt-road.jpg", "workers-placing-new-coating-asphalt-road.webp"],
  ["civilworks1.jpg", "civilworks1.webp"],
  ["mechanicalengineering.jpg", "mechanicalengineering.webp"],
  ["mining-supply.jpg", "mining-supply.webp"],
  ["openpit.jpg", "openpit.webp"],
  ["miningoperations.jpg", "miningoperations.webp"],
  ["roadconstruction.jpg", "roadconstruction.webp"],
  ["logistics.jpg", "logistics.webp"],
  ["projectmanagement.jpg", "projectmanagement.webp"],
  ["warren-kabunda.jpg", "warren-kabunda.webp"],
  ["sydney-kangwa.jpg", "sydney-kangwa.webp"],
];

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    html = html.split(from).join(to);
  }
  fs.writeFileSync(file, html);
  console.log("Updated", file);
}
