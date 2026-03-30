// ===== Theme =====
const html = document.documentElement;
const THEME_KEY = 'sent-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  html.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}
function toggleTheme() {
  const cur = html.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeBtn(next);
}
function updateThemeBtn(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== Sidebar =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

// ===== Progress bar =====
function updateProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = pct + '%';
}

// ===== Active nav =====
function updateActiveNav() {
  const sections = document.querySelectorAll('h2[id], h3[id]');
  const navLinks = document.querySelectorAll('nav a');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ===== Generate IDs for headings =====
function generateHeadingIds() {
  const headings = document.querySelectorAll('.content h2, .content h3');
  const counts = {};
  headings.forEach(h => {
    if (!h.id) {
      let base = h.textContent.trim().replace(/[^\u4e00-\u9fa5\w]/g, '-').replace(/-+/g, '-').slice(0, 30);
      counts[base] = (counts[base] || 0) + 1;
      h.id = counts[base] > 1 ? base + '-' + counts[base] : base;
    }
  });
}

// ===== Build TOC =====
function buildTOC() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  const headings = document.querySelectorAll('.content h2');
  nav.innerHTML = '';
  headings.forEach(h => {
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.onclick = () => closeSidebar();
    nav.appendChild(a);
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  generateHeadingIds();
  buildTOC();
  window.addEventListener('scroll', () => {
    updateProgress();
    updateActiveNav();
  }, { passive: true });
});
