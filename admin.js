const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const dash = document.getElementById('dash');
const loginBox = document.getElementById('login');
const seedBtn = document.getElementById('seed');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  const data = Object.fromEntries(new FormData(loginForm).entries());
  const res = await fetch('/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  if (!res.ok) { loginMsg.textContent = 'Invalid credentials'; return; }
  loginBox.style.display = 'none';
  dash.style.display = 'block';
  loadBookings();
});

async function loadBookings() {
  const res = await fetch('/api/admin/bookings');
  const rows = await res.json();
  const tbody = document.querySelector('#bookings tbody');
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.ref}</td><td>${r.name}</td><td>${r.phone}</td><td>${r.pax}</td>
      <td>${r.status}</td><td>${new Date(r.created_at).toLocaleString()}</td>
      <td>
        <select class="select" data-id="${r.id}">
          ${['PENDING','CONFIRMED','ASSIGNED','CANCELLED'].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}
        </select>
        <button class="btn" data-id="${r.id}" style="margin-left:8px;padding:8px 12px">Update</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const sel = tbody.querySelector(`select[data-id="${id}"]`);
      const status = sel.value;
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      if (res.ok) loadBookings();
    });
  });
}

seedBtn.addEventListener('click', async () => {
  const res = await fetch('/api/admin/seed', { method: 'POST' });
  if (res.ok) loadBookings();
});
