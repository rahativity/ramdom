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

async function getHeaderIndicatorText(page) {
  return page.evaluate(() => {
    const header = document.querySelector('header');
    const indicator = header?.firstElementChild;
    return indicator ? (indicator.textContent || '').replace(/\s+/g, ' ').trim() : '';
  });
}

async function waitForAnimationSettle(ms = 900) {
  await sleep(ms);
}

async function jumpToSlideViaOverview(page, slideIndex, settleMs = 950) {
  const targetLabel = `0${slideIndex + 1} / 07`;
  const isOpen = await page.evaluate(() => Boolean(document.querySelector('dialog')?.open));
  if (!isOpen) {
    await page.keyboard.press('KeyO');
    await page.waitForFunction(() => document.querySelector('dialog')?.open === true, {
      timeout: 3000,
    });
    await sleep(150);
  }

  await page.evaluate((label) => {
    const buttons = Array.from(document.querySelectorAll('dialog button'));
    const target = buttons.find((b) => b.textContent?.includes(label));
    if (!target) {
      throw new Error(`Slide button "${label}" not found inside <dialog>`);
    }
    target.click();
  }, targetLabel);

  await page.waitForFunction(() => document.querySelector('dialog')?.open === false, {
    timeout: 3000,
  });
  await sleep(settleMs);

  const indicatorText = await getHeaderIndicatorText(page);
  assert.equal(
    indicatorText,
    targetLabel,
    `Header left indicator must be strictly "${targetLabel}", got "${indicatorText}"`
  );
}

async function stepBeatsAndCheckStages(page, expectedStages) {
  for (const expectedStage of expectedStages) {
    await page.keyboard.press('ArrowRight');
    await sleep(320);
    const stagePresent = await page.evaluate(
      (stage) => document.querySelector('main')?.innerText.includes(stage) ?? false,
      expectedStage
    );
    assert.equal(
      stagePresent,
      true,
      `Slide stage indicator did not update to "${expectedStage}"`
    );
  }
  await sleep(700);
}

async function stepBeats(page, steps) {
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(320);
  }
  await sleep(700);
}

