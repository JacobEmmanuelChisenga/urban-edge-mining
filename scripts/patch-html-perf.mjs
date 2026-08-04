import fs from "fs";

const preloads = {
  "index.html": "assets/images/heroes/home.webp",
  "about.html": "assets/images/heroes/about.webp",
  "services.html": "assets/images/heroes/services.webp",
  "projects.html": "assets/images/projects/openpit.webp",
  "clients.html": "assets/images/heroes/clients.webp",
  "contact.html": "assets/images/heroes/contact.webp",
};

const logoFind =
  '<img class="logo__img" src="assets/images/logo/logo.png" alt="UrbanEdge Mining & Engineering" />';
const logoReplace =
  '<img class="logo__img" src="assets/images/logo/logo.png" alt="UrbanEdge Mining & Engineering" width="220" height="44" decoding="async" fetchpriority="high" />';

for (const file of Object.keys(preloads)) {
  let html = fs.readFileSync(file, "utf8");

  if (!html.includes('rel="preload" as="image"')) {
    html = html.replace(
      '<link rel="stylesheet" href="assets/css/mockup.css" />',
      `<link rel="stylesheet" href="assets/css/mockup.css" />\n    <link rel="preload" as="image" href="${preloads[file]}" fetchpriority="high" />`
    );
  }

  html = html.split(logoFind).join(logoReplace);
  html = html.replace(
    '<script src="assets/vendor/aos/aos.js"></script>',
    '<script src="assets/vendor/aos/aos.js" defer></script>'
  );
  html = html.replace(
    '<script src="assets/js/main.js"></script>',
    '<script src="assets/js/main.js" defer></script>'
  );
  html = html.replace(/loading="lazy" \/>/g, 'loading="lazy" decoding="async" />');

  fs.writeFileSync(file, html);
  console.log("Patched", file);
}
