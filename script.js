/* =====================================================================
   Bottle-Cap Gallery  –  2025-07-07 build 2
   ===================================================================== */

/* 0. Globals --------------------------------------------------------- */
let caps = [];              // full dataset
let activeBrand = '';       // filter
let sortMode    = 'added';  // sort selector
let shown = [];             // last rendered array (for modal nav)
let modalIndex = 0;         // current index in 'shown'

/* 1. Boot ------------------------------------------------------------ */
(async function init () {
  try {
    const res = await fetch('caps.json');
    caps = await res.json();

    buildBrandUI();
    hookListeners();
    restoreTheme();
    renderGallery();
  } catch (err) {
    console.error(err);
    document.getElementById('gallery').textContent = 'Failed to load caps.json';
  }
})();

/* 2. UI builders ----------------------------------------------------- */
function buildBrandUI () {
  const total = caps.length;
  document.getElementById('totalCount').textContent = `(${total})`;

  const map = {};
  caps.forEach(c => map[c.brand] = (map[c.brand] || 0) + 1);

  const select = document.getElementById('brandFilter');
  const list   = document.getElementById('brandList');

  Object.keys(map).sort().forEach(brand => {
    const n = map[brand];

    /* dropdown */
    const opt = document.createElement('option');
    opt.value = brand; opt.textContent = `${brand} (${n})`;
    select.appendChild(opt);

    /* sidebar link */
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" data-brand="${brand}">${brand} (${n})</a>`;
    list.appendChild(li);
  });
}

/* 3. Event listeners ------------------------------------------------- */
function hookListeners () {
  document.getElementById('brandFilter')
          .addEventListener('change', e => setBrand(e.target.value));

  document.getElementById('brandList')
          .addEventListener('click', e=>{
            if(e.target.tagName==='A'){ e.preventDefault(); setBrand(e.target.dataset.brand); }
          });

  document.getElementById('searchBox').addEventListener('input', renderGallery);
  document.getElementById('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value; renderGallery();
  });

  /* Dark / light toggle */
  document.getElementById('themeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    syncThemeIcon();
  };

  /* Modal navigation */
  const modal = document.getElementById('modal');
  modal.querySelector('.close').onclick = closeModal;
  modal.querySelector('.navPrev').onclick = () => stepModal(-1);
  modal.querySelector('.navNext').onclick = () => stepModal( 1);
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  window.addEventListener('keydown', e=>{
    if(modal.style.display==='flex'){
      if(e.key==='Escape') closeModal();
      if(e.key==='ArrowLeft')  stepModal(-1);
      if(e.key==='ArrowRight') stepModal( 1);
    }
  });
}

/* helper ------------------------------------------------------------- */
function setBrand (b){
  activeBrand = b;
  document.getElementById('brandFilter').value = b;
  document.querySelectorAll('#brandList a').forEach(a =>
    a.classList.toggle('active', a.dataset.brand===b));
  renderGallery();
}

/* 4. Render ---------------------------------------------------------- */
function renderGallery (){
  const term  = document.getElementById('searchBox').value.trim().toLowerCase();
  const grid  = document.getElementById('gallery');
  const badge = document.getElementById('brandCount');

  /* filter */
  shown = caps.filter(c=>{
    const okBrand = !activeBrand || c.brand===activeBrand;
    const txt = (c.id+c.brand+c.series+c.country+(c.description||'')).toLowerCase();
    return okBrand && (!term || txt.includes(term));
  });

  /* sort */
  if(sortMode==='brand'){
    shown.sort((a,b)=>a.brand.localeCompare(b.brand)||a.series.localeCompare(b.series));
  }else if(sortMode==='year'){
    shown.sort((a,b)=>(b.year||0)-(a.year||0));
  } /* 'added' keeps JSON order */

  /* build grid */
  grid.innerHTML = '';
  shown.forEach((cap,i)=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `
      <img src="${cap.image}" loading="lazy"
           title="${cap.series} – ${cap.country||''} ${cap.year||''}"
           alt="">
      <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    fig.querySelector('img').onclick = () => openModal(i);
    grid.appendChild(fig);
  });

  badge.textContent = `– showing ${shown.length}`;
}

/* 5. Modal helpers --------------------------------------------------- */
function openModal (idx){
  modalIndex = idx;
  document.getElementById('modal').style.display = 'flex';
  updateModalImage();
}
function stepModal (delta){
  modalIndex = (modalIndex + delta + shown.length) % shown.length;
  updateModalImage();
}
function updateModalImage (){
  document.querySelector('#modal img').src = shown[modalIndex].image;
}
function closeModal (){
  document.getElementById('modal').style.display = 'none';
}

/* 6. Theme ----------------------------------------------------------- */
function restoreTheme (){
  if(localStorage.getItem('theme')==='dark' ||
     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.body.classList.add('dark');
  }
  syncThemeIcon();
}
function syncThemeIcon (){
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
}
