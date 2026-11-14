// Shared behavior for service pages: menu, scroll reveal.
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

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