async function collectViewportMetrics(page, checkDesktop, currentIdx) {
  return page.evaluate((isDesktop, slideIdx) => {
    const docEl = document.documentElement;
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const mainRect = main ? main.getBoundingClientRect() : null;

    // Minimal header verification: strictly `0N / 07`, zero jump-dot buttons, zero STAGE dot circles
    const indicator = header?.firstElementChild;
    const indicatorText = indicator ? (indicator.textContent || '').replace(/\s+/g, ' ').trim() : '';
    const expectedIndicator = `0${slideIdx + 1} / 07`;
    const indicatorButtonCount = indicator ? indicator.querySelectorAll('button').length : 0;
    const jumpDotCount = document.querySelectorAll('button[aria-label^="Jump to slide"]').length;
    const headerHasStageText = header ? header.textContent?.toUpperCase().includes('STAGE') ?? false : false;
    const headerStageGroups = header ? header.querySelectorAll('[role="group"][aria-label^="Stage"]').length : 0;

    // Interactive buttons inside <header> must all satisfy >= 24x24px target size
    const headerButtons = header ? Array.from(header.querySelectorAll('button')) : [];
    const visibleHeaderButtons = headerButtons.filter((b) => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const smallHeaderButtons = visibleHeaderButtons
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { label: b.getAttribute('aria-label'), w: r.width, h: r.height };
      })
      .filter((b) => b.w < 24 || b.h < 24);

    // Calm static corner background assertions (zero side-rail GSAP/CSS artifacts)
    const bgContainer = document.querySelector('div[aria-hidden="true"]');
    const forbiddenBgSelectors = [
      '.bg-packet',
      '.bg-float',
      '.bg-pulse',
      '.bg-trace-left',
      '.bg-trace-right',
      '.bg-node-left',
      '.bg-node-right',
    ];
    const forbiddenBgCount = bgContainer
      ? bgContainer.querySelectorAll(forbiddenBgSelectors.join(', ')).length
      : 0;
    const docForbiddenBgCount = document.querySelectorAll(forbiddenBgSelectors.join(', ')).length;

    const bgSvgs = bgContainer ? Array.from(bgContainer.querySelectorAll('svg')) : [];
    const visibleCornerSvgs = bgSvgs.filter((s) => {
      const r = s.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const invalidAspectSvgs = bgSvgs
      .map((s) => s.getAttribute('preserveAspectRatio') || '')
      .filter((par) => !par.endsWith('meet') || par.includes('slice'));

    const clippedCornerShapes = [];
    for (const svgEl of visibleCornerSvgs) {
      const svgRect = svgEl.getBoundingClientRect();
      for (const shape of svgEl.querySelectorAll('path, rect, polygon, circle')) {
        const sr = shape.getBoundingClientRect();
        if (sr.width <= 0 || sr.height <= 0) continue;
        if (
          sr.left < svgRect.left - 2 ||
          sr.right > svgRect.right + 2 ||
          sr.top < svgRect.top - 2 ||
          sr.bottom > svgRect.bottom + 2
        ) {
          clippedCornerShapes.push(
            `${shape.tagName}(${Math.round(sr.left)},${Math.round(sr.top)}..${Math.round(sr.right)},${Math.round(sr.bottom)} vs svg ${Math.round(svgRect.left)},${Math.round(svgRect.top)}..${Math.round(svgRect.right)},${Math.round(svgRect.bottom)})`
          );
        }
      }
    }

    // Horizontal & vertical overflow checks
    const docHorizOverflow = docEl.scrollWidth > docEl.clientWidth;
    const mainHorizOverflow = main ? main.scrollWidth > main.clientWidth : false;
    const headerOverflow = header ? header.scrollWidth > header.clientWidth : false;

    const slideRoot = main?.firstElementChild?.firstElementChild?.firstElementChild;
    const mainVertOverflow = main ? main.scrollHeight > main.clientHeight + 2 : false;
    const slideVertOverflow = slideRoot ? slideRoot.scrollHeight > slideRoot.clientHeight + 2 : false;

    // Slide-specific geometry checks (alignment & card height parity on desktop)
    const extraIssues = [];
    if (isDesktop && slideIdx === 1) {
      const cards = Array.from(document.querySelectorAll('.overview-card > div'));
      if (cards.length === 3) {
        const heights = cards.map((c) => c.getBoundingClientRect().height);
        const spread = Math.max(...heights) - Math.min(...heights);
        if (spread > 2) {
          extraIssues.push(`Slide 02 card height mismatch: ${heights.map((h) => h.toFixed(1)).join('/')}`);
        }
      }
    }
    if (isDesktop && slideIdx === 2) {
      const cols = Array.from(document.querySelectorAll('.dp-panel > div, .dp-panel + div > div'));
      if (cols.length === 2) {
        const diff = Math.abs(cols[0].getBoundingClientRect().height - cols[1].getBoundingClientRect().height);
        if (diff > 2) extraIssues.push(`Slide 03 column height mismatch: ${diff.toFixed(1)}px`);
      }
    }
    if (isDesktop && slideIdx === 3) {
      const cols = Array.from(document.querySelectorAll('.ctrl-panel > div, .ctrl-panel + div > div'));
      if (cols.length === 2) {
        const diff = Math.abs(cols[0].getBoundingClientRect().height - cols[1].getBoundingClientRect().height);
        if (diff > 2) extraIssues.push(`Slide 04 column height mismatch: ${diff.toFixed(1)}px`);
      }
    }
    if (isDesktop && slideIdx === 4) {
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

    // Check no visible interactive/content element overflows viewport horizontally
    const interactiveOverflow = Array.from(document.querySelectorAll('main button, main h1, main h2, main svg'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > docEl.clientWidth + 1);
      })
      .map((el) => el.tagName);

    return {
      indicatorText,
      expectedIndicator,
      indicatorButtonCount,
      jumpDotCount,
      headerHasStageText,
      headerStageGroups,
      visibleHeaderButtonCount: visibleHeaderButtons.length,
      smallHeaderButtons,
      hasBgContainer: !!bgContainer,
      forbiddenBgCount,
      docForbiddenBgCount,
      visibleCornerSvgCount: visibleCornerSvgs.length,
      invalidAspectSvgs,
      clippedCornerShapes,
      docHorizOverflow,
      mainHorizOverflow,
      mainVertOverflow,
      slideVertOverflow,
      headerOverflow,
      interactiveOverflow,
      extraIssues,
      mainDims: mainRect ? { h: mainRect.height, scrollH: main?.scrollHeight } : null,
      slideDims: slideRoot ? { h: slideRoot.clientHeight, scrollH: slideRoot.scrollHeight } : null,
    };
  }, checkDesktop, currentIdx);
}

function assertViewportMetrics(metrics, labelPrefix, checkDesktop) {
  assert.equal(
    metrics.indicatorText,
    metrics.expectedIndicator,
    `${labelPrefix}: <header> left indicator must be strictly "${metrics.expectedIndicator}", got "${metrics.indicatorText}"`
  );
  assert.equal(
    metrics.indicatorButtonCount,
    0,
    `${labelPrefix}: <header> left indicator must contain 0 buttons`
  );
  assert.equal(
    metrics.jumpDotCount,
    0,
    `${labelPrefix}: removed Jump-to-slide dot buttons must not exist`
  );
  assert.equal(
    metrics.headerHasStageText,
    false,
    `${labelPrefix}: <header> must not contain STAGE text/dots`
  );
  assert.equal(
    metrics.headerStageGroups,
    0,
    `${labelPrefix}: <header> must not contain Stage dot groups`
  );
  assert.ok(
    metrics.visibleHeaderButtonCount >= 5,
    `${labelPrefix}: expected >= 5 visible buttons in <header>, got ${metrics.visibleHeaderButtonCount}`
  );
  assert.deepEqual(
    metrics.smallHeaderButtons,
    [],
    `${labelPrefix}: <header> button below 24x24px target size: ${JSON.stringify(metrics.smallHeaderButtons)}`
  );

  assert.equal(metrics.hasBgContainer, true, `${labelPrefix}: background div[aria-hidden="true"] missing`);
  assert.equal(
    metrics.forbiddenBgCount,
    0,
    `${labelPrefix}: side-rail animated classes found in background container`
  );
  assert.equal(
    metrics.docForbiddenBgCount,
    0,
    `${labelPrefix}: side-rail animated classes found in document`
  );
  assert.ok(
    metrics.visibleCornerSvgCount >= 2,
    `${labelPrefix}: expected >= 2 visible corner background SVGs, got ${metrics.visibleCornerSvgCount}`
  );
  assert.deepEqual(
    metrics.invalidAspectSvgs,
    [],
    `${labelPrefix}: corner SVG preserveAspectRatio must end in "meet" and never use "slice": ${JSON.stringify(metrics.invalidAspectSvgs)}`
  );
  assert.deepEqual(
    metrics.clippedCornerShapes,
    [],
    `${labelPrefix}: corner SVG shape escaped bounding box: ${metrics.clippedCornerShapes.join(', ')}`
  );

  assert.equal(metrics.docHorizOverflow, false, `${labelPrefix}: document horizontal overflow detected`);
  assert.equal(metrics.mainHorizOverflow, false, `${labelPrefix}: <main> horizontal overflow detected`);
  assert.equal(metrics.headerOverflow, false, `${labelPrefix}: <header> horizontal overflow detected`);
  assert.deepEqual(
    metrics.interactiveOverflow,
    [],
    `${labelPrefix}: element overflowed viewport: ${metrics.interactiveOverflow.join(', ')}`
  );

  if (checkDesktop) {
    assert.equal(
      metrics.mainVertOverflow,
      false,
      `${labelPrefix}: desktop vertical clipping in <main> (${JSON.stringify(metrics.mainDims)})`
    );
    assert.equal(
      metrics.slideVertOverflow,
      false,
      `${labelPrefix}: desktop vertical clipping in slide container (${JSON.stringify(metrics.slideDims)})`
    );
    assert.deepEqual(
      metrics.extraIssues,
      [],
      `${labelPrefix}: layout issue -> ${metrics.extraIssues.join('; ')}`
    );
  }
}

async function runModalChecks(page) {
  console.log('🧪 Verifying native <dialog> SlideOverview & keyboard guards...');

  // Open via KeyO from Slide 07
  await page.keyboard.press('KeyO');
  await page.waitForFunction(() => document.querySelector('dialog')?.open === true, { timeout: 3000 });
  await sleep(300);

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

  // Verify ArrowRight / ArrowLeft / Home / End while modal is open do NOT close modal or change underlying slide
  const beforeGuard = await getHeaderIndicatorText(page);
  await page.keyboard.press('ArrowRight');
  await sleep(150);
  await page.keyboard.press('ArrowLeft');
  await sleep(150);
  await page.keyboard.press('Home');
  await sleep(150);
  await page.keyboard.press('End');
  await sleep(200);
  const guardState = await page.evaluate(() => ({
    dialogOpen: document.querySelector('dialog')?.open ?? false,
    indicator: (document.querySelector('header')?.firstElementChild?.textContent || '').replace(/\s+/g, ' ').trim(),
  }));
  assert.equal(guardState.dialogOpen, true, '<dialog> must remain open after Arrow/Home/End keys');
  assert.equal(
    guardState.indicator,
    beforeGuard,
    `Keyboard navigation leaked behind open SlideOverview (${beforeGuard} -> ${guardState.indicator})`
  );

  // Verify clicking a slide thumbnail jumps to that slide AND closes the dialog
  await jumpToSlideViaOverview(page, 3, 900);

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

  // Rapid End -> Home interruption test (must not get dropped by transition lock)
  await page.keyboard.press('End');
  await sleep(120);
  await page.keyboard.press('Home');
  await sleep(900);
  const homeHeader = await getHeaderIndicatorText(page);
  assert.equal(homeHeader, '01 / 07', `Rapid End -> Home must land on 01 / 07, got: ${homeHeader}`);
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

  // Visit every slide via KeyO -> <dialog> and check animated selectors immediately reach opacity: 1
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
    if (i > 0) {
      await jumpToSlideViaOverview(page, i, 250);
    }

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
  await jumpToSlideViaOverview(page, 2, 300);
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

  console.log('📐 Running multi-viewport layout, minimal header & corner SVG bounding-box checks...');

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
      if (slideIdx > 0) {
        await jumpToSlideViaOverview(page, slideIdx, 950);
      }

      const metrics = await collectViewportMetrics(page, vp.isDesktop, slideIdx);
      assertViewportMetrics(metrics, `${vp.name} Slide 0${slideIdx + 1}`, vp.isDesktop);
    }

    assert.equal(vpErrors.length, 0, `${vp.name} console/page errors: ${vpErrors.join(' | ')}`);
    assert.equal(vpWarnings.length, 0, `${vp.name} console warnings: ${vpWarnings.join(' | ')}`);
    console.log(`  ✅ ${vp.name}: all 7 slides passed (minimal header, calm corner SVGs, 0 overflow, 0 warnings/errors)`);

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
    assertViewportMetrics(await collectViewportMetrics(page, true, 0), '1440x810 Capture Slide 01', true);
    console.log('📸 1/7 Capturing slide-01-welcome.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-01-welcome.png') });

    // Slide 02: Overview
    console.log('👉 Navigating to Slide 02...');
    await jumpToSlideViaOverview(page, 1, 1000);
    assertViewportMetrics(await collectViewportMetrics(page, true, 1), '1440x810 Capture Slide 02', true);
    console.log('📸 2/7 Capturing slide-02-overview.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-02-overview.png') });

    // Slide 03: Data Path (Stage 1 / 4 -> Stage 4 / 4 so 5 + 3 = 8 shows completely)
    console.log('👉 Navigating to Slide 03 (verifying Stage 1 / 4 -> Stage 4 / 4: 5 + 3 = 8)...');
    await jumpToSlideViaOverview(page, 2, 1000);
    const slide3Init = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
    assert.ok(
      slide3Init.includes('Stage 1 / 4') && slide3Init.includes('Step 0/3 • Inputs: 5, 3'),
      `Slide 03 did not start at Stage 1 / 4. Observed: ${slide3Init}`
    );
    await stepBeatsAndCheckStages(page, ['Stage 2 / 4', 'Stage 3 / 4', 'Stage 4 / 4']);
    const slide3Text = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
    assert.ok(
      slide3Text.includes('Step 3/3 • Result: 8') && slide3Text.includes('Stage 4 / 4'),
      `Slide 03 did not reach Beat 3 (Result: 8). Observed: ${slide3Text}`
    );
    assertViewportMetrics(await collectViewportMetrics(page, true, 2), '1440x810 Capture Slide 03', true);
    console.log('📸 3/7 Capturing slide-03-datapath.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-03-datapath.png') });

    // Slide 04: Controller (Stage 1 / 3 -> Stage 3 / 3 so signals dispatch)
    console.log('👉 Navigating to Slide 04 (verifying Stage 1 / 3 -> Stage 3 / 3: Signals Dispatched)...');
    await jumpToSlideViaOverview(page, 3, 1000);
    const slide4Init = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
    assert.ok(
      slide4Init.includes('Stage 1 / 3') && slide4Init.includes('Step 1/3 • Instruction Ready'),
      `Slide 04 did not start at Stage 1 / 3. Observed: ${slide4Init}`
    );
    await stepBeatsAndCheckStages(page, ['Stage 2 / 3', 'Stage 3 / 3']);
    const slide4Text = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
    assert.ok(
      slide4Text.includes('Step 3/3 • Signals Dispatched') && slide4Text.includes('Stage 3 / 3'),
      `Slide 04 did not reach Beat 2 (Signals Dispatched). Observed: ${slide4Text}`
    );
    assertViewportMetrics(await collectViewportMetrics(page, true, 3), '1440x810 Capture Slide 04', true);
    console.log('📸 4/7 Capturing slide-04-controller.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-04-controller.png') });

    // Slide 05: Key Differences & Balance Scale
    console.log('👉 Navigating to Slide 05...');
    await jumpToSlideViaOverview(page, 4, 1300);
    assertViewportMetrics(await collectViewportMetrics(page, true, 4), '1440x810 Capture Slide 05', true);
    console.log('📸 5/7 Capturing slide-05-comparison.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-05-comparison.png') });

    // Slide 06: Working Together (step 3 times -> Beat 3: WRITE BACK)
    console.log('👉 Navigating to Slide 06 (stepping 3x to Beat 3: WRITE BACK)...');
    await jumpToSlideViaOverview(page, 5, 1000);
    await stepBeats(page, 3);
    assertViewportMetrics(await collectViewportMetrics(page, true, 5), '1440x810 Capture Slide 06', true);
    console.log('📸 6/7 Capturing slide-06-working-together.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'slide-06-working-together.png') });

    // Slide 07: Thank You (wait 1600ms so .ty-btn & .ty-summary settle completely)
    console.log('👉 Navigating to Slide 07 (waiting 1600ms for full entrance)...');
    await jumpToSlideViaOverview(page, 6, 1600);
    const tyBtnOpacity = await page.evaluate(() => {
      const btn = document.querySelector('.ty-btn');
      return btn ? window.getComputedStyle(btn).opacity : null;
    });
    assert.equal(tyBtnOpacity, '1', `Slide 07 .ty-btn opacity must be 1 after 1600ms, got ${tyBtnOpacity}`);
    assertViewportMetrics(await collectViewportMetrics(page, true, 6), '1440x810 Capture Slide 07', true);
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
