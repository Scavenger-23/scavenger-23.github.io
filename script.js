/* ---------- load and build UI ---------- */
async function loadCaps() {
  const resp = await fetch('caps.json');
  const caps = await resp.json();

  buildBrandFilter(caps);
  attachEventHandlers(caps);
  renderGallery(caps);          // first render
}

/* ----- create brand options with counts ----- */
function buildBrandFilter(caps) {
  const select = document.getElementById('brandFilter');
  const counts = {};

  caps.forEach(c => {
    if (!c.brand) return;                       // skip malformed entry
    counts[c.brand] = (counts[c.brand] || 0) + 1;
  });

  Object.entries(counts)
        .sort(([a],[b]) => a.localeCompare(b))
        .forEach(([brand, n]) => {
          const opt = document.createElement('option');
          opt.value = brand;
          opt.textContent = `${brand} (${n})`;
          select.appendChild(opt);
        });
}

/* ----- event listeners ----- */
function attachEventHandlers(caps) {
  const select = document.getElementById('brandFilter');
  const search = document.getElementById('searchBox');
  const toggle = document.getElementById('themeToggle');

  select.addEventListener('change', () => renderGallery(caps));
  search.addEventListener('input',  () => renderGallery(caps));

  /* dark-mode toggle */
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') document.body.classList.add('dark');

  toggle.onclick = () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    toggle.textContent = dark ? '☀️' : '🌙';
  };
  toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

  /* Esc closes modal */
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ----- render grid ----- */
function renderGallery(caps) {
  const brand   = document.getElementById('brandFilter').value;
  const term    = document.getElementById('searchBox').value.trim().toLowerCase();
  const gallery = document.getElementById('gallery');
  const count   = document.getElementById('brandCount');

  gallery.innerHTML = '';

  const filtered = caps.filter(c => {
    const matchesBrand = !brand || c.brand === brand;
    const hay = (c.id + c.series + c.country).toLowerCase();
    const matchesTerm  = !term || hay.includes(term);
    return matchesBrand && matchesTerm;
  });

  filtered.forEach(cap => {
    const fig = document.createElement('figure');
    fig.innerHTML = `
      <img src="${cap.image}" alt="">
      <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    fig.querySelector('img')
       .addEventListener('click', () => openModal(cap.image));
    gallery.appendChild(fig);
  });

  count.textContent = `– showing ${filtered.length}`;
}

/* ----- modal helpers ----- */
function openModal(src) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.querySelector('img').src = src;
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

/* ---------- kick things off ---------- */
loadCaps().catch(err => {
  console.error(err);
  document.getElementById('gallery')
          .textContent = 'Failed to load caps.json';
});
