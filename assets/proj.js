// Recent work module: project list swaps one photo frame.
(() => { /* More projects: one frame, list swaps it */
  const root = document.querySelector('[data-proj]'); if (!root) return;
  const items = [...root.querySelectorAll('.proj-item')], sets = [...root.querySelectorAll('.proj-set')];
  const count = root.querySelector('.proj-count');
  const hover = matchMedia('(hover: hover)').matches, hint = root.querySelector('.proj-hint');
  const pick = i => {
    items.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i); });
    sets.forEach((s, k) => s.classList.toggle('is-on', k === i));
    count.textContent = sets[i].dataset.count;
    const one = sets[i].dataset.count === '1 photo';
    hint.textContent = '· ' + (hover ? 'Click' : 'Tap the photo') + (one ? ' to enlarge' : ' to see them all');
  };
  items.forEach((b, i) => {
    if (hover) b.addEventListener('mouseenter', () => pick(i));
    b.addEventListener('focus', () => pick(i));
    b.addEventListener('click', () => {
      if (b.classList.contains('is-on') && hover) sets[i].querySelector('a.gl').click(); else pick(i);
    });
  });
  pick(0);
  // Long lists start trimmed; one button shows the rest.
  const more = root.querySelector('.proj-more-btn');
  if (more) more.addEventListener('click', () => {
    root.classList.add('show-all'); more.remove();
    root.querySelector('.proj-item.is-extra')?.focus({ preventScroll: true });
  });
})();
