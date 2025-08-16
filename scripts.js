// Theme toggle with persistence
(function() {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const saved = localStorage.getItem('theme');
  const isLight = saved ? saved === 'light' : prefersLight;
  if (isLight) document.documentElement.classList.add('theme-light');

  function setTheme(light) {
    document.documentElement.classList.toggle('theme-light', light);
    localStorage.setItem('theme', light ? 'light' : 'dark');
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = light ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#themeToggle');
    if (!btn) return;
    const light = !document.documentElement.classList.contains('theme-light');
    setTheme(light);
  });

  // Navbar scroll style
  const nav = document.querySelector('.navbar-glass');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth close mobile navbar on link click
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const el = document.getElementById('navbars');
      if (el && el.classList.contains('show')) {
        const collapse = new bootstrap.Collapse(el);
        collapse.hide();
      }
    });
  });

  // Typewriter effect
  const typedEl = document.getElementById('typed');
  const phrases = [
    'Software Engineer',
    'ML Enthusiast',
    'Problem Solver',
    'Data‑Driven Builder'
  ];
  let p = 0, i = 0, deleting = false;
  function tick() {
    if (!typedEl) return;
    const full = phrases[p];
    if (!deleting) {
      i++;
      typedEl.textContent = full.slice(0, i);
      if (i === full.length) { deleting = true; setTimeout(tick, 1200); return; }
    } else {
      i--;
      typedEl.textContent = full.slice(0, i);
      if (i === 0) { deleting = false; p = (p + 1) % phrases.length; }
    }
    const delay = deleting ? 45 : 80;
    setTimeout(tick, delay);
  }
  setTimeout(tick, 600);

  // AOS animations
  if (window.AOS) {
    AOS.init({ duration: 650, once: true, offset: 80, easing: 'ease-out' });
  }

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Resume auto-detect: show Download button if assets/resume.pdf exists
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
      .then(r => { if (r.ok) resumeBtn.classList.remove('d-none'); })
      .catch(() => {});
  }

  // Back to top button behavior
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleTop = () => backToTop.classList.toggle('show', window.scrollY > 300);
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
