(async function() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { document.getElementById('service').innerHTML = '<p>Missing service id.</p>'; return; }

  const res = await fetch('/api/services/' + id);
  if (!res.ok) { document.getElementById('service').innerHTML = '<p>Service not found.</p>'; return; }
  const { service, schedules } = await res.json();

  const container = document.getElementById('service');
  container.innerHTML = `
    <h1 style="font-size:1.5rem;margin:0">${service.route_name}</h1>
    <p style="color:#6b7280">${service.origin} → ${service.destination}</p>
    <div class="grid" style="grid-template-columns:1fr;gap:16px;margin-top:12px">
      <div class="card"><div class="content">
        <div id="map" style="width:100%;height:320px;border-radius:8px;overflow:hidden"></div>
        <p style="margin-top:8px">Duration: ${service.duration_min} minutes · Capacity: ${service.capacity}</p>
        <p>Safety: Weather dependent; valid ID required.</p>
        <p>Baggage: Soft bags recommended; limited weight per passenger.</p>
      </div></div>
      <div class="card"><div class="content">
        <h2 style="margin:0;font-size:1.1rem">Next schedules</h2>
        <ul style="list-style:none;padding:0;margin-top:8px">
          ${schedules.map(s => `
            <li style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e5e7eb;padding:8px 0">
              <span>${new Date(s.date).toLocaleDateString()} · ${s.departure} · Seats: ${s.seats_avail}</span>
              <a href="#book-${s.id}" style="color:var(--accent)">Book</a>
            </li>
          `).join('')}
        </ul>
        <div id="forms"></div>
      </div></div>
    </div>
  `;

  // Map (Leaflet + OSM)
  const centerLat = (service.origin_lat + service.dest_lat)/2;
  const centerLng = (service.origin_lng + service.dest_lng)/2;
  const map = L.map('map').setView([centerLat, centerLng], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([service.origin_lat, service.origin_lng]).addTo(map).bindPopup(service.origin);
  L.marker([service.dest_lat, service.dest_lng]).addTo(map).bindPopup(service.destination);
  const line = L.polyline([[service.origin_lat, service.origin_lng],[service.dest_lat, service.dest_lng]], { color: '#FF9933' }).addTo(map);
  map.fitBounds(line.getBounds(), { padding: [20,20] });

  // Booking forms
  const forms = document.getElementById('forms');
  forms.innerHTML = schedules.map(s => `
    <div id="book-${s.id}" class="card" style="margin-top:12px"><div class="content">
      <h3 style="margin:0;font-size:1rem">Book: ${new Date(s.date).toLocaleDateString()} · ${s.departure}</h3>
      <form data-service="${service.id}" data-schedule="${s.id}" class="bookform" style="margin-top:8px">
        <input class="input" name="name" placeholder="Full name" required>
        <input class="input" name="email" type="email" placeholder="Email" required style="margin-top:8px">
        <input class="input" name="phone" type="tel" placeholder="Mobile number" required style="margin-top:8px">
        <div style="display:flex;gap:8px;margin-top:8px">
          <input class="input" name="pax" type="number" min="1" max="6" placeholder="Passengers" required>
          <input class="input" name="notes" placeholder="Notes (optional)">
        </div>
        <button class="btn" type="submit" style="margin-top:8px">Book now</button>
        <p class="msg" style="margin-top:8px"></p>
      </form>
    </div></div>
  `).join('');

  document.querySelectorAll('.bookform').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const serviceId = form.getAttribute('data-service');
      const scheduleId = form.getAttribute('data-schedule');
      const data = Object.fromEntries(new FormData(form).entries());
      const payload = {
        name: data.name, email: data.email, phone: data.phone,
        pax: Number(data.pax), notes: data.notes || '',
        serviceId, scheduleId
      };
      const btn = form.querySelector('button');
      const msg = form.querySelector('.msg');
      btn.disabled = true; msg.textContent = 'Submitting...';
      const res = await fetch('/api/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      btn.disabled = false;
      if (res.ok) {
        const { ref } = await res.json();
        msg.style.color = '#10b981';
        msg.textContent = `Booking received. Reference: ${ref}. We emailed you. For urgent help, call ${localStorage.getItem('contact_phone') || ''}.`;
        form.reset();
      } else {
        const j = await res.json().catch(()=>({ error: 'Error' }));
        msg.style.color = '#ef4444';
        msg.textContent = j.error || 'Something went wrong. Please call us.';
      }
    });
  });
})();
