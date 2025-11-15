async function loadTees() {
  try {
    const res = await fetch('/data/tees.js', {
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (!res.ok) {
      console.error('Failed to fetch tees.js:', res.status, res.statusText);
      return;
    }

    const tees = await res.json();
    console.log('Loaded tees:', tees);
    console.log('First tee:', tees[0]);
    console.log('Total tees:', Array.isArray(tees) ? tees.length : 'not an array');
  } catch (err) {
    console.error('Error loading tees.js:', err);
  }
}

loadTees();
