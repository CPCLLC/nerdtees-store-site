async function loadTees() {
  const out = document.getElementById("grid");
  const status = document.getElementById("status");

  try {
    const res = await fetch("/data/tees.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const tees = await res.json();

    status.textContent = `Loaded ${tees.length} item(s).`;

    if (!Array.isArray(tees) || tees.length === 0) {
      out.innerHTML = `<div class="muted">No tees yet. The bots are still shopping.</div>`;
      return;
    }

    out.innerHTML = tees.map(t => {
      const title = t.title ?? "(untitled)";
      const brand = t.brand ? `<div class="brand">${escapeHtml(t.brand)}</div>` : "";
      const price = t.price?.display ? `<div class="price">${escapeHtml(t.price.display)}</div>` : "";
      const tags = Array.isArray(t.tags) && t.tags.length
        ? `<div class="tags">${t.tags.slice(0, 6).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
        : "";
      const img = t.image_url ?? "";
      const url = t.detail_url ?? "#";

      return `
        <a class="card" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">
          <div class="thumb">
            ${img ? `<img src="${escapeAttr(img)}" alt="${escapeAttr(title)}" loading="lazy" />` : `<div class="noimg">No image</div>`}
          </div>
          <div class="meta">
            <div class="title">${escapeHtml(title)}</div>
            ${brand}
            ${price}
            ${tags}
          </div>
        </a>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    status.textContent = "Error loading tees feed.";
    out.innerHTML = `<div class="error">${escapeHtml(String(err.message ?? err))}</div>`;
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  // basic attribute-safe escaping
  return escapeHtml(s).replaceAll("`", "&#096;");
}

loadTees();
