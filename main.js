import { quotes } from './theme.js';

(async function() {
  // Expose contact info for pages
  localStorage.setItem('contact_phone', (typeof CONTACT_PHONE !== 'undefined' ? CONTACT_PHONE : '') || '');
  localStorage.setItem('contact_email', (typeof CONTACT_EMAIL !== 'undefined' ? CONTACT_EMAIL : '') || '');

  const res = await fetch('/api/services');
  const services = await res.json();
  const featured = document.getElementById('featured');
  featured.innerHTML = services.slice(0,3).map(s => `
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

  // Rotate quotes
  const el = document.getElementById('quote');
  let i = 0;
  el.textContent = quotes[i];
  setInterval(() => {
    i = (i + 1) % quotes.length;
    el.textContent = quotes[i];
  }, 4000);

  // Footer contact
  document.getElementById('phone').textContent = localStorage.getItem('contact_phone') || '';
  document.getElementById('email').textContent = localStorage.getItem('contact_email') || '';
})();
