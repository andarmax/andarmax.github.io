(function () {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  const chars = 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアンダー ANDAR @#$%&*';
  let drops = [];

  function init() {
    drops = Array.from({ length: Math.floor(canvas.width / 14) }, () => Math.random() * -100);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5,11,8,0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px monospace';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = i % 3 === 0 ? '#00ff41' : i % 3 === 1 ? '#7fffbf' : '#00f5ff';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
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
    if (time - lastTime > 70) {
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
