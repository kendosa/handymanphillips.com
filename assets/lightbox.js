/* Full screen photo viewer. Any a.gl inside a [data-gallery] opens it; arrows, swipe, Esc. */
(() => {
  let box, img, cap, count, items = [], i = 0, lastFocus;
  const build = () => {
    box = document.createElement('div');
    box.className = 'lb'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">×</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Previous photo">‹</button>' +
      '<figure class="lb-fig"><img alt=""><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Next photo">›</button>';
    document.body.appendChild(box);
    img = box.querySelector('img'); cap = box.querySelector('.lb-cap'); count = box.querySelector('.lb-count');
    box.querySelector('.lb-close').onclick = close;
    box.querySelector('.lb-prev').onclick = () => go(-1);
    box.querySelector('.lb-next').onclick = () => go(1);
    box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lb-fig')) close(); });
    let x0 = null;
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });
    document.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') { // keep focus inside the viewer
        const f = [...box.querySelectorAll('button')].filter(b => b.offsetParent);
        const k = f.indexOf(document.activeElement);
        if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  };
  const show = () => {
    const a = items[i], alt = a.dataset.alt || (a.querySelector('img') || {}).alt || '';
    img.src = a.href; img.alt = alt; cap.textContent = alt;
    count.textContent = items.length > 1 ? `${i + 1} / ${items.length}` : '';
    box.classList.toggle('lb-single', items.length < 2);
    [items[i + 1], items[i - 1]].forEach(n => { if (n) new Image().src = n.href; });
  };
  const go = d => { i = (i + d + items.length) % items.length; show(); };
  const open = (list, k) => {
    if (!box) build();
    items = list; i = k; lastFocus = document.activeElement;
    show(); box.hidden = false; document.documentElement.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
  };
  function close() {
    box.hidden = true; img.removeAttribute('src'); document.documentElement.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a.gl'); if (!a) return;
    const g = a.closest('[data-gallery]'); if (!g) return;
    e.preventDefault();
    const list = [...g.querySelectorAll('a.gl')];
    open(list, list.indexOf(a));
  });
})();
