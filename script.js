/* script.js
   Behavior:
   - 3-second countdown with animated hearts background
   - After countdown: reveal main stage, show HAPPY BIRTHDAY popup + fireworks, autoplay "happy-birthday.mp3"
   - Card flip opens diary (flip animation already in CSS); when clicked, diary flips in
*/

(function () {
  // DOM
  const overlay = document.getElementById('countdownOverlay');
  const countNumber = document.getElementById('countNumber');
  const mainStage = document.getElementById('mainStage');
  const popup = document.getElementById('revealPopup');
  const popupMsg = popup.querySelector('.message');
  const music = document.getElementById('music');
  const card = document.getElementById('card');
  const diary = document.getElementById('diary');
  const fwCanvas = document.getElementById('fwCanvas');

  // CONFIG
  const COUNT_SECONDS = 3; // your requested 3 seconds
  const MUSIC_FILE = 'happy-birthday.mp3'; // must exist in same folder

  // prepare music src (already in HTML). We will try to play after reveal.
  music.addEventListener('error', () => {
    console.warn('Audio failed to load. Ensure', MUSIC_FILE, 'is in the same folder.');
  });

  // ---------- HEARTS BACKGROUND (create animated hearts) ----------
  (function makeHearts() {
    const container = document.querySelector('.hearts-bg');
    if (!container) return;
    const total = 22;
    for (let i = 0; i < total; i++) {
      const el = document.createElement('div');
      el.className = 'h';
      const size = Math.round(12 + Math.random() * 26);
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.round(Math.random() * 100) + '%';
      el.style.bottom = -50 - Math.round(Math.random() * 120) + 'px';
      const delay = (Math.random() * 1.5).toFixed(2);
      const duration = (4 + Math.random() * 4).toFixed(2);
      el.style.animation = `rise ${duration}s linear ${delay}s infinite`;
      // color tint
      const color = `hsla(${330 - Math.random()*60}deg, 70%, ${50 - Math.random()*10}%, .95)`;
      el.querySelectorAll(':scope::before'); // noop to satisfy some linters
      // use pseudo elements CSS already defined; set custom property for transform size by scale
      el.style.setProperty('--color', color);
      container.appendChild(el);
    }

    // add keyframes dynamically (so the CSS file remains simple)
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rise {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; transform-origin:center; }
        10% { opacity: 1; }
        100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
      }
      .hearts-bg .h:before, .hearts-bg .h:after {
        background:var(--heart-color, rgba(210,20,100,0.95));
      }
      .hearts-bg .h { --heart-color: rgba(210,20,100,0.95);}
      /* give each heart a layered look using radial gradient via background */
    `;
    document.head.appendChild(style);
  })();

  // ---------- COUNTDOWN ----------
  (function countdown() {
    let t = COUNT_SECONDS;
    countNumber.textContent = String(t);
    // decrement visually each second
    const interval = setInterval(() => {
      t -= 1;
      if (t <= 0) {
        clearInterval(interval);
        // small fade-out for overlay
        overlay.classList.remove('show');
        overlay.style.transition = 'opacity .45s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 600);

        // reveal main and trigger reveal actions
        revealMain();
      } else {
        // animate number change
        countNumber.classList.remove('pop');
        void countNumber.offsetWidth;
        countNumber.classList.add('pop');
        countNumber.textContent = String(t);
      }
    }, 1000);
  })();

  // ---------- REVEAL MAIN + PLAY MUSIC + POPUP ----------
  function revealMain() {
    // show main stage
    mainStage.removeAttribute('aria-hidden');
    // immediately show HAPPY BIRTHDAY popup and play music (you chose A)
    showPopupAndPlay();
  }

  async function showPopupAndPlay() {
    // try to play music. Browsers may block autoplay; we will politely try and fallback.
    try {
      await music.play();
    } catch (err) {
      // autoplay blocked — create a small unobtrusive 'Play' button to let user enable
      createPlayButton();
    }

    // show popup and start fireworks
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    startFireworks();

    // hide popup after 6s
    setTimeout(() => {
      stopFireworks();
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
    }, 6000);
  }

  function createPlayButton() {
    const btn = document.createElement('button');
    btn.textContent = '▶ Play Birthday Song';
    btn.style.position = 'fixed';
    btn.style.right = '18px';
    btn.style.bottom = '18px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 14px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.background = 'linear-gradient(90deg,#d4af37,#f6d67a)';
    btn.style.color = '#081018';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', async () => {
      try { await music.play(); btn.remove(); } catch (e) { alert('Playback failed'); }
    });
    document.body.appendChild(btn);
  }

  // ---------- CARD click -> flip and open diary ----------
  card.addEventListener('click', async () => {
    if (card.classList.contains('opened')) return;
    card.classList.add('opened');
    // Wait for flip to finish then show diary
    setTimeout(() => {
      diary.classList.add('open');
      diary.setAttribute('aria-hidden', 'false');
    }, 1050);
  });

  // ---------- FIREWORKS (simple particle system) ----------
  (function fireworksSetup() {
    const ctx = fwCanvas.getContext('2d');
    let W = fwCanvas.width = innerWidth;
    let H = fwCanvas.height = innerHeight;
    let raf = null;
    const particles = [];

    function resize() { W = fwCanvas.width = innerWidth; H = fwCanvas.height = innerHeight; }
    addEventListener('resize', resize);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class Particle {
      constructor(x, y, vx, vy, color) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.color = color;
        this.life = rand(50, 120); this.age = 0;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.vy += 0.06; this.vx *= 0.998; this.age++;
      }
      draw() {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, 3 - this.age * 0.02), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function burst(x, y, count) {
      const hues = [40, 50, 200, 320, 260, 120];
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const s = rand(2, 7);
        const color = `hsl(${hues[i % hues.length]} ${rand(60,85)}% ${rand(45,65)}%)`;
        particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, color));
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(); p.draw();
        if (p.age > p.life) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    }

    window.startFireworks = function () {
      // create a few bursts across the screen
      burst(W * 0.2, H * 0.45, 60);
      burst(W * 0.5, H * 0.35, 80);
      burst(W * 0.8, H * 0.52, 64);
      if (!raf) raf = requestAnimationFrame(loop);
      // also schedule additional random bursts for a short time for richness
      let extra = 3;
      const t = setInterval(() => {
        burst(rand(0.15 * W, 0.85 * W), rand(0.25 * H, 0.6 * H), Math.round(rand(40, 80)));
        extra--; if (extra <= 0) clearInterval(t);
      }, 700);
    };

    window.stopFireworks = function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      ctx.clearRect(0, 0, W, H);
      particles.length = 0;
    };
  })();

  // Ensure clean up if user navigates away
  addEventListener('visibilitychange', () => {
    if (document.hidden) {
      music.pause();
      if (window.stopFireworks) window.stopFireworks();
    }
  });
})();