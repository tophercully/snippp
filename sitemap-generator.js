import fs from "fs";

const routes = [
  "/",
  "/about",
  "/browse",
  "/browse/js",
  "/browse/ts",
  "/browse/css",
  "/browse/python",
  "/browse/glsl",
  "/browse/reactjs",
  "/browse/p5",
  "/browse/reactnative",
  "/browse/svelte",
  "/browse/vue",
  "/browse/angular",
  "/browse/three",
  "/featured",
  "/dashboard",
  "/builder",
];

const domain = "https://snippp.io";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>${domain}${route}</loc>
    </url>`,
    )
    .join("")}
</urlset>`;

fs.writeFileSync("public/sitemap.xml", sitemap, "utf8");
console.log("Sitemap generated!");
