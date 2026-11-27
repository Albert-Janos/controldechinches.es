const menu = document.querySelector('.mobile-menu');
const menuToggle = menu.querySelector('summary');

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) menu.open = false;
});

document.addEventListener('click', (event) => {
  if (menu.open && !menu.contains(event.target)) menu.open = false;
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !menu.open) return;
  menu.open = false;
  menuToggle.focus();
});

matchMedia('(min-width: 991px)').addEventListener('change', (event) => {
  if (event.matches) menu.open = false;
});
