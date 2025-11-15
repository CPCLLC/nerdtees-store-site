async function loadTees() {
  const container = document.getElementById('teesGrid');
  console.log('teesGrid container:', container);

  if (!container) {
    console.error('No element with id "teesGrid" found in the DOM.');
    return;
  }

  // Fallback image for broken/missing URLs
  const placeholder = 'https://via.placeholder.com/400x400?text=NerdTees';

  try {
    const res = await fetch('/data/tees.js');
    console.log('Fetch response status:', res.status, res.statusText);

    if (!res.ok) {
      console.error('Failed to fetch tees.js');
      container.innerHTML = `<p class="text-red-600">Failed to load tees (HTTP ${res.status}).</p>`;
      return;
    }

    const tees = await res.json();
    console.log('Loaded tees:', tees);
    console.log('First tee:', tees[0]);
    console.log('Total tees:', Array.isArray(tees) ? tees.length : 'not an array');

    if (!Array.isArray(tees) || tees.length === 0) {
      container.innerHTML = `<p class="text-gray-600">No tees found.</p>`;
      return;
    }

    // Basic safety: filter out NSFW items if flagged
    const safeTees = tees.filter(t => !t.nsfw);

    if (safeTees.length === 0) {
      container.innerHTML = `<p class="text-gray-600">No safe tees to display.</p>`;
      return;
    }

    // Sort newest first by last_seen if present
    safeTees.sort((a, b) => {
      const da = a.last_seen ? Date.parse(a.last_seen) : 0;
      const db = b.last_seen ? Date.parse(b.last_seen) : 0;
      return db - da;
    });

    container.innerHTML = safeTees.map(tee => {
      return `
        <div class="bg-white rounded shadow overflow-hidden hover:shadow-lg transition p-3">
          <a href="${tee.detail_url}" target="_blank" rel="noopener">
            <img
              src="${tee.image_url || placeholder}"
              alt="${tee.title}"
              class="w-full h-64 object-cover rounded"
              loading="lazy"
              onerror="this.onerror=null;this.src='${placeholder}';"
            >
          </a>
          <h2 class="mt-2 font-semibold text-sm line-clamp-2">${tee.title}</h2>
          <p class="text-gray-600 text-xs">${tee.brand || ''}</p>
          <p class="font-bold mt-1">${tee.price?.display || ''}</p>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading tees.js:', err);
    container.innerHTML = `<p class="text-red-600">Error loading tees.</p>`;
  }
}

loadTees();



