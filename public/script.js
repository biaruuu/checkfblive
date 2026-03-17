// ═══════════════════════════════════════════════
//  KiroTools — script.js  |  Shared utilities
// ═══════════════════════════════════════════════

/* ── Tools registry for search ── */
const TOOLS = [
  { name: 'Check Live UID Facebook', desc: 'Check if Facebook UIDs are live or dead', url: 'check-live-uid.html', icon: 'green' },
  { name: 'Find Facebook ID', desc: 'Find Facebook IDs from profile, group, post URL', url: 'find-facebook-id.html', icon: 'gray' },
  { name: 'API Documentation', desc: 'Full API reference for KiroTools', url: 'documentation.html', icon: 'gray' },
];

const TOOL_ICONS = {
  green: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  gray:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
};

/* ── Drawer ── */
const overlay   = document.getElementById('overlay');
const drawer    = document.getElementById('drawer');

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

document.querySelectorAll('.js-open-drawer').forEach(b => b.addEventListener('click', openDrawer));
document.querySelectorAll('.js-close-drawer').forEach(b => b.addEventListener('click', closeDrawer));
overlay.addEventListener('click', closeDrawer);

/* ── Nav sections ── */
document.querySelectorAll('.nav-sec-hdr').forEach(hdr => {
  hdr.addEventListener('click', () => {
    const items = hdr.nextElementSibling;
    const isOpen = items.classList.contains('open');
    hdr.classList.toggle('expanded', !isOpen);
    items.classList.toggle('open', !isOpen);
  });
});

/* ── Drawer search ── */
const dsearch = document.getElementById('drawerSearch');
if (dsearch) {
  dsearch.addEventListener('input', () => {
    const q = dsearch.value.toLowerCase().trim();
    document.querySelectorAll('.nav-item').forEach(item => {
      item.style.display = (!q || item.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
    if (q) document.querySelectorAll('.nav-items').forEach(s => s.classList.add('open'));
  });
}

/* ── Subnav search ── */
const subnavInput    = document.getElementById('subnavSearch');
const searchDropdown = document.getElementById('searchDropdown');

if (subnavInput && searchDropdown) {
  subnavInput.addEventListener('input', () => {
    const q = subnavInput.value.trim().toLowerCase();
    if (!q) { searchDropdown.classList.remove('show'); return; }

    const matches = TOOLS.filter(t =>
      t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );

    if (!matches.length) {
      searchDropdown.innerHTML = `<div class="search-no-result">No tools found for "<strong>${escapeHtml(q)}</strong>"</div>`;
    } else {
      searchDropdown.innerHTML = matches.map(t => `
        <a class="search-result-item" href="${t.url}">
          <div class="search-result-icon ${t.icon}">${TOOL_ICONS[t.icon]}</div>
          <div>
            <div class="search-result-name">${highlightMatch(t.name, q)}</div>
            <div class="search-result-desc">${t.desc}</div>
          </div>
        </a>
      `).join('');
    }
    searchDropdown.classList.add('show');
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!subnavInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('show');
    }
  });

  subnavInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchDropdown.classList.remove('show');
      subnavInput.value = '';
    }
  });
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function highlightMatch(text, q) {
  const i = text.toLowerCase().indexOf(q);
  if (i === -1) return escapeHtml(text);
  return escapeHtml(text.slice(0, i))
    + `<strong>${escapeHtml(text.slice(i, i + q.length))}</strong>`
    + escapeHtml(text.slice(i + q.length));
}

/* ── Info tabs ── */
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

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
});

/* ── Toast ── */
const toastContainer = document.getElementById('toastContainer');

function showToast(msg, type = 'info') {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8h.01M12 12v4"/></svg>`,
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type]||icons.info}<span>${msg}</span>`;
  toastContainer.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 200) }, 2800);
}

/* ── Copy ── */
async function copyToClipboard(text, label = 'Copied') {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    showToast(`${label} to clipboard!`, 'success');
  } catch { showToast('Failed to copy', 'error') }
}

/* ── Export ── */
function exportAsText(content, filename = 'export.txt') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast('File exported!', 'success');
}

/* ── Geist loader SVG HTML ── */
const LOADER_SVG = `<svg class="geist-loader" data-testid="geist-icon" height="15" stroke-linejoin="round" viewBox="0 0 16 16" width="15" style="color:currentColor">
  <g clip-path="url(#clip0_k)">
    <path d="M8 0V4" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.5" d="M8 16V12" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.9" d="M3.29773 1.52783L5.64887 4.7639" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.1" d="M12.7023 1.52783L10.3511 4.7639" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.4" d="M12.7023 14.472L10.3511 11.236" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.6" d="M3.29773 14.472L5.64887 11.236" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.2" d="M15.6085 5.52783L11.8043 6.7639" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.7" d="M0.391602 10.472L4.19583 9.23598" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.3" d="M15.6085 10.4722L11.8043 9.2361" stroke="currentColor" stroke-width="1.5"/>
    <path opacity="0.8" d="M0.391602 5.52783L4.19583 6.7639" stroke="currentColor" stroke-width="1.5"/>
  </g>
  <defs><clipPath id="clip0_k"><rect width="16" height="16" fill="white"/></clipPath></defs>
</svg>`;
