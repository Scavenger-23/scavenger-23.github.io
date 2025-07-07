/* ---------- load and build UI ---------- */
async function loadCaps(){
  const resp = await fetch('caps.json');
  const caps = await resp.json();

  buildBrandFilter(caps);
  attachEventHandlers(caps);
  renderGallery(caps);          // first render
}

/* ----- create brand options with counts ----- */
function buildBrandFilter(caps){
  const select = document.getElementById('brandFilter');

  const counts = caps.reduce((m,c)=>{ m[c.brand]=(m[c.brand]||0)+1; return m; },{});
  Object.keys(counts).sort().forEach(brand=>{
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = `${brand} (${counts[brand]})`;
    select.appendChild(opt);
  });
}

/* ----- event listeners ----- */
function attachEventHandlers(caps){
  const select = document.getElementById('brandFilter');
  const search = document.getElementById('searchBox');
  select.addEventListener('change', () => renderGallery(caps));
  search.addEventListener('input', () => renderGallery(caps));

  /* theme toggle */
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if(stored==='dark') document.body.classList.add('dark');

  btn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
    btn.textContent = document.body.classList.contains('dark')?'☀️':'🌙';
  });
  btn.textContent = document.body.classList.contains('dark')?'☀️':'🌙';

  /* modal close on X or Esc */
  const modal = document.getElementById('modal');
  modal.querySelector('.close').onclick = closeModal;
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
}

/* ----- render grid ----- */
function renderGallery(caps){
  const brand   = document.getElementById('brandFilter').value;
  const term    = document.getElementById('searchBox').value.trim().toLowerCase();
  const gallery = document.getElementById('gallery');
  const countSpan = document.getElementById('brandCount');

  gallery.innerHTML = '';

  const filtered = caps.filter(c=>{
    const matchesBrand = !brand || c.brand===brand;
    const hay = (c.id+c.series+c.country).toLowerCase();
    const matchesTerm  = !term || hay.includes(term);
    return matchesBrand && matchesTerm;
  });

  filtered.forEach(cap=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${cap.image}" alt="">
                     <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    fig.querySelector('img').addEventListener('click', () => openModal(cap.image));
    gallery.appendChild(fig);
  });

  countSpan.textContent = `– showing ${filtered.length}`;
}

/* ----- modal helpers ----- */
function openModal(src){
  const modal = document.getElementById('modal');
  modal.style.display='flex';
  modal.querySelector('img').src = src;
}
function closeModal(){
  const modal = document.getElementById('modal');
  modal.style.displ
