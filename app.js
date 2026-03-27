// LogoViking — Main App JS

document.addEventListener('DOMContentLoaded', () => {

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('lv-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
    localStorage.setItem('lv-theme', theme);
  }

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ===== HAMBURGER NAV =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // ===== FILTER TABS =====
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.tool-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-a');
        if (ans) ans.style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        if (a) a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ===== BILLING TOGGLE =====
  const billingToggle = document.getElementById('billingToggle');
  const proPrice = document.getElementById('proPrice');
  const bizPrice = document.getElementById('bizPrice');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel = document.getElementById('yearlyLabel');

  billingToggle?.addEventListener('change', () => {
    const yearly = billingToggle.checked;
    if (proPrice) proPrice.textContent = yearly ? '$6' : '$9';
    if (bizPrice) bizPrice.textContent = yearly ? '$20' : '$29';
    monthlyLabel?.classList.toggle('active', !yearly);
    yearlyLabel?.classList.toggle('active', yearly);
  });

  // ===== NAV SCROLL EFFECT =====
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.style.background = window.scrollY > 20
        ? (document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(248,248,252,0.98)'
            : 'rgba(10,10,15,0.98)')
        : '';
    }
  });

  // ===== INTERSECTION OBSERVER — ANIMATE CARDS IN =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tool-card, .plan-card, .testimonial-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ${i * 0.04}s ease, transform 0.5s ${i * 0.04}s ease, border-color 0.2s, box-shadow 0.2s`;
    observer.observe(el);
  });

});
