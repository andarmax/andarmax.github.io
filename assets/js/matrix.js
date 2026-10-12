(function () {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const config = {
    chars: canvas.dataset.matrixChars || 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアンダー ANDAR @#$%&*',
    columnWidth: Number(canvas.dataset.matrixColumnWidth) || 14,
    rowHeight: Number(canvas.dataset.matrixRowHeight) || 16,
    fontSize: Number(canvas.dataset.matrixFontSize) || 16,
    frameInterval: Number(canvas.dataset.matrixFrameInterval) || 70,
    trailFill: canvas.dataset.matrixTrailFill || 'rgba(5,11,8,0.12)',
    resetChance: Number(canvas.dataset.matrixResetChance) || 0.975,
    colorMode: canvas.dataset.matrixColorMode || 'column-cycle',
    colors: (canvas.dataset.matrixColors || '#00ff41,#7fffbf,#00f5ff').split(',').map((color) => color.trim()).filter(Boolean),
    randomColorThreshold: Number(canvas.dataset.matrixRandomColorThreshold) || 0.85
  };

  function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  let drops = [];

  function init() {
    drops = Array.from({ length: Math.floor(canvas.width / config.columnWidth) }, () => Math.random() * -100);
  }

  function getColor(index) {
    if (config.colorMode === 'random-threshold' && config.colors.length > 1) {
      return Math.random() > config.randomColorThreshold ? config.colors[0] : config.colors[1];
    }
    return config.colors[index % config.colors.length] || '#00ff41';
  }

  function draw() {
    ctx.fillStyle = config.trailFill;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${config.fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = getColor(i);
      ctx.fillText(config.chars[Math.floor(Math.random() * config.chars.length)], i * config.columnWidth, drops[i] * config.rowHeight);
      if (drops[i] * config.rowHeight > canvas.height && Math.random() > config.resetChance) drops[i] = 0;
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
    if (time - lastTime > config.frameInterval) {
      draw();
      lastTime = time;
    }
    requestAnimationFrame(loop);
  }

  // Inject UI Pause/Resume Button
  const btn = document.createElement('button');
  btn.className = 'matrix-ctrl';
  btn.innerText = reducedMotion ? '▶ PLAY FX' : '⏸ PAUSE FX';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    isRunning = !isRunning;
    btn.innerText = isRunning ? '⏸ PAUSE FX' : '▶ PLAY FX';
    if (isRunning) requestAnimationFrame(loop);
  });

  if (!reducedMotion) {
    requestAnimationFrame(loop);
  } else {
    isRunning = false;
    draw();
  }
})();
