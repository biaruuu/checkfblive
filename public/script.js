// ═══════════════════════════════════════════════
//  KiroTools — app.js  |  Shared Utilities
// ═══════════════════════════════════════════════

/* ── Drawer ── */
const overlay  = document.getElementById('overlay');
const drawer   = document.getElementById('drawer');
const openBtns = document.querySelectorAll('.js-open-drawer');
const closeBtns = document.querySelectorAll('.js-close-drawer');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

openBtns.forEach(b => b.addEventListener('click', openDrawer));
closeBtns.forEach(b => b.addEventListener('click', closeDrawer));
overlay.addEventListener('click', closeDrawer);

/* ── Nav sections (expand/collapse) ── */
document.querySelectorAll('.nav-sec-hdr').forEach(hdr => {
  hdr.addEventListener('click', () => {
    const items = hdr.nextElementSibling;
    const isOpen = items.classList.contains('open');
    hdr.classList.toggle('expanded', !isOpen);
    items.classList.toggle('open', !isOpen);
  });
});

/* ── Drawer search filter ── */
const dsearch = document.getElementById('drawerSearch');
if (dsearch) {
  dsearch.addEventListener('input', () => {
    const q = dsearch.value.toLowerCase().trim();
    document.querySelectorAll('.nav-item').forEach(item => {
      const match = item.textContent.toLowerCase().includes(q);
      item.style.display = match ? '' : 'none';
    });
    if (q) {
      document.querySelectorAll('.nav-items').forEach(s => s.classList.add('open'));
    }
  });
}

/* ── Info tabs (Guide / About / FAQ / Review) ── */
document.querySelectorAll('.itab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    const wrap = btn.closest('.info-tabs-wrap');
    wrap.querySelectorAll('.itab-btn').forEach(b => b.classList.remove('active'));
    wrap.querySelectorAll('.itab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    wrap.querySelector(`[data-panel="${target}"]`).classList.add('active');
  });
});

/* ── View mode tabs ── */
document.querySelectorAll('.view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    item.classList.toggle('open');
  });
});

/* ── Toast ── */
const toastContainer = document.getElementById('toastContainer');

function showToast(msg, type = 'info') {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type] || icons.info}<span>${msg}</span>`;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 250);
  }, 2800);
}

/* ── Copy to clipboard ── */
async function copyToClipboard(text, label = 'Copied') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} to clipboard!`, 'success');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${label} to clipboard!`, 'success');
  }
}

/* ── Export as text file ── */
function exportAsText(content, filename = 'export.txt') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast('File exported!', 'success');
}
