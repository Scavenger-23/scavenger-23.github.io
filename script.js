async function loadCaps() {
  const resp = await fetch('caps.json');
  const caps = await resp.json();

  const select = document.getElementById('brandFilter');
  const countSpan = document.getElementById('brandCount');

  /* ---- build brand list with counts ---- */
  const countByBrand = caps.reduce((m, c) => {
    m[c.brand] = (m[c.brand] || 0) + 1;
    return m;
  }, {});

  const brands = Object.keys(countByBrand).sort();
  brands.forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = `${brand} (${countByBrand[brand]})`;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => renderGallery(caps, countSpan));

  /* first render */
  renderGallery(caps, countSpan);
}

function renderGallery(caps, countSpan) {
  const brand   = document.getElementById('brandFilter').value;
  const gallery = document.getElementById('gallery');

  gallery.innerHTML = '';                          // clear grid
  const filtered = caps.filter(c => !brand || c.brand === brand);

  /* build figures */
  filtered.forEach(cap => {
    const fig = document.createElement('figure');
    fig.innerHTML = `
      <img src="${cap.image}" alt="">
      <figcaption>${cap.brand}<br>${cap.series}</figcaption>`;
    gallery.appendChild(fig);
  });

  /* update live count */
  countSpan.textContent = ` – showing ${filtered.length}`;
}

/* start */
loadCaps().catch(err => {
  console.error(err);
  document.getElementById('gallery').textContent = 'Failed to load caps.json';
});
