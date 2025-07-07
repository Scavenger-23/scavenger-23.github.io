/* =====================================================================
   Bottle-Cap Gallery – full rewrite
   ===================================================================== */

/* ---------------------------------------------------------------------
   0.  Globals
   --------------------------------------------------------------------- */
let caps      = [];               // full data set
let activeBrand = '';             // current brand filter ('' = all)

/* ---------------------------------------------------------------------
   1.  Bootstrapping – fetch JSON, build UI, first render
   --------------------------------------------------------------------- */
(async function init () {
  try {
    const res = await fetch('caps.json');
    caps      = await res.json();

    const brands = [...new Set(caps.map(c => c.brand).filter(Boolean))].sort();
    buildBrandUI(brands);           // sidebar  +  <select>
    hookEventListeners();           // all UI listeners
    restoreTheme();                 // dark / light mode from storage
    renderGallery();                // initial grid
  } catch (err) {
    console.error(err);
    document.getElementById('gallery').textContent = 'Failed to load caps.json';
  }
})();

/* ---------------------------------------------------------------------
   2.  Build sidebar list  +  <select> options (with counts)
   --------------------------------------------------------------------- */
function buildBrandUI (brands) {
  const select = document.getElementById('brandFilter');
  const list   = document.getElementById('brandList');

  /* counts for dropdown */
  const counts = {};
  caps.forEach(c => counts[c.brand] = (counts[c.brand] || 0) + 1);

  brands.forEach(b => {
    // <option>
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = `${b} (${counts[b]})`;
    select.appendChild(opt);

    // sidebar link
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href           = '#';
    a.textContent    = b;
    a.dataset.brand  = b;
    li.appendChild(a);
    list.appendChild(li);
  });
}

/* ---------------------------------------------------------------------
   3.  Event listeners   (brand filter, search, theme, modal)
   --------------------------------------------------------------------- */
function hookEventListeners () {
  /* -- brand dropdown -- */
  document.getElementById('brandFilter')
          .addEventListener('change', e => setBrand(e.target.value));

  /* -- sidebar clicks -- */
  document.getElementById('brandList')
          .addEventListener('click', e => {
            if (e.target.tagName === 'A') {
              e.preventDefault();
              setBrand(e.target.dataset.brand);
            }
          });

  /* -- search box -- */
  document.getElementById('searchBox')
          .addEventListener('input', renderGallery);

  /* -- dark-mode toggle -- */
  document.getElementById('themeToggle')
          .addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('theme',
              document.body.classList.contains('dark') ? 'dark' : 'light');
            syncThemeIcon();
          });

  /* -- modal close (click X or backdrop) -- */
  const modal = document.getElementById('modal');
  modal.querySelector('.close').onclick = closeModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* helper: set current brand and refresh UI */
function setBrand (brand) {
  activeBrand = brand;
  /* dropdown */
  document.getElementById('brandFilter').value = brand;
  /* sidebar highlight */
  document.querySelectorAll('#brandList a').forEach(a =>
    a.classList.toggle('active', a.dataset.brand === brand));
  renderGallery();
}

/* ---------------------------------------------------------------------
   4.  Gallery rendering (brand + search filters)
   --------------------------------------------------------------------- */
function renderGallery () {
  const term     = document.getElementById('searchBox').value.trim().toLowerCase();
  const gallery  = document.getElementById('gallery');
  const counter  = document.getElementById('brandCount');

  gallery.innerHTML = '';

  const shown = caps.filter(c => {
    const okBrand = !activeBrand || c.brand === activeBrand;
    const hay     = (c.id + c.brand + c.series + c.country + (c.description||''))
                      .toLowerCase();
    return okBrand && (!term || hay.includes(term));
  });

  shown.forEach(cap => {
    const fig = document.createElement('figure');
    fig.innerHTML = `
      <img src="${cap.image}" alt="">
      <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    fig.querySelector('img').onclick = () => openModal(cap.image);
    gallery.appendChild(fig);
  });

  counter.textContent = `– showing ${shown.length}`;
}

/* ---------------------------------------------------------------------
   5.  Modal helpers
   --------------------------------------------------------------------- */
function openModal (src) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.querySelector('img').src = src;
}
function closeModal () {
  document.getElementById('modal').style.display = 'none';
}

/* ---------------------------------------------------------------------
   6.  Theme helpers
   --------------------------------------------------------------------- */
function restoreTheme () {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  syncThemeIcon();
}
function syncThemeIcon () {
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
}
