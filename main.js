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

    // Reset form
    bookForm.reset();
  });
}
