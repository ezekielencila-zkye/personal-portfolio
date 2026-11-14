const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuButton = $('.menu-toggle');
const nav = $('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

// Scroll reveals with staggered timing and a no-observer fallback.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Active navigation indicator.
const sections = $$('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Theme toggle, remembered locally in the visitor's browser.
const themeToggle = $('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light');
const updateThemeLabel = () => {
  const light = document.body.classList.contains('light');
  themeToggle?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
};
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeLabel();
});

// Subtle cursor lighting only on fine-pointer devices.
const glow = $('.cursor-glow');
if (glow && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Certificate preview modal.
const modal = $('#certificate-modal');
const openModal = () => {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.modal-close', modal)?.focus();
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};
$$('[data-modal="certificate-modal"]').forEach(button => button.addEventListener('click', openModal));
$$('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
});

// Back-to-top control and footer year.
const topButton = $('.back-to-top');
window.addEventListener('scroll', () => topButton?.classList.toggle('visible', window.scrollY > 650), { passive: true });
topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
$('#year').textContent = new Date().getFullYear();
