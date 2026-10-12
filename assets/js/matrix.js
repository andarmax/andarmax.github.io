(function () {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dataset = canvas.dataset;
  const chars = dataset.matrixChars || 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアンダー ANDAR @#$%&*';
  const colors = (dataset.matrixColors || '#00ff41,#7fffbf,#00f5ff').split(',').map((item) => item.trim()).filter(Boolean);
  const colorMode = dataset.matrixColorMode || 'cycle';
  const colorThreshold = Number(dataset.matrixColorThreshold || 0.85);
  const trailAlpha = Number(dataset.matrixTrailAlpha || 0.12);
  const frameInterval = Number(dataset.matrixFrameInterval || 70);
  const resetChance = Number(dataset.matrixResetChance || 0.975);
  const fontSize = Number(dataset.matrixFontSize || 16);
  const columnWidth = Number(dataset.matrixColumnWidth || 14);

  function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  let drops = [];

  function init() {
    drops = Array.from({ length: Math.floor(canvas.width / columnWidth) }, () => Math.random() * -100);
  }

  function draw() {
    ctx.fillStyle = `rgba(5,11,8,${trailAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      if (colorMode === 'random' && colors.length > 1) {
        ctx.fillStyle = Math.random() > colorThreshold ? colors[0] : colors[1];
      } else {
        ctx.fillStyle = colors[i % colors.length];
      }
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * columnWidth, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > resetChance) drops[i] = 0;
      drops[i]++;
    }
  }

  setSize();
  init();
  window.addEventListener('resize', () => { setSize(); init(); });

  let isRunning = true;
  let lastTime = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loop(time) {
    if (!isRunning) return;
    if (time - lastTime > frameInterval) {
      draw();
      lastTime = time;
    }
    requestAnimationFrame(loop);
  }

  // Inject UI Pause/Resume Button
  const btn = document.createElement('button');
  btn.className = 'matrix-ctrl';
  btn.type = 'button';
  btn.innerText = reducedMotion ? '▶ PLAY FX' : '⏸ PAUSE FX';
  btn.setAttribute('aria-label', reducedMotion ? 'Play Matrix animation effects' : 'Pause Matrix animation effects');
  btn.title = reducedMotion ? 'Play Matrix animation effects' : 'Pause Matrix animation effects';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    isRunning = !isRunning;
    btn.innerText = isRunning ? '⏸ PAUSE FX' : '▶ PLAY FX';
    btn.setAttribute('aria-label', isRunning ? 'Pause Matrix animation effects' : 'Play Matrix animation effects');
    btn.title = isRunning ? 'Pause Matrix animation effects' : 'Play Matrix animation effects';
    if (isRunning) requestAnimationFrame(loop);
  });

  if (!reducedMotion) {
    requestAnimationFrame(loop);
  } else {
    isRunning = false;
    draw();
  }
})();
