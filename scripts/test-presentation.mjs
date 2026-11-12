import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const screenshotsDir = path.resolve('docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const PREVIEW_PORT = Number(process.env.QA_PORT || 4174);
const BASE_URL = process.env.QA_BASE_URL || `http://127.0.0.1:${PREVIEW_PORT}/`;
const AUTO_SPAWN_PREVIEW = !process.env.QA_BASE_URL;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Server not ready yet
    }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for preview server at ${url}`);
}

function startPreviewServer() {
  const child = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort'],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    }
  );
  child.stdout?.on('data', () => {});
  child.stderr?.on('data', () => {});
  return child;
}

async function getSlideCounterText(page) {
  return page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.textContent?.trim() ?? '' : '';
  });
}

async function waitForAnimationSettle(ms = 900) {
  await sleep(ms);
}

async function stepBeats(page, steps) {
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(320);
  }
  await sleep(700);
}

async function runModalChecks(page) {
  console.log('🧪 Verifying native <dialog> SlideOverview & keyboard guards...');

  // Ensure we start from a known slide (Slide 07 currently)
  await page.keyboard.press('KeyO');
  await sleep(350);

  const openCheck = await page.evaluate(() => {
    const dlg = document.querySelector('dialog');
    if (!dlg) return { exists: false };
    return {
      exists: true,
      open: dlg.open,
      isModal: dlg.matches(':modal'),
      hasRoleAttr: dlg.hasAttribute('role'),
      hasAriaModal: dlg.hasAttribute('aria-modal'),
      ariaLabelledBy: dlg.getAttribute('aria-labelledby'),
      headingExists: !!document.getElementById(dlg.getAttribute('aria-labelledby') || ''),
      closedBy: dlg.getAttribute('closedby'),
    };
  });

  assert.equal(openCheck.exists, true, 'SlideOverview must render a native <dialog>');
  assert.equal(openCheck.open, true, '<dialog> must open via showModal() on KeyO');
  assert.equal(openCheck.isModal, true, '<dialog> must match :modal');
  assert.equal(openCheck.hasRoleAttr, false, 'Native <dialog> must not carry redundant role attribute');
  assert.equal(openCheck.hasAriaModal, false, 'Native <dialog> must not carry redundant aria-modal attribute');
  assert.equal(openCheck.headingExists, true, '<dialog> aria-labelledby must point to an existing heading');
  assert.equal(openCheck.closedBy, 'any', '<dialog> should declare closedby="any"');

  // Capture Slide Overview screenshot
  console.log('📸 Capturing modal-slide-overview.png at 1440x810...');
  await page.screenshot({ path: path.join(screenshotsDir, 'modal-slide-overview.png') });

  // Verify ArrowRight / Space while modal is open does NOT advance underlying slide
  const beforeGuard = await getSlideCounterText(page);
  await page.keyboard.press('ArrowRight');
  await sleep(200);
  await page.keyboard.press('Space');
  await sleep(200);
  const afterGuard = await getSlideCounterText(page);
  assert.equal(
    afterGuard.slice(0, 7),
    beforeGuard.slice(0, 7),
    `ArrowRight/Space leaked behind open SlideOverview (${beforeGuard} -> ${afterGuard})`
  );

  // Verify clicking a slide thumbnail jumps to that slide AND closes the dialog
  await page.evaluate(() => {
    const dlg = document.querySelector('dialog');
    const buttons = Array.from(dlg?.querySelectorAll('button') ?? []);
    const slide4Btn = buttons.find((b) => b.textContent?.includes('04 / 07'));
    if (!slide4Btn) throw new Error('Slide 04 thumbnail button not found inside dialog');
    slide4Btn.click();
  });
  await sleep(900);

  const afterSelect = await page.evaluate(() => {
    const dlg = document.querySelector('dialog');
    const header = document.querySelector('header');
    return {
      dialogOpen: dlg?.open ?? null,
      headerText: header?.textContent ?? '',
    };
  });
  assert.equal(afterSelect.dialogOpen, false, 'Clicking thumbnail in SlideOverview must close <dialog>');
  assert.ok(
    afterSelect.headerText.includes('04 / 07'),
    `Clicking 04 / 07 thumbnail must jump to Slide 04, got: ${afterSelect.headerText}`
  );

  // Re-open via Grid button & close via Escape
  await page.click('button[aria-label="Slide Overview"]');
  await sleep(300);
  assert.equal(await page.evaluate(() => document.querySelector('dialog')?.open), true, 'Grid button must open dialog');
  await page.keyboard.press('Escape');
  await sleep(300);
  assert.equal(await page.evaluate(() => document.querySelector('dialog')?.open), false, 'Escape must close dialog');

  // Re-open via KeyO & close via backdrop click (outside dialog box)
  await page.keyboard.press('KeyO');
  await sleep(300);
  assert.equal(await page.evaluate(() => document.querySelector('dialog')?.open), true, 'KeyO must re-open dialog');
  await page.mouse.click(12, 12);
  await sleep(300);
  assert.equal(
    await page.evaluate(() => document.querySelector('dialog')?.open),
    false,
    'Backdrop click outside dialog must light-dismiss <dialog>'
  );

  // Rapid Home / End interruption test (must not get dropped by transition lock)
  await page.keyboard.press('End');
  await sleep(120);
  await page.keyboard.press('Home');
  await sleep(900);
  const homeHeader = await getSlideCounterText(page);
  assert.ok(homeHeader.includes('01 / 07'), `Rapid End -> Home must land on 01 / 07, got: ${homeHeader}`);
}

async function runReducedMotionChecks(browser, url) {
  console.log('🧪 Verifying prefers-reduced-motion: reduce behavior...');
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  const rmErrors = [];
  const rmWarnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') rmErrors.push(msg.text());
    if (msg.type() === 'warning') rmWarnings.push(msg.text());
  });
  page.on('pageerror', (err) => rmErrors.push(String(err)));

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
  await sleep(250);

  // Verify auto-play appears paused under reduced motion
  const autoPlayLabel = await page.evaluate(() => {
    const playBtn = document.querySelector('button[aria-label*="Auto Animation"]');
    return playBtn?.getAttribute('aria-label') ?? '';
  });
  assert.equal(
    autoPlayLabel,
    'Play Auto Animation',
    `Auto-play must be paused under prefers-reduced-motion (got "${autoPlayLabel}")`
  );

  // Visit every slide and check visible animated selectors immediately reach opacity: 1
  const slideSelectors = [
    ['.welcome-badge', '.welcome-btn', '.welcome-highlights', '.welcome-chip'],
    ['.overview-head', '.overview-card', '.overview-bullet'],
    ['.dp-head', '.dp-panel', '.dp-bullet'],
    ['.ctrl-head', '.ctrl-panel', '.ctrl-bullet'],
    ['.diff-head', '.diff-table', '.diff-row', '.diff-scale', '.diff-takeaway'],
    ['.work-head'],
    ['.ty-chip', '.ty-title', '.ty-sub', '.ty-btn', '.ty-summary'],
  ];

  for (let i = 0; i < 7; i++) {
    await page.click(`button[aria-label="Jump to slide ${i + 1}"]`);
    await sleep(250);

    const opacityIssues = await page.evaluate((selectors) => {
      const bad = [];
      for (const sel of selectors) {
        const els = Array.from(document.querySelectorAll(sel));
        if (els.length === 0) {
          bad.push(`${sel}: missing`);
          continue;
        }
        for (const el of els) {
          const op = window.getComputedStyle(el).opacity;
          if (op !== '1') {
            bad.push(`${sel}: opacity=${op}`);
          }
        }
      }
      return bad;
    }, slideSelectors[i]);

    assert.deepEqual(
      opacityIssues,
      [],
      `Reduced-motion opacity check failed on slide ${i + 1}: ${opacityIssues.join(', ')}`
    );
  }

  // Verify auto-play does NOT advance beat on Slide 03 when reduced motion is active
  await page.click('button[aria-label="Jump to slide 3"]');
  await sleep(300);
  const stageBefore = await page.evaluate(() => document.body.innerText.includes('Stage 1 / 4'));
  await sleep(2700);
  const stageAfter = await page.evaluate(() => document.body.innerText.includes('Stage 1 / 4'));
  assert.equal(stageBefore, true, 'Slide 03 must start at Stage 1 / 4');
  assert.equal(stageAfter, true, 'Auto-play must NOT advance beats while prefers-reduced-motion is reduce');

  assert.equal(rmErrors.length, 0, `Reduced-motion console errors: ${rmErrors.join(' | ')}`);
  assert.equal(rmWarnings.length, 0, `Reduced-motion console warnings: ${rmWarnings.join(' | ')}`);

  await context.close();
}

async function runViewportLayoutChecks(browser, url) {
  const viewports = [
    { name: '1920x1080', width: 1920, height: 1080, isDesktop: true },
    { name: '1440x810', width: 1440, height: 810, isDesktop: true },
    { name: '1280x720', width: 1280, height: 720, isDesktop: true },
    { name: '768x1024', width: 768, height: 1024, isDesktop: false },
    { name: '390x844', width: 390, height: 844, isDesktop: false },
  ];

  console.log('📐 Running multi-viewport layout, overflow & side-rail bounding-box checks...');

  for (const vp of viewports) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    const vpErrors = [];
    const vpWarnings = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') vpErrors.push(msg.text());
      if (msg.type() === 'warning') vpWarnings.push(msg.text());
    });
    page.on('pageerror', (err) => vpErrors.push(String(err)));

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await sleep(400);

    // Pause auto-play so slide state stays stable during measurement
    const pauseBtn = await page.$('button[aria-label="Pause Auto Animation"]');
    if (pauseBtn) {
      await pauseBtn.click();
      await sleep(150);
    }

    for (let slideIdx = 0; slideIdx < 7; slideIdx++) {
      // On mobile (<640px), slide dot buttons are hidden; navigate via Next / End / Slide Overview
      if (slideIdx > 0) {
        const dotVisible = await page.evaluate((idx) => {
          const btn = document.querySelector(`button[aria-label="Jump to slide ${idx + 1}"]`);
          if (!btn) return false;
          const r = btn.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }, slideIdx);

        if (dotVisible) {
          await page.click(`button[aria-label="Jump to slide ${slideIdx + 1}"]`);
        } else {
          await page.keyboard.press('KeyO');
          await sleep(250);
          await page.evaluate((numLabel) => {
            const buttons = Array.from(document.querySelectorAll('dialog button'));
            const target = buttons.find((b) => b.textContent?.includes(numLabel));
            target?.click();
          }, `0${slideIdx + 1} / 07`);
        }
        await sleep(950);
      }

      const metrics = await page.evaluate((checkDesktop, currentIdx) => {
        const docEl = document.documentElement;
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        const mainRect = main ? main.getBoundingClientRect() : null;

        // Horizontal overflow checks
        const docHorizOverflow = docEl.scrollWidth > docEl.clientWidth;
        const mainHorizOverflow = main ? main.scrollWidth > main.clientWidth : false;

        // Desktop vertical clipping checks (both <main> and active slide container)
        const slideRoot = main?.firstElementChild?.firstElementChild?.firstElementChild;
        const mainVertOverflow = main ? main.scrollHeight > main.clientHeight + 2 : false;
        const slideVertOverflow = slideRoot ? slideRoot.scrollHeight > slideRoot.clientHeight + 2 : false;

        // Check header stays within viewport width and has no clipped items
        const headerOverflow = header ? header.scrollWidth > header.clientWidth : false;

        // Check accessible dot hit targets on desktop/tablet >= 640px
        const dotButtons = Array.from(document.querySelectorAll('button[aria-label^="Jump to slide "]'));
        const smallDots = dotButtons
          .map((b) => {
            const r = b.getBoundingClientRect();
            return { label: b.getAttribute('aria-label'), w: r.width, h: r.height };
          })
          .filter((d) => d.w > 0 && (d.w < 24 || d.h < 24));

        // Side rails & background SVGs checks (desktop >= 1024px)
        const bgSvgs = Array.from(document.querySelectorAll('div[aria-hidden="true"] svg'));
        const sliceSvgs = bgSvgs
          .filter((s) => (s.getAttribute('preserveAspectRatio') || '').includes('slice'))
          .map((s) => s.getAttribute('preserveAspectRatio'));

        let leftRailRect = null;
        let rightRailRect = null;
        let contentBoxRect = null;
        let railOverlap = false;
        let railsVisible = false;
        const railShapesClipped = [];

        if (checkDesktop) {
          const leftTrace = document.querySelector('.bg-trace-left');
          const rightTrace = document.querySelector('.bg-trace-right');
          const leftSvg = leftTrace?.closest('svg');
          const rightSvg = rightTrace?.closest('svg');
          leftRailRect = leftSvg ? leftSvg.getBoundingClientRect() : null;
          rightRailRect = rightSvg ? rightSvg.getBoundingClientRect() : null;
          railsVisible =
            !!leftRailRect &&
            !!rightRailRect &&
            leftRailRect.width > 40 &&
            leftRailRect.height > 200 &&
            rightRailRect.width > 40 &&
            rightRailRect.height > 200;

          for (const [sideName, svgEl, svgRect] of [
            ['left', leftSvg, leftRailRect],
            ['right', rightSvg, rightRailRect],
          ]) {
            if (!svgEl || !svgRect) continue;
            for (const shape of svgEl.querySelectorAll('rect, polygon, circle')) {
              const sr = shape.getBoundingClientRect();
              if (sr.width <= 0 || sr.height <= 0) continue;
              if (
                sr.left < svgRect.left - 1 ||
                sr.right > svgRect.right + 1 ||
                sr.top < svgRect.top - 1 ||
                sr.bottom > svgRect.bottom + 1
              ) {
                railShapesClipped.push(`${sideName}:${shape.tagName}(${Math.round(sr.left)},${Math.round(sr.top)})`);
              }
            }
          }

          const contentWrapper = main?.querySelector('.max-w-\\[1160px\\]');
          contentBoxRect = contentWrapper ? contentWrapper.getBoundingClientRect() : null;

          if (leftRailRect && rightRailRect && contentBoxRect) {
            if (leftRailRect.right > contentBoxRect.left + 1 || rightRailRect.left < contentBoxRect.right - 1) {
              railOverlap = true;
            }
          }
        }

        // Slide-specific geometry checks (alignment & card height parity on desktop)
        let extraIssues = [];
        if (checkDesktop && currentIdx === 1) {
          const cards = Array.from(document.querySelectorAll('.overview-card > div'));
          if (cards.length === 3) {
            const heights = cards.map((c) => c.getBoundingClientRect().height);
            const spread = Math.max(...heights) - Math.min(...heights);
            if (spread > 2) extraIssues.push(`Slide 02 card height mismatch: ${heights.map((h) => h.toFixed(1)).join('/')}`);
          }
        }
        if (checkDesktop && currentIdx === 2) {
          const cols = Array.from(document.querySelectorAll('.dp-panel > div, .dp-panel + div > div'));
          if (cols.length === 2) {
            const diff = Math.abs(cols[0].getBoundingClientRect().height - cols[1].getBoundingClientRect().height);
            if (diff > 2) extraIssues.push(`Slide 03 column height mismatch: ${diff.toFixed(1)}px`);
          }
        }
        if (checkDesktop && currentIdx === 3) {
          const cols = Array.from(document.querySelectorAll('.ctrl-panel > div, .ctrl-panel + div > div'));
          if (cols.length === 2) {
            const diff = Math.abs(cols[0].getBoundingClientRect().height - cols[1].getBoundingClientRect().height);
            if (diff > 2) extraIssues.push(`Slide 04 column height mismatch: ${diff.toFixed(1)}px`);
          }
        }
        if (checkDesktop && currentIdx === 4) {
          const headRect = document.querySelector('.diff-head')?.getBoundingClientRect();
          const tableRect = document.querySelector('.diff-table')?.getBoundingClientRect();
          const scaleRect = document.querySelector('.diff-scale')?.getBoundingClientRect();
          if (headRect && tableRect && Math.abs(headRect.left - tableRect.left) > 2) {
            extraIssues.push(`Slide 05 headline left (${headRect.left.toFixed(1)}) != table left (${tableRect.left.toFixed(1)})`);
          }
          if (tableRect && scaleRect && Math.abs(tableRect.height - scaleRect.height) > 2) {
            extraIssues.push(`Slide 05 card height mismatch: table=${tableRect.height.toFixed(1)} vs scale=${scaleRect.height.toFixed(1)}`);
          }
        }

        // Check no visible interactive element overflows viewport horizontally
        const interactiveOverflow = Array.from(document.querySelectorAll('main button, main h1, main h2, main svg'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.left < -1 || r.right > docEl.clientWidth + 1);
          })
          .map((el) => el.tagName);

        return {
          docHorizOverflow,
          mainHorizOverflow,
          mainVertOverflow,
          slideVertOverflow,
          headerOverflow,
          smallDots,
          sliceSvgs,
          railsVisible,
          railOverlap,
          railShapesClipped,
          interactiveOverflow,
          extraIssues,
          mainDims: mainRect ? { h: mainRect.height, scrollH: main?.scrollHeight } : null,
          slideDims: slideRoot ? { h: slideRoot.clientHeight, scrollH: slideRoot.scrollHeight } : null,
        };
      }, vp.isDesktop, slideIdx);

      assert.equal(
        metrics.docHorizOverflow,
        false,
        `${vp.name} Slide 0${slideIdx + 1}: document horizontal overflow detected`
      );
      assert.equal(
        metrics.mainHorizOverflow,
        false,
        `${vp.name} Slide 0${slideIdx + 1}: <main> horizontal overflow detected`
      );
      assert.equal(
        metrics.headerOverflow,
        false,
        `${vp.name} Slide 0${slideIdx + 1}: <header> horizontal overflow detected`
      );
      assert.deepEqual(
        metrics.interactiveOverflow,
        [],
        `${vp.name} Slide 0${slideIdx + 1}: element overflowed viewport: ${metrics.interactiveOverflow.join(', ')}`
      );
      assert.deepEqual(
        metrics.smallDots,
        [],
        `${vp.name} Slide 0${slideIdx + 1}: dot hit target < 24x24px: ${JSON.stringify(metrics.smallDots)}`
      );
      assert.deepEqual(
        metrics.sliceSvgs,
        [],
        `${vp.name} Slide 0${slideIdx + 1}: AnimatedBackground SVG still uses slice preserveAspectRatio`
      );

      if (vp.isDesktop) {
        assert.equal(
          metrics.mainVertOverflow,
          false,
          `${vp.name} Slide 0${slideIdx + 1}: desktop vertical clipping in <main> (${JSON.stringify(metrics.mainDims)})`
        );
        assert.equal(
          metrics.slideVertOverflow,
          false,
          `${vp.name} Slide 0${slideIdx + 1}: desktop vertical clipping in slide container (${JSON.stringify(metrics.slideDims)})`
        );
        assert.equal(
          metrics.railsVisible,
          true,
          `${vp.name} Slide 0${slideIdx + 1}: left/right AnimatedBackground side rails not visible`
        );
        assert.equal(
          metrics.railOverlap,
          false,
          `${vp.name} Slide 0${slideIdx + 1}: AnimatedBackground side rail overlaps slide content box`
        );
        assert.deepEqual(
          metrics.railShapesClipped,
          [],
          `${vp.name} Slide 0${slideIdx + 1}: AnimatedBackground rail shape escaped/clipped SVG bounds: ${metrics.railShapesClipped.join(', ')}`
        );
        assert.deepEqual(
          metrics.extraIssues,
          [],
          `${vp.name} Slide 0${slideIdx + 1}: layout issue -> ${metrics.extraIssues.join('; ')}`
        );
      }
    }

    assert.equal(vpErrors.length, 0, `${vp.name} console/page errors: ${vpErrors.join(' | ')}`);
    assert.equal(vpWarnings.length, 0, `${vp.name} console warnings: ${vpWarnings.join(' | ')}`);
    console.log(`  ✅ ${vp.name}: all 7 slides passed (0 overflow, 0 clipping, 0 warnings/errors)`);

    await context.close();
  }
}

async function runQATest() {
  console.log(`🚀 Starting Full QA Verification Suite against ${BASE_URL}...`);
  const previewProc = AUTO_SPAWN_PREVIEW ? startPreviewServer() : null;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    await waitForServer(BASE_URL);

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 2 });

    const consoleErrors = [];
    const consoleWarnings = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(text);
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err.toString());
    });

    console.log(`📡 Navigating to ${BASE_URL} ...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await waitForAnimationSettle(1300);

    // Pause auto-play after initial mount so manual beat stepping is deterministic
    const pauseBtn = await page.$('button[aria-label="Pause Auto Animation"]');
    if (pauseBtn) {
      await pauseBtn.click();
      await sleep(150);
    }

    // Slide 01: Welcome
    console.log('📸 1/7 Capturing slide-01-welcome.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-01-welcome.png') });

    // Slide 02: Overview
    console.log('👉 Navigating to Slide 02...');
    await page.click('button[aria-label="Jump to slide 2"]');
    await waitForAnimationSettle(1000);
    console.log('📸 2/7 Capturing slide-02-overview.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-02-overview.png') });

    // Slide 03: Data Path (step 3 times -> Beat 3 so 5 + 3 = 8 shows completely)
    console.log('👉 Navigating to Slide 03 (stepping 3x to Beat 3: 5 + 3 = 8)...');
    await page.click('button[aria-label="Jump to slide 3"]');
    await waitForAnimationSettle(1000);
    await stepBeats(page, 3);
    const slide3Text = await page.evaluate(() => document.body.innerText);
    assert.ok(
      slide3Text.includes('Step 3/3 • Result: 8') && slide3Text.includes('Stage 4 / 4'),
      `Slide 03 did not reach Beat 3 (Result: 8). Observed: ${slide3Text}`
    );
    console.log('📸 3/7 Capturing slide-03-datapath.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-03-datapath.png') });

    // Slide 04: Controller (step 2 times -> Beat 2 so signals dispatch)
    console.log('👉 Navigating to Slide 04 (stepping 2x to Beat 2: Signals Dispatched)...');
    await page.click('button[aria-label="Jump to slide 4"]');
    await waitForAnimationSettle(1000);
    await stepBeats(page, 2);
    const slide4Text = await page.evaluate(() => document.body.innerText);
    assert.ok(
      slide4Text.includes('Step 3/3 • Signals Dispatched') && slide4Text.includes('Stage 3 / 3'),
      `Slide 04 did not reach Beat 2 (Signals Dispatched). Observed: ${slide4Text}`
    );
    console.log('📸 4/7 Capturing slide-04-controller.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-04-controller.png') });

    // Slide 05: Key Differences & Balance Scale
    console.log('👉 Navigating to Slide 05...');
    await page.click('button[aria-label="Jump to slide 5"]');
    await waitForAnimationSettle(1300);
    console.log('📸 5/7 Capturing slide-05-comparison.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-05-comparison.png') });

    // Slide 06: Working Together (step 3 times -> Beat 3: WRITE BACK)
    console.log('👉 Navigating to Slide 06 (stepping 3x to Beat 3: WRITE BACK)...');
    await page.click('button[aria-label="Jump to slide 6"]');
    await waitForAnimationSettle(1000);
    await stepBeats(page, 3);
    console.log('📸 6/7 Capturing slide-06-working-together.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-06-working-together.png') });

    // Slide 07: Thank You (wait 1600ms so .ty-btn & .ty-summary settle completely)
    console.log('👉 Navigating to Slide 07 (waiting 1600ms for full entrance)...');
    await page.click('button[aria-label="Jump to slide 7"]');
    await waitForAnimationSettle(1600);
    const tyBtnOpacity = await page.evaluate(() => {
      const btn = document.querySelector('.ty-btn');
      return btn ? window.getComputedStyle(btn).opacity : null;
    });
    assert.equal(tyBtnOpacity, '1', `Slide 07 .ty-btn opacity must be 1 after 1600ms, got ${tyBtnOpacity}`);
    console.log('📸 7/7 Capturing slide-07-thank-you.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-07-thank-you.png') });

    // Native <dialog> SlideOverview checks + screenshot
    await runModalChecks(page);

    assert.equal(consoleErrors.length, 0, `Console errors detected: ${consoleErrors.join(' | ')}`);
    assert.equal(consoleWarnings.length, 0, `Console warnings detected: ${consoleWarnings.join(' | ')}`);
    assert.equal(pageErrors.length, 0, `Page errors detected: ${pageErrors.join(' | ')}`);

    await page.close();

    // Reduced-motion checks
    await runReducedMotionChecks(browser, BASE_URL);

    // Multi-viewport layout & overflow checks
    await runViewportLayoutChecks(browser, BASE_URL);

    console.log('\n=======================================');
    console.log('🎉 ALL 7 SLIDES, MODAL, REDUCED MOTION & 5 VIEWPORTS VERIFIED!');
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Console Warnings: ${consoleWarnings.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);
    console.log('=======================================\n');
  } catch (err) {
    console.error('❌ QA Verification Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (previewProc && !previewProc.killed) {
      previewProc.kill('SIGTERM');
    }
  }
}

runQATest();
