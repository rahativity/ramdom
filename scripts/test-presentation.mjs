import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const screenshotsDir = path.resolve('docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runQATest() {
  console.log('🚀 Starting Systematic 7-Slide Visual QA Test...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 2 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.toString());
  });

  try {
    console.log('📡 Navigating to http://localhost:4173/ ...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Slide 1: Welcome
    console.log('📸 1/7 Capturing Slide 01 (Welcome)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-01-welcome.png') });

    // Jump to Slide 2 using dot button
    console.log('👉 Navigating to Slide 02...');
    await page.click('button[aria-label="Jump to slide 2"]');
    await new Promise((r) => setTimeout(r, 1000));
    console.log('📸 2/7 Capturing Slide 02 (Architecture Overview)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-02-overview.png') });

    // Jump to Slide 3 using dot button
    console.log('👉 Navigating to Slide 03...');
    await page.click('button[aria-label="Jump to slide 3"]');
    await new Promise((r) => setTimeout(r, 1000));
    // Step to Stage 3 (calculation)
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 500));
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 500));
    console.log('📸 3/7 Capturing Slide 03 (Data Path with 5 + 3 = 8)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-03-datapath.png') });

    // Jump to Slide 4 using dot button
    console.log('👉 Navigating to Slide 04...');
    await page.click('button[aria-label="Jump to slide 4"]');
    await new Promise((r) => setTimeout(r, 1000));
    // Step to Stage 3 (signals transmitted)
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 500));
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 500));
    console.log('📸 4/7 Capturing Slide 04 (Controller Signal Propagation)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-04-controller.png') });

    // Jump to Slide 5 using dot button
    console.log('👉 Navigating to Slide 05...');
    await page.click('button[aria-label="Jump to slide 5"]');
    await new Promise((r) => setTimeout(r, 1200));
    console.log('📸 5/7 Capturing Slide 05 (Key Differences & Balance Scale)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-05-comparison.png') });

    // Jump to Slide 6 using dot button
    console.log('👉 Navigating to Slide 06...');
    await page.click('button[aria-label="Jump to slide 6"]');
    await new Promise((r) => setTimeout(r, 1000));
    // Step to WRITE BACK
    await page.keyboard.press('ArrowRight'); // Decode
    await new Promise((r) => setTimeout(r, 500));
    await page.keyboard.press('ArrowRight'); // Execute
    await new Promise((r) => setTimeout(r, 500));
    await page.keyboard.press('ArrowRight'); // Write Back
    await new Promise((r) => setTimeout(r, 600));
    console.log('📸 6/7 Capturing Slide 06 (Working Together: Execution Cycle ADD R1, R2, R3)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-06-working-together.png') });

    // Jump to Slide 7 using dot button
    console.log('👉 Navigating to Slide 07...');
    await page.click('button[aria-label="Jump to slide 7"]');
    await new Promise((r) => setTimeout(r, 1000));
    console.log('📸 7/7 Capturing Slide 07 (Thank You & Mascot)...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-07-thank-you.png') });

    // Test Overview Modal
    console.log('👉 Testing Slide Overview Modal (KeyO)...');
    await page.keyboard.press('KeyO');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'modal-slide-overview.png') });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n=======================================');
    console.log('🎉 ALL 7 SLIDES VERIFIED AND CAPTURED!');
    console.log(`Total Console Messages: ${consoleLogs.length}`);
    console.log(`Total Console Errors: ${errors.length}`);
    console.log('=======================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runQATest();
