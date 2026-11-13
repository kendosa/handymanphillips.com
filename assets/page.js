// Shared behavior for service pages: menu, scroll reveal, tap-to-reveal phone.
(() => {
  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a') && !e.defaultPrevented) nav.classList.remove('open'); });

  // Mobile menu: group heads expand their services instead of navigating.
  // An "All <group>" link (mobile only, via CSS) keeps the group page one tap away.
  const small = matchMedia('(max-width: 900px)');
  document.querySelectorAll('.nav-group').forEach(g => {
    const h = g.querySelector('.nav-group-h');
    if (!h || h.tagName !== 'A') return;
    const all = document.createElement('a');
    all.className = 'nav-all'; all.href = h.getAttribute('href');
    all.innerHTML = 'All ' + h.innerHTML + ' <span class="arrow">→</span>';
    h.after(all);
    h.setAttribute('aria-expanded', 'false');
    h.addEventListener('click', e => {
      if (!small.matches) return;
      e.preventDefault();
      const open = g.classList.toggle('open');
      h.setAttribute('aria-expanded', open);
    });
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Phone. Stored reversed and split so the number never appears in the page source;
  // assembled only when a visitor taps "Show number". One tap reveals it everywhere.
  (() => {
    const k = ['4053', '202', '548'];
    const d = k.join('').split('').reverse().join('');
    const shown = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    const tel = `tel:+1${d}`;
    const sms = `sms:+1${d}?&body=${encodeURIComponent('Hi Kenny, I found you on handymanphillips.com. I need help with ')}`;
    const spots = [...document.querySelectorAll('.ph-num')];
    spots.forEach(el => { el.dataset.hidden = el.innerHTML; });

    // Re-hide once the visitor moves on: scrolls ~400px away or off screen,
    // or (mouse only) moves the pointer more than 160px from the number.
    const SCROLL_AWAY = 400, POINTER_AWAY = 160, GRACE = 700;
    let anchor = null, y0 = 0, t0 = 0, io = null;
    const hide = () => {
      if (!anchor) return;
      const hadFocus = anchor.contains(document.activeElement);
      spots.forEach(el => { el.innerHTML = el.dataset.hidden; });
      bind();
      if (hadFocus) anchor.querySelector('.ph-show')?.focus({ preventScroll: true });
      anchor = null; io && io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
    const onScroll = () => { if (Date.now() - t0 > GRACE && Math.abs(window.scrollY - y0) > SCROLL_AWAY) hide(); };
    const onMove = e => {
      if (e.pointerType !== 'mouse' || Date.now() - t0 < GRACE || !anchor) return;
      const r = anchor.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) > POINTER_AWAY) hide();
    };
    const reveal = e => {
      anchor = e.currentTarget.closest('.ph-num');
      spots.forEach(el => {
        el.innerHTML = el.dataset.variant === 'row'
          ? `<a class="ph-big" href="${tel}">${shown}</a><a class="qe-copy" href="${sms}">Text</a><a class="qe-copy" href="${tel}">Call</a>`
          : `<a href="${tel}">${shown}</a><span class="ph-sep">·</span><a href="${sms}">Text</a>`;
      });
      anchor.querySelector('a')?.focus({ preventScroll: true });
      y0 = window.scrollY; t0 = Date.now();
      io = new IntersectionObserver(([en]) => { if (!en.isIntersecting && Date.now() - t0 > GRACE) hide(); });
      io.observe(anchor);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onMove, { passive: true });
    };
    const bind = () => document.querySelectorAll('.ph-show').forEach(b => b.addEventListener('click', reveal));
    bind();
  })();

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
