/* =====================================================================
   Bottle-Cap Gallery  –  full script
   ===================================================================== */

/* 0. globals --------------------------------------------------------- */
let caps = [];          // full data
let activeBrand = '';   // filter state

/* 1. boot ------------------------------------------------------------ */
(async function init () {
  try {
    const r = await fetch('caps.json');
    caps    = await r.json();

    buildBrandUI();          // sidebar + dropdown with counts
    hookListeners();         // events
    restoreTheme();          // dark / light preference
    renderGallery();         // first draw
  } catch (e) {
    console.error(e);
    document.getElementById('gallery').textContent = 'Failed to load caps.json';
  }
})();

/* 2. build UI -------------------------------------------------------- */
function buildBrandUI () {
  const select = document.getElementById('brandFilter');
  const list   = document.getElementById('brandList');
  const total  = caps.length;

  /* write grand total */
  document.getElementById('totalCount').textContent = `(${total})`;

  /* counts per brand */
  const map = {};
  caps.forEach(c => map[c.brand] = (map[c.brand] || 0) + 1);

  Object.keys(map).sort().forEach(brand => {
    const n = map[brand];

    /* dropdown option */
    const opt = document.createElement('option');
    opt.value = brand;  opt.textContent = `${brand} (${n})`;
    select.appendChild(opt);

    /* sidebar item */
    const li = document.createElement('li');
    li.innerHTML = `<a href=\"#\" data-brand=\"${brand}\">${brand} (${n})</a>`;
    list.appendChild(li);
  });
}

/* 3. listeners ------------------------------------------------------- */
function hookListeners () {
  /* dropdown */
  document.getElementById('brandFilter')
          .addEventListener('change', e => setBrand(e.target.value));

  /* sidebar clicks */
  document.getElementById('brandList')
          .addEventListener('click', e=>{
            if(e.target.tagName==='A'){
              e.preventDefault();
              setBrand(e.target.dataset.brand);
            }
          });

  /* search */
  document.getElementById('searchBox')
          .addEventListener('input', renderGallery);

  /* dark / light toggle */
  document.getElementById('themeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme',
      document.body.classList.contains('dark') ? 'dark' : 'light');
    syncThemeIcon();
  };

  /* modal */
  const modal = document.getElementById('modal');
  modal.querySelector('.close').onclick = closeModal;
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  window.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
}

/* helper ------------------------------------------------------------- */
function setBrand (brand) {
  activeBrand = brand;
  document.getElementById('brandFilter').value = brand;

  /* sidebar highlight */
  document.querySelectorAll('#brandList a').forEach(a =>
    a.classList.toggle('active', a.dataset.brand === brand));

  renderGallery();
}

/* 4. render ---------------------------------------------------------- */
function renderGallery () {
  const term   = document.getElementById('searchBox').value.trim().toLowerCase();
  const grid   = document.getElementById('gallery');
  const badge  = document.getElementById('brandCount');

  grid.innerHTML = '';

  const show = caps.filter(c => {
    const okBrand = !activeBrand || c.brand === activeBrand;
    const hay = (c.id + c.brand + c.series + c.country + (c.description||'')).toLowerCase();
    return okBrand && (!term || hay.includes(term));
  });

  show.forEach(cap=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `
      <img src=\"${cap.image}\" loading=\"lazy\" alt=\"\"
           title=\"${cap.series} – ${cap.country||''} ${cap.year||''}\">
      <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    fig.querySelector('img').onclick = () => openModal(cap.image);
    grid.appendChild(fig);
  });

  badge.textContent = `– showing ${show.length}`;
}

/* 5. modal ----------------------------------------------------------- */
function openModal (src){
  const m = document.getElementById('modal');
  m.querySelector('img').src = src;
  m.style.display = 'flex';
}
function closeModal (){
  document.getElementById('modal').style.display = 'none';
}

/* 6. theme helpers --------------------------------------------------- */
function restoreTheme (){
  if(localStorage.getItem('theme')==='dark' ||
     (!localStorage.getItem('theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.body.classList.add('dark');
  }
  syncThemeIcon();
}
function syncThemeIcon (){
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
}
