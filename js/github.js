/* =============================================================
   PROJETS GITHUB EN DIRECT · Mayssa Dhahri
   -------------------------------------------------------------
   Charge automatiquement les dépôts publics depuis l'API GitHub.
   ➜ Quand tu crées un nouveau dépôt, il apparaît sur le site
     sans toucher au code.

   Ordre des sources (la première qui marche est utilisée) :
     1. Cache du navigateur (30 min)   → rapide, évite la limite de l'API
     2. API GitHub en direct           → toujours à jour
     3. data/github-snapshot.json      → copie de secours créée par la CI
   L'API GitHub sans compte autorise 60 requêtes par heure et par visiteur :
   le cache et la copie de secours évitent tout blocage.

   Astuces pour un beau rendu (à faire sur GitHub, pas ici) :
     - écrire une Description pour chaque dépôt ;
     - ajouter des Topics (ex. spring-boot, angular, ia) ;
     - mettre le lien de démo dans « Website » ;
     - ajouter le topic « portfolio » pour mettre un dépôt « À la une ».
   ============================================================= */

(function () {
  'use strict';

  const P = window.PROFILE;
  if (!P || !P.github) return;

  const CFG = P.github;
  const USER = CFG.user;
  const API = 'https://api.github.com';
  const CACHE_KEY = 'gh-cache-v1-' + USER;
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  /* ===== Outils ===== */
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (n) => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;

  // Couleurs officielles des langages (comme sur GitHub)
  const LANG_COLORS = {
    'Java': '#b07219', 'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5', 'Dart': '#00B4AB',
    'PHP': '#4F5D95', 'HTML': '#e34c26', 'CSS': '#663399', 'SCSS': '#c6538c', 'Kotlin': '#A97BFF', 'C': '#555555',
    'C++': '#f34b7d', 'C#': '#178600', 'Go': '#00ADD8', 'Shell': '#89e051', 'Jupyter Notebook': '#DA5B0B',
    'Vue': '#41b883', 'Swift': '#F05138', 'Dockerfile': '#384d54', 'Blade': '#f7523f', 'Ruby': '#701516'
  };
  const colorOf = (lang) => LANG_COLORS[lang] || '#8b949e';

  // « smart-movie_platform » → « Smart Movie Platform »
  const prettify = (name) => name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Date relative en français : « il y a 3 jours »
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
  function timeAgo(iso) {
    const diff = (new Date(iso) - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, sec] of units) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return 'à l\'instant';
  }
  const daysSince = (iso) => (Date.now() - new Date(iso)) / 86400000;

  // Accepte seulement les liens http(s) (sécurité)
  const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '');

  /* ===== Stockage (peut être bloqué : on protège avec try/catch) ===== */
  const cache = {
    get() {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return Date.now() - data.savedAt < CACHE_TTL ? data : null;
      } catch (e) { return null; }
    },
    set(data) {
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, savedAt: Date.now() })); } catch (e) { /* ignoré */ }
    }
  };

  // Requête avec délai maximum (8 secondes)
  async function getJSON(url) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(url + ' → HTTP ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  /* ===== Chargement des données ===== */
  async function loadData() {
    // 1. Cache
    const cached = cache.get();
    if (cached) return { ...cached, source: 'cache' };

    // 2. API en direct
    try {
      const [user, repos] = await Promise.all([
        getJSON(`${API}/users/${USER}`),
        getJSON(`${API}/users/${USER}/repos?per_page=100&sort=updated`)
      ]);
      const data = { user, repos, fetchedAt: new Date().toISOString() };
      cache.set(data);
      return { ...data, source: 'live' };
    } catch (e) {
      console.warn('API GitHub indisponible, utilisation de la copie de secours.', e.message);
    }

    // 3. Copie de secours générée par GitHub Actions
    try {
      const snap = await getJSON('data/github-snapshot.json');
      return { user: snap.user, repos: snap.repos, fetchedAt: snap.generated_at, source: 'snapshot' };
    } catch (e) {
      return null;
    }
  }

  /* ===== Préparation des dépôts ===== */
  function prepare(repos) {
    const exclude = new Set((CFG.exclude || []).map((n) => n.toLowerCase()));
    const featured = new Set((CFG.featured || []).map((n) => n.toLowerCase()));
    return repos
      .filter((r) => !exclude.has(r.name.toLowerCase()))
      .filter((r) => CFG.showForks || !r.fork)
      // Un dépôt sans description est caché : il apparaît dès qu'on lui en écrit une sur GitHub
      .filter((r) => !CFG.hideWithoutDescription || (r.description && r.description.trim()))
      .map((r) => ({
        name: r.name,
        title: prettify(r.name),
        description: r.description || '',
        language: r.language || '',
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        url: safeUrl(r.html_url),
        homepage: safeUrl(r.homepage),
        topics: r.topics || [],
        pushed: r.pushed_at || r.updated_at,
        created: r.created_at,
        archived: !!r.archived,
        featured: featured.has(r.name.toLowerCase()) || (r.topics || []).includes(CFG.featuredTopic)
      }));
  }

  /* ===== État de l'interface ===== */
  const state = { repos: [], lang: 'all', query: '' };

  const grid = $('#ghGrid');

  // Cartes « squelette » pendant le chargement
  grid.innerHTML = Array.from({ length: 6 }, () => '<div class="card skeleton"></div>').join('');

  // Tri : les dépôts « À la une » d'abord, puis les plus récents
  function sortRepos(list) {
    return [...list].sort((a, b) => (b.featured - a.featured) || (new Date(b.pushed) - new Date(a.pushed)));
  }

  function visibleRepos() {
    const q = state.query.trim().toLowerCase();
    return sortRepos(state.repos.filter((r) => {
      if (state.lang !== 'all' && r.language !== state.lang) return false;
      if (!q) return true;
      return [r.name, r.title, r.description, r.language, ...r.topics].join(' ').toLowerCase().includes(q);
    }));
  }

  function repoCard(r) {
    const isNew = daysSince(r.created) < 30;
    return `
      <article class="card project repo fade-in${r.featured ? ' featured' : ''}">
        <div class="repo-head">
          <div><h3>${esc(r.title)}</h3><div class="slug">${esc(USER)}/${esc(r.name)}</div></div>
          <div class="badges">
            ${r.featured ? '<span class="badge feat">★ À la une</span>' : ''}
            ${isNew ? '<span class="badge new">Nouveau</span>' : ''}
          </div>
        </div>
        <p class="${r.description ? '' : 'empty'}">${esc(r.description || 'Description à venir.')}</p>
        ${r.topics.length ? `<div class="tags">${r.topics.slice(0, 6).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="repo-meta">
          ${r.language ? `<span><i class="ldot" style="background:${colorOf(r.language)}"></i>${esc(r.language)}</span>` : ''}
          <span title="Étoiles">${icon('star')}${r.stars}</span>
          <span title="Forks">${icon('fork')}${r.forks}</span>
          <span title="Dernière mise à jour">${icon('clock')}${esc(timeAgo(r.pushed))}</span>
        </div>
        <div class="repo-actions">
          ${r.url ? `<a class="btn btn-sm" href="${esc(r.url)}" target="_blank" rel="noopener">${icon('code')} Code</a>` : ''}
          ${r.homepage ? `<a class="btn btn-sm btn-primary" href="${esc(r.homepage)}" target="_blank" rel="noopener">${icon('ext')} Démo</a>` : ''}
        </div>
      </article>`;
  }

  function renderGrid() {
    const list = visibleRepos();
    if (!state.repos.length) {
      grid.innerHTML = `<div class="gh-empty">Mes dépôts publics apparaîtront ici automatiquement.</div>`;
      return;
    }
    grid.innerHTML = list.length
      ? list.map(repoCard).join('')
      : `<div class="gh-empty">Aucun projet ne correspond à « ${esc(state.query)} ».</div>`;
  }

  function renderFilters() {
    const counts = {};
    state.repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    $('#ghFilters').innerHTML =
      `<button type="button" class="filter active" data-lang="all">Tous<span class="count">${state.repos.length}</span></button>` +
      langs.map(([l, n]) => `<button type="button" class="filter" data-lang="${esc(l)}"><i class="ldot" style="background:${colorOf(l)};margin-right:6px"></i>${esc(l)}<span class="count">${n}</span></button>`).join('');
    return langs;
  }

  function renderProfile(user, langs) {
    if (user) {
      if (safeUrl(user.avatar_url)) $('#ghAvatar').src = user.avatar_url;
      $('#ghName').textContent = user.name ? `${user.name} · @${user.login}` : '@' + user.login;
    }
    $('#ghLink').href = `https://github.com/${USER}`;
    $('#ghRepos').textContent = state.repos.length;
    $('#ghLangs').textContent = langs.length;
    const last = state.repos.map((r) => r.pushed).sort().pop();
    $('#ghLast').textContent = last ? timeAgo(last) : '–';

    // Barre de répartition des langages (en nombre de dépôts)
    const total = langs.reduce((s, [, n]) => s + n, 0) || 1;
    $('#langBar').innerHTML = langs.map(([l, n]) => `<i style="width:${(n / total) * 100}%;background:${colorOf(l)}" title="${esc(l)}"></i>`).join('');
    $('#langLegend').innerHTML = langs.slice(0, 8).map(([l, n]) =>
      `<span><i class="ldot" style="background:${colorOf(l)}"></i>${esc(l)} ${Math.round((n / total) * 100)} %</span>`).join('');
  }

  function renderSource(source, fetchedAt) {
    const d = fetchedAt ? new Date(fetchedAt) : new Date();
    const when = d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const label = { live: 'API GitHub en direct', cache: 'API GitHub (cache 30 min)', snapshot: 'copie automatique' }[source];
    $('#ghSource').textContent = `Source : ${label} · ${when}`;
  }

  /* ===== Événements ===== */
  $('#ghFilters').addEventListener('click', (ev) => {
    const b = ev.target.closest('.filter');
    if (!b) return;
    document.querySelectorAll('#ghFilters .filter').forEach((x) => x.classList.toggle('active', x === b));
    state.lang = b.dataset.lang;
    renderGrid();
  });
  let debounce;
  $('#ghSearch').addEventListener('input', (ev) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.query = ev.target.value; renderGrid(); }, 150);
  });

  /* ===== Démarrage ===== */
  loadData().then((data) => {
    if (!data) {
      grid.innerHTML = `<div class="gh-empty">Impossible de joindre GitHub pour le moment.<br><a class="btn" style="margin-top:14px" href="https://github.com/${esc(USER)}?tab=repositories" target="_blank" rel="noopener">${icon('code')} Voir mes dépôts sur GitHub</a></div>`;
      $('#ghTabCount').textContent = '–';
      return;
    }
    state.repos = prepare(data.repos || []);
    const langs = renderFilters();
    renderProfile(data.user, langs);
    renderGrid();
    renderSource(data.source, data.fetchedAt);
    $('#ghTabCount').textContent = state.repos.length;

  });
})();
