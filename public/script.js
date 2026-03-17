// ════════════════════════════════════════════════
//  KiroTools — script.js v3
// ════════════════════════════════════════════════

/* ── Tool registry ── */
const TOOLS = [
  {
    name: 'Check Live UID Facebook',
    desc: 'Verify if Facebook UIDs are live or dead',
    url:  'check-live-uid.html',
    cls:  'g',
    svg:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    name: 'Find Facebook ID',
    desc: 'Find Facebook numeric IDs from any URL',
    url:  'find-facebook-id.html',
    cls:  'k',
    svg:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`
  },
  {
    name: 'API Documentation',
    desc: 'Full API reference for KiroTools',
    url:  'documentation.html',
    cls:  'k',
    svg:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
  },
];

/* ── Geist loader ── */
const GEIST = `<svg class="geist" height="14" viewBox="0 0 16 16" width="14" style="color:currentColor"><g clip-path="url(#gc)"><path d="M8 0V4" stroke="currentColor" stroke-width="1.5"/><path opacity=".5" d="M8 16V12" stroke="currentColor" stroke-width="1.5"/><path opacity=".9" d="M3.3 1.53L5.65 4.76" stroke="currentColor" stroke-width="1.5"/><path opacity=".1" d="M12.7 1.53L10.35 4.76" stroke="currentColor" stroke-width="1.5"/><path opacity=".4" d="M12.7 14.47L10.35 11.24" stroke="currentColor" stroke-width="1.5"/><path opacity=".6" d="M3.3 14.47L5.65 11.24" stroke="currentColor" stroke-width="1.5"/><path opacity=".2" d="M15.61 5.53L11.8 6.76" stroke="currentColor" stroke-width="1.5"/><path opacity=".7" d="M.39 10.47L4.2 9.24" stroke="currentColor" stroke-width="1.5"/><path opacity=".3" d="M15.61 10.47L11.8 9.24" stroke="currentColor" stroke-width="1.5"/><path opacity=".8" d="M.39 5.53L4.2 6.76" stroke="currentColor" stroke-width="1.5"/></g><defs><clipPath id="gc"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`;

/* ══════════════════════════════
   DRAWER
══════════════════════════════ */
const _ov = document.getElementById('overlay');
const _dr = document.getElementById('drawer');

function openDrawer()  { _dr.classList.add('open'); _ov.classList.add('open'); document.body.style.overflow = 'hidden' }
function closeDrawer() { _dr.classList.remove('open'); _ov.classList.remove('open'); document.body.style.overflow = '' }

document.querySelectorAll('.js-open').forEach(b  => b.addEventListener('click', openDrawer));
document.querySelectorAll('.js-close').forEach(b => b.addEventListener('click', closeDrawer));
_ov.addEventListener('click', closeDrawer);

/* Nav sections */
document.querySelectorAll('.nav-sec-hdr').forEach(h => {
  h.addEventListener('click', () => {
    const list = h.nextElementSibling;
    const open = list.classList.contains('open');
    h.classList.toggle('exp', !open);
    list.classList.toggle('open', !open);
  });
});

/* Drawer filter */
const _ds = document.getElementById('dsInput');
if (_ds) {
  _ds.addEventListener('input', () => {
    const q = _ds.value.toLowerCase().trim();
    document.querySelectorAll('.nav-link').forEach(l => {
      l.style.display = (!q || l.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
    if (q) document.querySelectorAll('.nav-list').forEach(s => s.classList.add('open'));
  });
}

/* ══════════════════════════════
   SEARCH
══════════════════════════════ */
function renderResults(tools, q) {
  if (!tools.length) return `<div class="s-empty">No tools found for "<strong>${esc(q)}</strong>"</div>`;
  return tools.map(t => `
    <a class="s-item" href="${t.url}">
      <div class="s-ico ${t.cls}">${t.svg}</div>
      <div>
        <div class="s-name">${hl(t.name, q)}</div>
        <div class="s-desc">${t.desc}</div>
      </div>
    </a>`).join('');
}
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function hl(text, q) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return esc(text);
  return esc(text.slice(0,i)) + `<strong>${esc(text.slice(i,i+q.length))}</strong>` + esc(text.slice(i+q.length));
}

function attachSearch(inId, dropId) {
  const inp  = document.getElementById(inId);
  const drop = document.getElementById(dropId);
  if (!inp || !drop) return;
  inp.addEventListener('input', () => {
    const q = inp.value.trim();
    if (!q) { drop.classList.remove('open'); return }
    drop.innerHTML = renderResults(TOOLS.filter(t =>
      t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase())
    ), q);
    drop.classList.add('open');
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Escape') { drop.classList.remove('open'); inp.value = '' } });
  document.addEventListener('click', e => {
    if (!inp.contains(e.target) && !drop.contains(e.target)) drop.classList.remove('open');
  });
}

attachSearch('snavInput', 'snavDrop');
attachSearch('mobInput',  'mobDrop');

/* Mobile search bar toggle */
const _msBtn  = document.getElementById('mobSearchBtn');
const _msBar  = document.getElementById('mobSearchBar');
const _page   = document.getElementById('mainPage');
if (_msBtn && _msBar) {
  _msBtn.addEventListener('click', () => {
    const nowOpen = _msBar.classList.toggle('open');
    if (_page) _page.classList.toggle('mob-open', nowOpen);
    if (nowOpen) setTimeout(() => document.getElementById('mobInput')?.focus(), 60);
    else { if (document.getElementById('mobInput')) document.getElementById('mobInput').value = ''; if (document.getElementById('mobDrop')) document.getElementById('mobDrop').classList.remove('open') }
  });
}

/* ══════════════════════════════
   INFO TABS
══════════════════════════════ */
document.querySelectorAll('.itab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab  = btn.dataset.tab;
    const wrap = btn.closest('.itabs');
    wrap.querySelectorAll('.itab').forEach(b => b.classList.remove('on'));
    wrap.querySelectorAll('.ipanel').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    wrap.querySelector(`[data-panel="${tab}"]`).classList.add('on');
  });
});

/* FAQ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
});

/* ══════════════════════════════
   MODAL TOAST
══════════════════════════════ */
// Create overlay container once
let _toastWrap = document.getElementById('toastOverlay');
if (!_toastWrap) {
  _toastWrap = document.createElement('div');
  _toastWrap.className = 'toast-overlay';
  _toastWrap.id = 'toastOverlay';
  const stack = document.createElement('div');
  stack.className = 'toast-stack';
  stack.id = 'toastStack';
  _toastWrap.appendChild(stack);
  document.body.appendChild(_toastWrap);
}
const _stack = document.getElementById('toastStack');

const TOAST_ICONS = {
  ok:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
  err: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
  def: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8h.01M12 12v4"/></svg>`,
};

function showToast(msg, type = 'info') {
  const cls  = type === 'success' ? 'ok' : type === 'error' ? 'err' : '';
  const icon = cls === 'ok' ? TOAST_ICONS.ok : cls === 'err' ? TOAST_ICONS.err : TOAST_ICONS.def;

  const t = document.createElement('div');
  t.className = `toast${cls ? ' ' + cls : ''}`;
  t.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" aria-label="Dismiss">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>`;

  t.querySelector('.toast-close').addEventListener('click', () => dismissToast(t));
  _stack.prepend(t);

  // Auto-dismiss
  const timer = setTimeout(() => dismissToast(t), 3200);
  t._timer = timer;
}

function dismissToast(t) {
  clearTimeout(t._timer);
  t.classList.add('out');
  setTimeout(() => t.remove(), 250);
}

/* ══════════════════════════════
   CLIPBOARD / EXPORT
══════════════════════════════ */
async function clip(text, label = 'Copied') {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else {
      const a = document.createElement('textarea');
      a.value = text; a.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(a); a.select(); document.execCommand('copy'); document.body.removeChild(a);
    }
    showToast(`${label}!`, 'success');
  } catch { showToast('Copy failed', 'error') }
}

function saveFile(text, name = 'export.txt') {
  const b = new Blob([text], { type: 'text/plain' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = name; a.click();
  URL.revokeObjectURL(u);
  showToast('File exported!', 'success');
}
