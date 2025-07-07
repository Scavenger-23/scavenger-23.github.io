async function loadCaps() {
  const resp = await fetch('caps.json');
  const caps = await resp.json();

  // ---------- build Brand filter ----------
  const brands = [...new Set(caps.map(c => c.brand))].sort();
  const select = document.getElementById('brandFilter');
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => renderGallery(caps));

  renderGallery(caps);
}

/**
 * Render the thumbnail grid
 */
function renderGallery(caps) {
  const chosenBrand = document.getElementById('brandFilter').value;
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  caps
    .filter(c => !chosenBrand || c.brand === chosenBrand)
    .forEach(cap => {
      const secondLine = cap.series ? `<br>${cap.series}` : '';
      const fig = document.createElement('figure');
      fig.innerHTML = `
        <img src="${cap.image}" alt="${cap.id}">
        <figcaption>${cap.brand}${secondLine}</figcaption>`;
      gallery.appendChild(fig);
    });
}

loadCaps().catch(err => {
  console.error(err);
  document.getElementById('gallery').textContent = 'Failed to load caps.json';
});
