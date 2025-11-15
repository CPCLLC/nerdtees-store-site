async function loadTees() {
  const container = document.getElementById('teesGrid');

  try {
    const res = await fetch('/data/tees.js');
    const tees = await res.json();

    container.innerHTML = tees.map(tee => {
      return `
        <div class="bg-white rounded shadow overflow-hidden hover:shadow-lg transition p-3">
          <a href="${tee.detail_url}" target="_blank" rel="noopener">
            <img src="${tee.image_url}" alt="${tee.title}" class="w-full h-64 object-cover rounded">
          </a>
          <h2 class="mt-2 font-semibold text-sm">${tee.title}</h2>
          <p class="text-gray-600 text-xs">${tee.brand || ''}</p>
          <p class="font-bold mt-1">${tee.price.display || ""}</p>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading tees:', err);
    container.innerHTML = `<p class="text-red-600">Failed to load tees.</p>`;
  }
}

loadTees();

