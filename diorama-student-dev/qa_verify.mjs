import { chromium } from 'playwright-core';

const bravePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

const browser = await chromium.launch({
  executablePath: bravePath,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader']
});

const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [];
page.on('pageerror', err => {
  console.error('PAGE ERROR:', err.message);
  errors.push(err.message);
});
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.error('CONSOLE ERROR:', msg.text());
    errors.push(msg.text());
  }
});

console.log('Navigating to http://localhost:5173/diorama.html...');
await page.goto('http://localhost:5173/diorama.html', { waitUntil: 'networkidle' });

await page.waitForTimeout(2500);

const ready = await page.evaluate(() => window.__dioramaReady);
console.log('__dioramaReady:', ready);

await page.screenshot({ path: 'diorama-student-dev/qa_screenshot.png' });
console.log('Screenshot saved to diorama-student-dev/qa_screenshot.png');
console.log('ERRORS COUNT:', errors.length);

await browser.close();
process.exit(errors.length > 0 ? 1 : 0);
