// Toggle mobile menu (hamburger)
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  // Optional: close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
}

// Booking form handler (on service.html)
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  bookForm.addEventListener('submit', e => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(bookForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const pax = formData.get('pax');

    // Simple demo message
    const msg = document.getElementById('msg');
    if (msg) {
      msg.textContent = `Booking received for ${name} (${pax} passengers). We will contact you at ${email}.`;
    }

    const helicopterIcon = L.icon({
  iconUrl: 'images/helicopter.png', // add a helicopter icon image
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const heliMarker = L.marker(katra, { icon: helicopterIcon }).addTo(map);

let direction = 1;
setInterval(() => {
  const latlng = heliMarker.getLatLng();
  heliMarker.setLatLng([latlng.lat + 0.0003 * direction, latlng.lng]);
  direction *= -1;
}, 1000);

    // Reset form
    bookForm.reset();
  });
}

