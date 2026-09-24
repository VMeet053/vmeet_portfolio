(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Project archive ---------- */
  const projects = [
    ['Indian Rani', 'https://www.indianrani.com/'],
    ['Venutaloza', 'https://venutaloza.com/'],
    ['Silica Kart', 'https://silicakart.in/'],
    ['Ikonik Bez', 'https://ikonikbez.in/'],
    ['Korppi', 'https://korppi.cloud/'],
    ['Stride Ahead', 'https://www.strideahead.io/'],
    ['Crafts77 Bazaar', 'https://crafts77bazaar.store/'],
    ['Eleos App', 'https://www.eleosapp.com/'],
    ['Biontech India', 'https://biontechindia.com/'],
    ['Take Impact', 'https://takeimpact.com/'],
    ['Natures Nctar', 'https://naturesnctar.dk/'],
    ['FE226', 'https://fe226.com/'],
    ['Collectors Cage', 'https://collectorscage.dk/'],
    ['Lucid Blanks', 'https://lucidblanks.com/'],
    ['Optima Sport', 'https://optimasport.dk/'],
    ['Nordic Zen', 'https://nordiczen.dk/'],
    ['Laphont', 'https://laphont.com/'],
    ['Mayas', 'https://mayas.co/'],
    ['Audrey Vallens', 'https://audreyvallens.com/'],
    ['Reactivate', 'https://reactivate.dk/'],
    ['Krucible', 'https://www.krucible.world/'],
    ['A Jensen Fly Fishing', 'https://ajensenflyfishing.com/'],
    ['DB Shield', 'https://db-shield.store/'],
    ['Color Culture', 'https://colorculture.com/'],
    ['Mat Med Lassen', 'https://matmedlassen.dk/'],
    ['Meotine', 'https://meotine.no/'],
    ['Didi Rose Jewelry', 'https://www.didirosejewelry.com/'],
    ['Aquitaz', 'https://aquitaz.se/']
  ];
  const shot = (url, w = 720, h = 450) => `https://image.thum.io/get/width/${w}/crop/${h}/noanimate/${url}`;
  const list = $('#archiveList');
  const INITIAL = 10;

  if (list) {
    list.innerHTML = projects.map(([name, url], i) => {
      const domain = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return `<li${i >= INITIAL ? ' hidden' : ''}><a href="${url}" target="_blank" rel="noopener" data-shot="${shot(url)}">
        <span class="n">${name}</span><span class="d">${domain}</span><span class="a" aria-hidden="true">↗</span></a></li>`;
    }).join('');
    $('#archiveCount').textContent = projects.length;

    if (projects.length > INITIAL) {
      const wrap = document.createElement('div');
      wrap.className = 'archive__more';
      wrap.innerHTML = `<button class="btn btn--ghost magnetic" type="button">Show all ${projects.length} projects</button>`;
      list.after(wrap);
      wrap.querySelector('button').addEventListener('click', e => {
        $$('li[hidden]', list).forEach(li => li.hidden = false);
        wrap.remove();
      });
    }

    // floating preview that follows the cursor
    const preview = $('#preview');
    const pImg = $('img', preview);
    if (finePointer && preview) {
      let x = 0, y = 0, cx = 0, cy = 0, raf;
      const loop = () => {
        cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
        preview.style.left = cx + 'px'; preview.style.top = cy + 'px';
        raf = requestAnimationFrame(loop);
      };
      list.addEventListener('mouseover', e => {
        const a = e.target.closest('a[data-shot]');
        if (!a) return;
        if (pImg.getAttribute('src') !== a.dataset.shot) pImg.src = a.dataset.shot;
        preview.classList.add('is-on');
        list.classList.add('is-hovering');
      });
      list.addEventListener('mouseleave', () => {
        preview.classList.remove('is-on');
        list.classList.remove('is-hovering');
      });
      list.addEventListener('mousemove', e => {
        x = e.clientX + 200; y = e.clientY;
        if (!raf) { cx = x; cy = y; loop(); }
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    // stagger siblings
    const groups = new Map();
    reveals.forEach(el => {
      const p = el.parentElement;
      const i = groups.get(p) || 0;
      el.style.setProperty('--rd', Math.min(i, 6) * 0.08 + 's');
      groups.set(p, i + 1);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  const runCount = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduced) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
    }), { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else counters.forEach(runCount);

  /* ---------- Hero word rotator ---------- */
  const word = $('.rotator__word');
  if (word && !reduced) {
    const words = ['premium.', 'fast.', 'effortless.', 'remarkable.'];
    let i = 0;
    setInterval(() => {
      word.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove('out');
        word.classList.add('in');
        void word.offsetWidth;
        word.classList.remove('in');
      }, 550);
    }, 2600);
  }

  /* ---------- Nav: scrolled / hide on scroll down / active link ---------- */
  const nav = $('#nav');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    if (!document.body.classList.contains('menu-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 400);
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navLinks = $$('.nav__links a');
  const secIO = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    }
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'services', 'process', 'about', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const menu = $('#mobileMenu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Pointer effects (desktop) ---------- */
  if (finePointer && !reduced) {
    const glow = $('.cursor');
    window.addEventListener('pointermove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    // magnetic buttons
    document.addEventListener('pointermove', e => {
      const m = e.target.closest('.magnetic');
      $$('.magnetic.is-mag').forEach(b => { if (b !== m) { b.style.transform = ''; b.classList.remove('is-mag'); } });
      if (!m) return;
      const r = m.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      m.classList.add('is-mag');
    });

    // spotlight on tiles
    $$('[data-spot]').forEach(t => t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', e.clientX - r.left + 'px');
      t.style.setProperty('--my', e.clientY - r.top + 'px');
    }));

    // subtle tilt on featured cards
    $$('[data-tilt]').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(1200px) rotateX(${-py * 3}deg) rotateY(${px * 3}deg)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  /* ---------- Copy email ---------- */
  const copyBtn = $('.mail-copy');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.copy, small = $('small', copyBtn);
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.classList.add('copied'); small.textContent = 'Copied to clipboard ✓';
      setTimeout(() => { copyBtn.classList.remove('copied'); small.textContent = 'Click to copy'; }, 2200);
    } catch { window.location.href = 'mailto:' + email; }
  });

  /* ---------- Contact form → mailto ---------- */
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.closest('.field').classList.toggle('invalid', bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    const note = $('#formNote');
    if (!ok) { note.textContent = 'Please fill in the highlighted fields.'; return; }
    const d = new FormData(form);
    const subject = `New project enquiry — ${d.get('type')}`;
    const body = `Hi Meet,\n\n${d.get('message')}\n\n— ${d.get('name')}\n${d.get('email')}`;
    window.location.href = `mailto:v.meet0503@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Your email app should open now. Thanks!';
  });

  /* ---------- Year ---------- */
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();
