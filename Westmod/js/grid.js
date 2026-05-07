(function () {
  const canvas = document.getElementById("dashedGridCanvas");
  const heroSection = document.getElementById("heroSection");
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext("2d");

  // ── Config (dynamic) ────────────────────
  let CELL = 90; // grid cell size (updated on resize)
  let DOT_RADIUS = 3.5; // intersection dot size
  const DOT_COLOR = "180,180,180"; // base dot color
  let DASH_LEN = 14; // short dash length near dot
  let DASH_GAP = CELL - DASH_LEN * 2; // gap between dashes
  let LIT_RADIUS = 200; // blob glow spread
  const BLOB_COLOR = "45,83,144"; // #2D5390
  let BLOB_W = 18;
  let BLOB_H = 2;
  let BLOB_GLOW = 45;
  let BLOB_SPEED = 3.0;
  let SEG_COUNT = 18; // number of random flashing segments
  const SEG_DURATION = [60, 140]; // min/max frames a segment stays visible

  function updateConfig(width) {
    // adjust cell size by width breakpoints
    if (width >= 1400) CELL = 110;
    else if (width >= 1000) CELL = 90;
    else if (width >= 768) CELL = 72;
    else if (width >= 548) CELL = 56;
    else CELL = 44;

    const scale = CELL / 90; // base scale relative to original
    DOT_RADIUS = Math.max(1.8, 3.5 * scale);
    DASH_LEN = Math.max(6, Math.round(14 * scale));
    DASH_GAP = Math.max(8, CELL - DASH_LEN * 2);
    LIT_RADIUS = Math.round(200 * scale);
    BLOB_W = Math.max(8, 18 * scale);
    BLOB_H = Math.max(1, 2 * scale);
    BLOB_GLOW = Math.max(12, Math.round(45 * scale));
    BLOB_SPEED = Math.max(1.2, 3.0 * scale);

    // fewer segments on smaller screens to reduce noise and CPU
    SEG_COUNT = width < 600 ? 8 : width < 1000 ? 12 : 18;
  }
  // ────────────────────────────────────────

  let W, H;
  let xs = [];
  let ys = [];
  let dotPhases = {}; // blink timing per dot
  let flashSegs = []; // random flashing line segments

  // ── Two blobs ───────────────────────────
  let blobV = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    moving: "v",
    stepDir: 1,
    colI: 0,
  };
  let blobH = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    moving: "h",
    stepDir: 1,
    rowI: 0,
  };

  // ── Build grid data ──────────────────────
  function buildGrid() {
    xs = [];
    ys = [];
    for (let x = CELL; x < W; x += CELL) xs.push(x);
    for (let y = CELL; y < H; y += CELL) ys.push(y);

    // random blink phase per dot
    dotPhases = {};
    for (const x of xs) {
      for (const y of ys) {
        dotPhases[`${x},${y}`] = Math.random() * Math.PI * 2;
      }
    }

    initFlashSegs();
  }

  // ── Flash segments — random line pieces that appear/disappear ──
  function randomSeg() {
    // pick random intersection
    const xi = Math.floor(Math.random() * (xs.length - 1));
    const yi = Math.floor(Math.random() * (ys.length - 1));
    // pick horizontal or vertical
    const dir = Math.random() > 0.5 ? "h" : "v";
    const ttl =
      SEG_DURATION[0] +
      Math.floor(Math.random() * (SEG_DURATION[1] - SEG_DURATION[0]));
    return {
      xi,
      yi,
      dir,
      age: 0,
      ttl, // total life in frames
      alpha: 0,
    };
  }

  function initFlashSegs() {
    flashSegs = [];
    for (let i = 0; i < SEG_COUNT; i++) {
      const s = randomSeg();
      s.age = Math.floor(Math.random() * s.ttl); // stagger start
      flashSegs.push(s);
    }
  }

  function updateFlashSegs() {
    for (const s of flashSegs) {
      s.age++;
      // fade in first 20% of life, fade out last 20%
      const progress = s.age / s.ttl;
      if (progress < 0.2) {
        s.alpha = progress / 0.2;
      } else if (progress > 0.8) {
        s.alpha = (1 - progress) / 0.2;
      } else {
        s.alpha = 1;
      }
      // respawn when dead
      if (s.age >= s.ttl) Object.assign(s, randomSeg());
    }
  }

  // ── Blob target picking ──────────────────
  function pickTarget(blob) {
    if (blob.moving === "v") {
      let curYi = ys.indexOf(blob.y);
      let nextYi = curYi + blob.stepDir;

      if (nextYi >= ys.length || nextYi < 0) {
        // column done — jump to random column (not next one)
        let randomCol = Math.floor(Math.random() * xs.length);
        // make sure it's not the same column
        while (randomCol === blob.colI) {
          randomCol = Math.floor(Math.random() * xs.length);
        }
        blob.colI = randomCol;

        // instant teleport to top of random column
        blob.x = xs[blob.colI];
        blob.y = ys[0];
        blob.targetX = xs[blob.colI];
        blob.targetY = ys[0];
        nextYi = 0;
      }

      blob.targetX = xs[blob.colI];
      blob.targetY = ys[nextYi];
    } else {
      let curXi = xs.indexOf(blob.x);
      let nextXi = curXi + blob.stepDir;

      if (nextXi >= xs.length || nextXi < 0) {
        // row done — jump to random row (not next one)
        let randomRow = Math.floor(Math.random() * ys.length);
        // make sure it's not the same row
        while (randomRow === blob.rowI) {
          randomRow = Math.floor(Math.random() * ys.length);
        }
        blob.rowI = randomRow;

        // instant teleport to left of random row
        blob.x = xs[0];
        blob.y = ys[blob.rowI];
        blob.targetX = xs[0];
        blob.targetY = ys[blob.rowI];
        nextXi = 0;
      }

      blob.targetX = xs[nextXi];
      blob.targetY = ys[blob.rowI];
    }
  }

  function initBlobs() {
    if (xs.length < 2 || ys.length < 2) return;

    // blobV — starts top of first column, moves down
    blobV.colI = 0;
    blobV.stepDir = 1; // down
    blobV.x = blobV.targetX = xs[0];
    blobV.y = blobV.targetY = ys[0];
    pickTarget(blobV);

    // blobH — starts left of last row, moves right
    blobH.rowI = ys.length - 1;
    blobH.stepDir = 1; // right
    blobH.x = blobH.targetX = xs[0];
    blobH.y = blobH.targetY = ys[ys.length - 1];
    pickTarget(blobH);
  }

  function moveBlob(blob) {
    const dx = blob.targetX - blob.x;
    const dy = blob.targetY - blob.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= BLOB_SPEED) {
      blob.x = blob.targetX;
      blob.y = blob.targetY;
      pickTarget(blob);
    } else {
      blob.x += (dx / dist) * BLOB_SPEED;
      blob.y += (dy / dist) * BLOB_SPEED;
    }
  }

  function litAmount(blob, x, y) {
    const dx = x - blob.x;
    const dy = y - blob.y;
    return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / LIT_RADIUS);
  }

  function totalLit(x, y) {
    return Math.min(1, litAmount(blobV, x, y) + litAmount(blobH, x, y));
  }

  // ── Draw ────────────────────────────────

  function drawDots(time) {
    for (const x of xs) {
      for (const y of ys) {
        const phase = dotPhases[`${x},${y}`];
        const blink = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 0.002 + phase));
        const lit = totalLit(x, y);

        let r, g, b, a;
        if (lit > 0.05) {
          r = Math.round(237 - lit * (237 - 45));
          g = Math.round(237 - lit * (237 - 83));
          b = Math.round(237 - lit * (237 - 144));
          a = blink * (0.25 + lit * 0.3);
        } else {
          g = 180;
          b = 180;
          r = 180;
          a = 0.09;
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /*
   * drawShortDashes()
   * Draws short dashes near each dot — not full cell lines
   * Each dot gets a short dash going right and a short dash going down
   * Looks like disconnected tick marks at intersections
   */
  function drawShortDashes() {
    ctx.setLineDash([]);
    ctx.lineWidth = 0.7;

    const GAP = Math.max(6, Math.round(15 * (CELL / 90))); // scale gap

    for (let i = 0; i < xs.length - 1; i++) {
      for (let j = 0; j < ys.length - 1; j++) {
        const x = xs[i];
        const y = ys[j];
        const lit = totalLit(x, y);
        const a = 0.07 + lit * 0.15;

        ctx.strokeStyle = `rgba(237,237,237,${a})`;

        // horizontal dash — gap on left (near dot) and gap on right (near next dot)
        ctx.beginPath();
        ctx.moveTo(x + DOT_RADIUS + GAP, y); // start after gap
        ctx.lineTo(xs[i + 1] - DOT_RADIUS - GAP, y); // end before next dot
        ctx.stroke();

        // vertical dash — gap on top (near dot) and gap on bottom (near next dot)
        ctx.beginPath();
        ctx.moveTo(x, y + DOT_RADIUS + GAP); // start after gap
        ctx.lineTo(x, ys[j + 1] - DOT_RADIUS - GAP); // end before next dot
        ctx.stroke();
      }
    }
  }

  /*
   * drawFlashSegs()
   * Random line segments (full cell width) that fade in and out
   * Simulates grid lines appearing and disappearing randomly
   */
  function drawFlashSegs() {
    ctx.lineWidth = 0.8;
    ctx.setLineDash([]);

    for (const s of flashSegs) {
      if (s.alpha <= 0.01) continue;
      if (s.xi >= xs.length - 1 || s.yi >= ys.length - 1) continue;

      const x0 = xs[s.xi];
      const y0 = ys[s.yi];
      const x1 = xs[s.xi + 1];
      const y1 = ys[s.yi + 1];

      ctx.strokeStyle = `rgba(180,180,180,${s.alpha * 0.13})`;
      ctx.beginPath();

      if (s.dir === "h") {
        // horizontal segment — full width of one cell
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y0);
      } else {
        // vertical segment — full height of one cell
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, y1);
      }

      ctx.stroke();
    }
  }

  function drawSingleBlob(blob) {
    ctx.save();
    const glow = ctx.createRadialGradient(
      blob.x,
      blob.y,
      0,
      blob.x,
      blob.y,
      BLOB_GLOW,
    );
    glow.addColorStop(0, `rgba(${BLOB_COLOR}, 0.28)`);
    glow.addColorStop(0.5, `rgba(${BLOB_COLOR}, 0.10)`);
    glow.addColorStop(1, `rgba(${BLOB_COLOR}, 0)`);
    ctx.filter = "blur(8px)";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, BLOB_GLOW, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(blob.x, blob.y);
    if (blob.moving === "v") ctx.rotate(Math.PI / 2);
    ctx.fillStyle = `rgba(${BLOB_COLOR}, 0.92)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, BLOB_W / 2, BLOB_H / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    updateFlashSegs();

    drawShortDashes(); // 1. short dashes near dots
    drawFlashSegs(); // 2. random flashing segments
    drawDots(time); // 3. blinking dots
    drawSingleBlob(blobV); // 4. vertical blob
    drawSingleBlob(blobH); // 5. horizontal blob

    moveBlob(blobV);
    moveBlob(blobH);

    requestAnimationFrame(draw);
  }

  function resize() {
    W = canvas.width = heroSection.offsetWidth;
    H = canvas.height = heroSection.offsetHeight;
    updateConfig(W);
    buildGrid();
    initBlobs();
  }

  function init() {
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
