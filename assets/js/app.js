(() => {
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  addEventListener('resize', resize);

  const particles = Array.from({ length: 42 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    r: Math.random() * 1.3 + .4
  }));

  function drawNetwork() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = innerWidth + 10;
      if (p.x > innerWidth + 10) p.x = -10;
      if (p.y < -10) p.y = innerHeight + 10;
      if (p.y > innerHeight + 10) p.y = -10;
    }

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);

        if (d < 145) {
          ctx.strokeStyle = `rgba(43, 165, 230, ${0.08 * (1 - d / 145)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = 'rgba(91, 211, 255, .45)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawNetwork);
  }

  drawNetwork();

  // Reveal sections smoothly as they enter view.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Graceful logo fallback if a CDN image fails.
  document.querySelectorAll('.logo-orbit img').forEach(img => {
    img.addEventListener('error', () => {
      const box = img.closest('.logo-orbit');
      if (!box) return;
      img.remove();
      box.classList.add('failed');
      box.textContent = box.dataset.name || 'TECH';
    });
  });

  // Hero logo fallback.
  document.querySelectorAll('.node-icon img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const parent = img.parentElement;
      parent.textContent = img.alt.slice(0, 3).toUpperCase();
      parent.style.fontFamily = '"JetBrains Mono", monospace';
      parent.style.fontWeight = '700';
      parent.style.color = '#75d8ff';
    });
  });
})();
