(async function() {
  const res = await fetch('/api/services');
  const services = await res.json();
  const results = document.getElementById('results');
  results.innerHTML = services.map(s => `
    <div class="card">
      <img src="${(s.gallery_urls && s.gallery_urls[0]) || '/images/fleet.jpg'}" alt="${s.route_name}" style="width:100%;height:160px;object-fit:cover">
      <div class="content">
        <h3 style="margin:0">${s.route_name}</h3>
        <p style="color:#6b7280">${s.origin} → ${s.destination}</p>
        <p>Duration: ${s.duration_min} min · Capacity: ${s.capacity}</p>
        <a class="btn" href="/service.html?id=${s.id}" style="margin-top:8px">View details</a>
      </div>
    </div>
  `).join('');
})();
