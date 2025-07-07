async function loadCaps() {
  const resp = await fetch('caps.json');
  const caps = await resp.json();

  // populate brand filter
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

function renderGallery(caps) {
  const brand = document.getElementById('brandFilter').value;
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  caps
    .filter(c => !brand || c.brand === brand)
    .forEach(cap => {
      const fig = document.createElement('figure');
      fig.innerHTML = `
        <img src="${cap.image}" alt="${cap.design}">
        <figcaption>${cap.brand}<br>${cap.design}</figcaption>`;
      gallery.appendChild(fig);
    });
}

loadCaps().catch(err => {
  console.error(err);
  document.getElementById('gallery').textContent = 'Failed to load caps.json';
});
