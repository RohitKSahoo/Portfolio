import { execSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const minify = process.argv.includes('--minify');

await mkdir('dist', { recursive: true });

console.log('Bundling src/main.js with esbuild...');
execSync(`npx esbuild src/main.js --bundle --format=iife --target=es2020 --outfile=dist/app.js ${minify ? '--minify' : '--sourcemap=inline'}`, { stdio: 'inherit' });

const js = await readFile('dist/app.js', 'utf8');
const safeJs = js.replace(/<\/script/gi, '<\\/script');

const css = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #0f766e;
  }
  body { -webkit-tap-highlight-color: transparent; }
  #frame {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: #0f766e;
  }
  #stage {
    display: block;
    width: 100%;
    height: 100%;
    background: #0f766e;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    outline: none;
  }
  #fallback {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: #0f766e;
    color: #ccfbf1;
    font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.02em;
    text-align: center;
    padding: 2rem;
  }
  #fallback[hidden] { display: none; }
`;

function page(scriptTag) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="icon" href="data:," />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0f766e" />
<title>Student Developer Bedroom Diorama</title>
<style>${css}</style>
</head>
<body>
<div id="frame"><canvas id="stage" aria-label="A real-time rendered miniature 3D diorama of a student developer bedroom workstation" tabindex="-1"></canvas></div>
<div id="fallback" hidden>This diorama needs a browser with WebGL2 enabled.</div>
${scriptTag}
</body>
</html>
`;
}

await writeFile('index.html', page('<script src="./dist/app.js"></script>'));
await writeFile('student-dev-diorama.html', page(`<script>${safeJs}</script>`));

// Synchronize with public directory for Vite server
await mkdir('../public/diorama/dist', { recursive: true });
await writeFile('../public/diorama.html', page(`<script>${safeJs}</script>`));
await writeFile('../public/diorama/index.html', page('<script src="./dist/app.js"></script>'));
await writeFile('../public/diorama/dist/app.js', js);

console.log(`Successfully generated index.html and standalone student-dev-diorama.html (${(js.length / 1024).toFixed(0)} kB) and copied to public/`);
