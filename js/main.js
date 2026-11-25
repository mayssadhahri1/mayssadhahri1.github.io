/* =============================================================
   LOGIQUE DU PORTFOLIO · Mayssa Dhahri
   -------------------------------------------------------------
   Lit les données de data/profile.js (window.PROFILE) et construit
   la page. Les projets GitHub sont gérés par js/github.js.

   Sommaire :
     1. Outils                    6. Thème clair / sombre
     2. Liens de contact          7. Texte animé
     3. Accueil                   8. Animations au défilement
     4. Sections                  9. Navigation (progression + menu actif)
     5. Onglets des projets      10. Effets au survol
   ============================================================= */

(function () {
  'use strict';

  const P = window.PROFILE;
  if (!P) {
    console.error('data/profile.js est introuvable ou contient une erreur.');
    return;
  }
  const I = P.identity;
  const C = P.contact;

  /* ===== 1. OUTILS ===== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  // Protège le texte avant de l'insérer dans la page
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 2. LIENS DE CONTACT ===== */
  // WhatsApp : l'application sur téléphone, WhatsApp Web sur ordinateur
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const waText = encodeURIComponent(C.whatsappMessage);
  const LINKS = {
    cv: C.cv,
    cvAts: C.cvAts,
    linkedin: C.linkedin,
    github: C.github,
    email: `mailto:${C.email}?subject=${encodeURIComponent('PFE 2027 - ' + I.firstName + ' ' + I.lastName)}`,
    phone: 'tel:' + C.phone.replace(/\s/g, ''),
    whatsapp: isMobile
      ? `https://wa.me/${C.whatsapp}?text=${waText}`
      : `https://web.whatsapp.com/send?phone=${C.whatsapp}&text=${waText}`
  };
  // Chaque <a data-link="..."> reçoit son lien
  $$('[data-link]').forEach((a) => { if (LINKS[a.dataset.link]) a.href = LINKS[a.dataset.link]; });

  /* ===== 3. ACCUEIL ===== */
  const FILL = {
    firstName: I.firstName,
    lastName: I.lastName,
    pitch: I.pitch,
    availabilityLong: 'Disponible pour un ' + I.availability
  };
  $$('[data-fill]').forEach((el) => { if (FILL[el.dataset.fill]) el.textContent = FILL[el.dataset.fill]; });
  $('#year').textContent = new Date().getFullYear();

  // Petites infos sous la présentation (lieu, école, type de poste)
  $('#facts').innerHTML = I.facts.map((f) => `<li>${icon(f.icon)}${esc(f.text)}</li>`).join('');

  // Chiffres clés (« + » placé avant le nombre : +20)
  $('#stats').innerHTML = P.stats.map((s) =>
    `<div class="stat"><b class="grad-text" data-count="${s.value}" data-prefix="${esc(s.prefix || '')}">${esc(s.prefix || '')}${s.value}</b><span>${esc(s.label)}</span></div>`
  ).join('');

  // Technologies en orbite : chaque étiquette est placée à un angle différent sur le cercle
  const orbit = I.orbit || [];
  $('#orbit').innerHTML = orbit.map((t, i) =>
    `<span class="orbit-item" style="--a:${(360 / orbit.length) * i}deg"><span>${esc(t)}</span></span>`
  ).join('');

  /* ===== 4. SECTIONS ===== */
  // Ce que j'apporte
  $('#whyGrid').innerHTML = P.whyMe.map((w) =>
    `<article class="card why reveal"><span class="ic">${icon(w.icon)}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`
  ).join('');
  $('#softSkills').innerHTML = '<span class="soft-label">Savoir-être</span>' +
    P.softSkills.map((s) => `<span class="chip">${icon('check')}${esc(s)}</span>`).join('');

  // Stages
  $('#timeline').innerHTML = P.experience.map((e) => `
    <article class="card job reveal">
      <div class="job-top">
        <div><h3>${esc(e.role)}</h3><div class="company">${esc(e.company)}</div></div>
        <span class="year">${esc(e.year)}</span>
      </div>
      ${e.project ? `<div class="job-proj">${esc(e.project)}</div>` : ''}
      <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      ${tags(e.stack)}
    </article>`).join('');

  // Formation, certifications, langues
  const item = (x) => `<div class="item"><span class="when">${esc(x.when)}</span><h4>${esc(x.title)}</h4><small>${esc(x.where)}</small></div>`;
  $('#eduList').innerHTML = P.education.map(item).join('');
  $('#certList').innerHTML = P.certifications.map(item).join('');
  $('#langList').innerHTML = P.languages.map((l) =>
    `<div class="lang-row"><div class="top">${esc(l.name)} <span>${esc(l.level)}</span></div><div class="bar"><i data-level="${l.percent}"></i></div></div>`
  ).join('');

  // Projets phares (du CV)
  $('#projectsGrid').innerHTML = P.projects.map((p) => `
    <article class="card project">
      <div class="p-top"><span class="p-icon">${icon(p.icon)}</span><span class="p-year">${esc(p.year)}</span></div>
      <div class="p-cat">${esc(p.kind)}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.text)}</p>
      ${tags(p.stack)}
    </article>`).join('');
  $('#cvTabCount').textContent = P.projects.length;

  // Compétences
  $('#skillsGrid').innerHTML = P.skills.map((s) =>
    `<div class="card skill-card reveal"><h3 class="card-title"><span class="ic">${icon(s.icon)}</span>${esc(s.title)}</h3>
     <div class="chips">${s.items.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div></div>`
  ).join('');

  // Contact
  const contacts = [
    { cls: 'wa', icon: 'chat', label: 'WhatsApp', value: C.phone, link: 'whatsapp', blank: true },
    { icon: 'mail', label: 'Email', value: C.email, link: 'email' },
    { icon: 'in', label: 'LinkedIn', value: 'in/' + C.linkedin.split('/in/')[1].replace(/\/$/, ''), link: 'linkedin', blank: true },
    { icon: 'code', label: 'GitHub', value: C.github.replace('https://github.com/', ''), link: 'github', blank: true },
    { icon: 'file', label: 'CV', value: 'Version design (PDF)', link: 'cv', blank: true },
    { icon: 'file', label: 'CV', value: 'Version ATS (PDF)', link: 'cvAts', blank: true }
  ];
  $('#contactList').innerHTML = contacts.map((c) =>
    `<a class="c-item ${c.cls || ''}" href="${esc(LINKS[c.link])}" ${c.blank ? 'target="_blank" rel="noopener"' : ''}>
       <span class="ic">${icon(c.icon)}</span><div><small>${esc(c.label)}</small><strong>${esc(c.value)}</strong></div>
       <svg class="arrow" aria-hidden="true"><use href="#i-ext"/></svg></a>`
  ).join('');

  /* ===== 5. ONGLETS DES PROJETS ===== */
  $$('.tab').forEach((tab) => tab.addEventListener('click', () => {
    $$('.tab').forEach((t) => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      $('#panel-' + t.dataset.tab).hidden = !on;
    });
  }));

  /* ===== 6. THÈME CLAIR / SOMBRE (choix mémorisé) ===== */
  const root = document.documentElement;
  const themeBtn = $('#themeBtn');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  };
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
  }
  applyTheme(store.get('theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('theme', next);
  });

  /* ===== 7. TEXTE QUI S'ÉCRIT TOUT SEUL ===== */
  const typed = $('#typed');
  const roles = I.roles;
  typed.textContent = roles[0];
  if (!reduceMotion && roles.length > 1) {
    let r = 0, c = roles[0].length, deleting = true;
    const loop = () => {
      typed.textContent = roles[r].slice(0, c);
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; }
      } else if (++c > roles[r].length) {
        deleting = true;
        return setTimeout(loop, 1800);
      }
      setTimeout(loop, deleting ? 40 : 75);
    };
    setTimeout(loop, 2600);
  }

  /* ===== 8. ANIMATIONS AU DÉFILEMENT ===== */
  // Compteur qui monte jusqu'à la valeur (ralentit à la fin)
  function countUp(el) {
    const end = +el.dataset.count, prefix = el.dataset.prefix || '';
    if (reduceMotion) { el.textContent = prefix + end; return; }
    const start = performance.now(), duration = 1400;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = prefix + Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  // Les chiffres de l'accueil comptent après l'animation d'entrée
  setTimeout(() => $$('#stats [data-count]').forEach(countUp), 900);

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-level]').forEach((b) => { b.style.width = b.dataset.level + '%'; });
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach((el) => revealObs.observe(el));

  /* ===== 9. NAVIGATION ===== */
  // Barre de progression de lecture
  const progress = $('#progress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  }, { passive: true });

  // Lien du menu en surbrillance selon la section visible
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ===== 10. EFFETS AU SURVOL (ordinateur uniquement) ===== */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    // Lumière douce qui suit la souris
    const spot = $('#spotlight');
    window.addEventListener('pointermove', (e) => {
      spot.style.setProperty('--x', e.clientX + 'px');
      spot.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });

    // Inclinaison 3D légère des cartes (fonctionne aussi pour les cartes GitHub ajoutées plus tard)
    const TILT = '.project, .why';
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest(TILT);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
    });
    document.addEventListener('pointerout', (e) => {
      const card = e.target.closest(TILT);
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }
})();
