import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import packageConfig from "./package.json";
import fs from "fs/promises";

function stripPrefix(prefix, s) {
  if (!s.startsWith(prefix)) {
    console.error(
      `
Expected string to start with prefix

- prefix: ${prefix}
- string: ${s}
`.trim()
    );
    process.exit(1);
  }

  return s.substring(prefix.length);
}

function stripSuffix(suffix, s) {
  if (!s.endsWith(suffix)) {
    console.error(
      `
Expected string to end with suffix

- suffix: ${suffix}
- string: ${s}
`.trim()
    );
    process.exit(1);
  }

  return s.substring(0, s.length - suffix.length);
}

function makePageHtml(page, hmr = false) {
  console.log(`makePageHtml(${page}, ${hmr})`);
  const script_src = `src/pages/${page}.page.tsx`;
  return (
    `
  <!doctype html>
  <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    ${hmr === true ? `<script type="module" src="/@vite/client"></script>` : ""}
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
    />
    <title>${packageConfig.name} | ${page}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${script_src}"></script>
  </body>
  </html>
  `.trim() + "\n"
  );
}

const pages = [];
for await (const page of fs.glob("src/pages/**/*.page.tsx")) {
  pages.push(stripPrefix("src/pages", stripSuffix(".page.tsx", page)));
}

console.log(JSON.stringify(pages, null, 4));

function virtualPageHtml() {
  return {
    name: "virtualPageHtml",
    buildStart() {
      for (const page of pages) {
        this.emitFile({
          type: "asset",
          filename: `${page}.html`,
          source: makePageHtml(page),
        });
      }
    },
    configureServer(server) {
      server.middleware.use((req, res, next) => {
        const page = resolveId(req.url);
        if (page === null) return next();
        console.log(`configureServer middleware use: page = ${page}`);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(makePageHtml(page, true));
        return;
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), virtualPageHtml()],

  base: `/${packageConfig.name}/`,

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
  },

  build: {
    outDir: path.join("dist"),
    emptyOutDir: true,
    rolldownOptions: {
      input: pages.reduce((acc, page) => {
        acc[page] = `${page}.html`;
        return acc;
      }, {}),
    },
  },

  resolve: {
    tsconfigPaths: true,
  },
});
