// Quote tools shared by the homepage and group pages: form submit, pre-filled
// quote email, rough price estimator. Needs #quoteForm, #qeBtn and .svc[data-svc] cards.
(() => {
  if (!document.getElementById('quoteForm')) return;
  // Quote form -> Formspree (form moeebkop). Without JS it still posts normally.
  const quoteForm = document.getElementById('quoteForm');
  quoteForm.addEventListener('submit', async e => {
    e.preventDefault();
    const note = document.getElementById('formNote'), btn = document.getElementById('formBtn');
    btn.disabled = true; btn.style.opacity = .6;
    try {
      const res = await fetch(quoteForm.action, { method: 'POST', body: new FormData(quoteForm), headers: { Accept: 'application/json' } });
      if (res.ok) {
        quoteForm.reset();
        note.textContent = "Thanks! Your request is in. I'll get back to you within 48 hours.";
      } else {
        const data = await res.json().catch(() => ({}));
        note.textContent = (data.errors && data.errors.map(x => x.message).join(' ')) || 'Something went wrong. Please email kenny@handymanphillips.com instead.';
      }
    } catch {
      note.textContent = 'Could not send. Please check your connection or email kenny@handymanphillips.com.';
    }
    note.classList.add('show');
    btn.disabled = false; btn.style.opacity = '';
  });

  // Quote email. Primary contact path is a pre-filled email (photos attach natively).
  // The estimator adds job lines via window.quoteEmail.add().
  (() => {
    const TO = 'kenny@handymanphillips.com';
    const jobs = [];
    const btn = document.getElementById('qeBtn'), box = document.getElementById('qeJobs'), list = document.getElementById('qeList');
    const build = () => {
      const body = [
        'Hi Kenny,', '',
        "I'd like a quote on a project.", '',
        'My name is ',
        "I'm located in ",
        "Here's what I need done ", '',
        ...(jobs.length ? ['Estimates from your site', ...jobs.map(j => '• ' + j.replace(/\n/g, '\n   ')), ''] : []),
        "I've attached photos (if I have them).", '',
        'Thanks!'
      ].join('\n');
      btn.href = `mailto:${TO}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(body)}`;
      box.hidden = !jobs.length;
      list.innerHTML = '';
      jobs.forEach((j, i) => {
        const li = document.createElement('li');
        const span = document.createElement('span'); span.textContent = j.split('\n')[0];
        const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = 'Remove';
        rm.addEventListener('click', () => {
          const f = document.getElementById('f-job');
          f.value = f.value.replace(j, '').replace(/\n{3,}/g, '\n\n').trim();
          jobs.splice(i, 1); build();
        });
        li.append(span, rm); list.append(li);
      });
    };
    window.quoteEmail = { add: line => { jobs.push(line); build(); } };
    build();

    const copy = document.getElementById('qeCopy');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(TO); }
      catch {
        const t = document.createElement('textarea'); t.value = TO; document.body.append(t); t.select();
        try { document.execCommand('copy'); } catch {} t.remove();
      }
      copy.textContent = 'Copied'; copy.classList.add('done');
      setTimeout(() => { copy.textContent = 'Copy'; copy.classList.remove('done'); }, 1800);
    });
  })();

  // Rough price estimator. Prices are generated from a private pricing model
  // (~/Desktop/handyman-pricing/pricing.py, not in this repo). Edit rates there
  // and re-run it, never by hand here.
  const PRICES = /* PRICES:START */{"min":175,"round":25,"services":[{"id":"outdoor","name":"Outdoor","tasks":[{"id":"fence-new","name":"New wood fence","unit":"ft","qty":[50,10,600,10],"p":[48.0,79.0],"cond":[["Easy digging",1.0],["Rocky soil or slope",1.4]]},{"id":"fence-fix","name":"Fence repair","unit":"section","qty":[2,1,20,1],"p":[184.0,378.0],"cond":[]},{"id":"gate","name":"Gate install","unit":"gate","qty":[1,1,4,1],"p":[420.0,810.0],"cond":[]},{"id":"deck","name":"Deck refinishing","unit":"sq ft","qty":[300,50,2000,25],"p":[4.92,8.66],"cond":[["Light weathering",1.0],["Peeling old stain",1.6]]},{"id":"cedar","name":"Gazebo or cedar shake","unit":"sq ft","qty":[200,50,3000,25],"p":[6.5,11.74],"cond":[["Reachable from the ground",1.0],["Ladder or roof work",1.4]]},{"id":"wash","name":"Pressure washing","unit":"sq ft","qty":[800,100,5000,50],"p":[0.61,1.22],"cond":[["Driveway, walk or patio",1.0],["Siding",1.25],["Deck or fence",1.15]]}]},{"id":"repairs","name":"Repairs & Mounting","tasks":[{"id":"tv","name":"Mount a TV","unit":"TV","qty":[1,1,6,1],"p":[90.0,190.0],"cond":[["Drywall",1.0],["Plaster or brick",1.4],["Over a fireplace",1.6]]},{"id":"shelf","name":"Hang shelves","unit":"shelf","qty":[3,1,20,1],"p":[45.0,95.0],"cond":[["Drywall",1.0],["Plaster or brick",1.4]]},{"id":"vitsoe","name":"Vitsœ 606 shelving","unit":"bay","qty":[3,1,12,1],"p":[97.0,176.0],"cond":[["New install",1.0],["Move or reconfigure",0.8],["Plaster or brick wall",1.35]]},{"id":"mirror","name":"Hang mirrors or art","unit":"piece","qty":[2,1,20,1],"p":[37.0,95.0],"cond":[["Standard size",1.0],["Large or heavy",1.6]]},{"id":"assembly","name":"Furniture assembly","unit":"piece","qty":[2,1,15,1],"p":[80.0,165.0],"cond":[["Small piece like a desk or nightstand",0.6],["Dresser, bed or crib",1.0],["Wardrobe or outdoor set",1.6]]},{"id":"recaulk","name":"Re-caulk tub or shower","unit":"tub","qty":[1,1,6,1],"p":[125.0,204.0],"cond":[]},{"id":"grabbar","name":"Grab bars & handrails","unit":"bar","qty":[2,1,10,1],"p":[71.0,147.0],"cond":[["Drywall",1.0],["Through tile",1.5]]},{"id":"drywall","name":"Patch drywall","unit":"patch","qty":[2,1,15,1],"p":[98.0,201.0],"cond":[["Small holes",0.7],["Fist size",1.0],["Bigger than a plate",1.6]]},{"id":"list","name":"Small repair list","unit":"item","qty":[4,1,20,1],"p":[45.0,100.0],"cond":[]}]},{"id":"carpentry","name":"Carpentry & Custom Builds","tasks":[{"id":"builtin","name":"Closet or built‑in","unit":"ft wide","qty":[6,2,20,1],"p":[486.0,816.0],"cond":[["Painted plywood",1.0],["Stain grade wood",1.25]]},{"id":"montessori","name":"Montessori kids’ shelf","unit":"unit","qty":[1,1,6,1],"p":[464.0,832.0],"cond":[]},{"id":"trim","name":"Baseboard & trim","unit":"ft","qty":[100,20,1000,10],"p":[8.86,16.38],"cond":[["Install only",1.0],["Remove old trim first",1.3]]},{"id":"window","name":"Replace a window","unit":"window","qty":[1,1,15,1],"p":[280.0,510.0],"cond":[["Ground floor",1.0],["Second floor",1.35]]},{"id":"door-int","name":"Interior door","unit":"door","qty":[1,1,15,1],"p":[204.0,367.0],"cond":[["Prehung",1.0],["Slab into old frame",1.2]]},{"id":"door-ext","name":"Exterior door","unit":"door","qty":[1,1,4,1],"p":[528.0,920.0],"cond":[]},{"id":"storm","name":"Storm or screen door","unit":"door","qty":[1,1,4,1],"p":[245.0,403.0],"cond":[]}]},{"id":"paint","name":"Interiors & Renovations","tasks":[{"id":"room","name":"Paint a room","unit":"room","qty":[1,1,12,1],"p":[540.0,920.0],"cond":[["Walls only",1.0],["Walls, ceiling and trim",1.65]]},{"id":"cabinets","name":"Paint cabinets","unit":"door or drawer","qty":[20,4,80,1],"p":[92.4,152.4],"cond":[]}]},{"id":"seasonal","name":"Home Care & Seasonal","tasks":[{"id":"gutters","name":"Gutter cleaning","unit":"ft","qty":[120,40,400,10],"p":[2.16,3.88],"cond":[["One story",1.0],["Two story",1.4]]},{"id":"guards","name":"Gutter guards","unit":"ft","qty":[120,40,400,10],"p":[6.82,12.56],"cond":[["One story",1.0],["Two story",1.4]]},{"id":"lights","name":"Holiday lights, up and down","unit":"ft","qty":[100,20,500,10],"p":[4.08,7.08],"cond":[["One story roofline",1.0],["Two story roofline",1.4],["Bushes, trees and porch",0.8]]},{"id":"weather","name":"Weatherstrip a door","unit":"door","qty":[2,1,10,1],"p":[81.0,167.0],"cond":[]}]}]}/* PRICES:END */;
  (() => {
    if (!PRICES || !PRICES.services) return;
    const $ = (tag, attrs = {}, html = '') => { const el = document.createElement(tag); Object.assign(el, attrs); if (html) el.innerHTML = html; return el; };
    const fmt = n => '$' + n.toLocaleString('en-US');
    const roundStep = n => n < 1000 ? 25 : n < 5000 ? 50 : 100;
    const plural = (u, q) => q === 1 || /\bft\b/.test(u) ? u : u.replace(/^(\w+)/, w => w.endsWith('s') ? w + 'es' : w + 's');
    const qtyLabel = u => u === 'ft' ? 'Length in feet' : u === 'sq ft' ? 'Area in square feet' : u === 'ft wide' ? 'Width in feet' : 'How many ' + plural(u, 2);
    const jobField = document.getElementById('f-job');

    PRICES.services.forEach(svc => {
      const card = document.querySelector(`.svc[data-svc="${svc.id}"]`);
      if (!card || !card.querySelector('.est')) return;
      const toggle = card.querySelector('.est-toggle');
      const panel = card.querySelector('.est');
      const state = { task: svc.tasks[0], qty: svc.tasks[0].qty[0], cond: 0 };

      const chipsWrap = $('div'); chipsWrap.append($('span', { className: 'est-label' }, 'What do you need'));
      const chips = $('div', { className: 'chips', role: 'group' });
      chipsWrap.append(chips);

      const row = $('div', { className: 'est-row' });
      const qWrap = $('div'); const qLab = $('label', { className: 'est-label', htmlFor: `q-${svc.id}` });
      const stepper = $('div', { className: 'stepper' });
      const minus = $('button', { type: 'button', ariaLabel: 'Less' }, '&minus;');
      const qIn = $('input', { id: `q-${svc.id}`, type: 'number', inputMode: 'numeric' });
      const plus = $('button', { type: 'button', ariaLabel: 'More' }, '+');
      stepper.append(minus, qIn, plus); qWrap.append(qLab, stepper);
      const cWrap = $('div'); const cLab = $('label', { className: 'est-label', htmlFor: `c-${svc.id}` }, 'Job conditions');
      const cSel = $('select', { id: `c-${svc.id}` }); cWrap.append(cLab, cSel);
      row.append(qWrap, cWrap);

      const nWrap = $('div');
      nWrap.append($('label', { className: 'est-label', htmlFor: `n-${svc.id}` }, 'Tell me more about the job'));
      const notes = $('textarea', { id: `n-${svc.id}`, placeholder: 'Sizes, materials, access, timing, anything that helps' });
      nWrap.append(notes);

      const outBox = $('div', { className: 'est-out' });
      outBox.setAttribute('aria-live', 'polite');
      outBox.append($('span', { className: 'est-label' }, 'Rough estimate'));
      const price = $('div', { className: 'est-price' });
      outBox.append(price, $('p', { className: 'est-fine' }, 'Labor and basic materials, based on similar jobs. You get a firm written price once I see the job or your photos.'));

      const send = $('button', { type: 'button', className: 'btn btn-orange est-send' }, 'Add to my quote email <span class="arrow">→</span>');
      const sent = $('p', { className: 'est-sent', hidden: true }, 'Added. Scroll down to email it, with photos if you have them.');
      panel.append(chipsWrap, row, nWrap, outBox, send, sent);

      const calc = () => {
        const t = state.task, m = t.cond.length ? t.cond[state.cond][1] : 1, q = state.qty;
        let lo = q * t.p[0] * m, hi = q * t.p[1] * m;
        lo = Math.max(lo, PRICES.min); hi = Math.max(hi, lo * 1.25);
        lo = Math.floor(lo / roundStep(lo)) * roundStep(lo);
        hi = Math.ceil(hi / roundStep(hi)) * roundStep(hi);
        return [lo, hi];
      };
      const render = () => {
        const t = state.task;
        [...chips.children].forEach(c => c.setAttribute('aria-pressed', c.dataset.id === t.id));
        qLab.textContent = qtyLabel(t.unit);
        qIn.min = t.qty[1]; qIn.max = t.qty[2]; qIn.step = t.qty[3]; qIn.value = state.qty;
        cWrap.hidden = !t.cond.length;
        cSel.innerHTML = t.cond.map((c, i) => `<option value="${i}"${i === state.cond ? ' selected' : ''}>${c[0]}</option>`).join('');
        const [lo, hi] = calc();
        price.textContent = `${fmt(lo)} to ${fmt(hi)}`;
        sent.hidden = true;
      };
      svc.tasks.forEach(t => {
        const c = $('button', { type: 'button', className: 'chip' }, t.name);
        c.dataset.id = t.id;
        c.addEventListener('click', () => { state.task = t; state.qty = t.qty[0]; state.cond = 0; render(); });
        chips.append(c);
      });
      const setQty = v => { const t = state.task; v = Math.round(v / t.qty[3]) * t.qty[3]; state.qty = Math.min(t.qty[2], Math.max(t.qty[1], v || t.qty[1])); render(); };
      minus.addEventListener('click', () => setQty(state.qty - state.task.qty[3]));
      plus.addEventListener('click', () => setQty(state.qty + state.task.qty[3]));
      qIn.addEventListener('change', () => setQty(+qIn.value));
      cSel.addEventListener('change', () => { state.cond = +cSel.value; render(); });

      // Homepage-style cards open on a toggle; group pages show the panel open.
      if (toggle) toggle.addEventListener('click', () => {
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open);
        if (open) render();
      });
      if (!panel.hidden) render();

      send.addEventListener('click', () => {
        const t = state.task, [lo, hi] = calc();
        const cond = t.cond.length ? `, ${t.cond[state.cond][0].toLowerCase()}` : '';
        let line = `${t.name}, ${state.qty} ${plural(t.unit, state.qty)}${cond} (estimate ${fmt(lo)} to ${fmt(hi)})`;
        if (notes.value.trim()) line += `\nNotes. ${notes.value.trim()}`;
        jobField.value = jobField.value.trim() ? jobField.value.trim() + '\n\n' + line : line;
        window.quoteEmail && window.quoteEmail.add(line);
        sent.hidden = false;
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('qeBtn').focus({ preventScroll: true }), 700);
      });
    });
  })();

})();
