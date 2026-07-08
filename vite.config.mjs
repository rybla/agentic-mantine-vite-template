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

function makePageHtml(page) {
  console.log(`makePageHtml(${page})`);
  const script_src = `/src/main.tsx`;
  const favicon_src = `/src/favicon.svg`;
  return (
    `
  <!doctype html>
  <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${favicon_src}" />
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
  pages.push(stripPrefix("src/pages/", stripSuffix(".page.tsx", page)));
}

console.log(JSON.stringify(pages, null, 4));

function resolveId(url) {
  if (!url) return null;
  const pathname = url.split("?")[0].split("#")[0];
  const base = `/${packageConfig.name}/`;
  let relativePath = pathname;
  if (pathname.startsWith(base)) {
    relativePath = pathname.substring(base.length);
  } else if (pathname.startsWith("/")) {
    relativePath = pathname.substring(1);
  }

  if (relativePath === "" || relativePath === "/") {
    relativePath = "index";
  }

  if (relativePath.endsWith("/")) {
    relativePath = relativePath.slice(0, -1);
  }

  if (relativePath.endsWith(".html")) {
    relativePath = relativePath.slice(0, -5);
  }

  if (pages.includes(relativePath)) {
    return relativePath;
  }

  return null;
}

function virtualPageHtml() {
  let isBuild = false;
  return {
    name: "virtualPageHtml",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    async buildStart() {
      if (isBuild) {
        for (const page of pages) {
          await fs.writeFile(`${page}.html`, makePageHtml(page));
        }
      }
    },
    async buildEnd() {
      if (isBuild) {
        for (const page of pages) {
          try {
            await fs.unlink(`${page}.html`);
          } catch (e) {
            // ignore
          }
        }
      }
    },
    configureServer(server) {
      if (server.middlewares) {
        server.middlewares.use(async (req, res, next) => {
          const page = resolveId(req.url);
          if (page === null) return next();
          console.log(`configureServer middleware use: page = ${page}`);

          try {
            const rawHtml = makePageHtml(page);
            const transformedHtml = await server.transformIndexHtml(
              req.url,
              rawHtml
            );

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(transformedHtml);
          } catch (e) {
            return next(e);
          }
        });
      }
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
