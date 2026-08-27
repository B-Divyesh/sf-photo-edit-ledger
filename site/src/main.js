import './styles.css';
import { assessRoute, recipes } from './data.js';

const slug = 'photo-edit-ledger';
const apiBase = 'https://api.sociobot.in/api/v1';
const licenseKey = `sb_license:${slug}`;
const verdictKey = `${licenseKey}:verdict`;
const day = 86_400_000;

const sourceSelect = document.querySelector('#source');
const destinationSelect = document.querySelector('#destination');
const results = document.querySelector('#field-results');

function renderRoute() {
  const route = assessRoute(sourceSelect.value, destinationSelect.value);
  document.querySelector('#route-title').textContent = `${route.source} → ${route.destination}`;
  const verdict = document.querySelector('#verdict');
  verdict.textContent = route.verdict;
  verdict.className = `verdict verdict-${route.verdict === 'portable' ? 'portable' : route.verdict === 'attention' ? 'lossy' : 'unknown'}`;
  results.replaceChildren(...route.fields.map((field) => {
    const item = document.createElement('li');
    item.className = 'field-row';
    const label = document.createElement('span');
    label.textContent = field.label;
    const state = document.createElement('span');
    state.className = `field-state state-${field.state}`;
    state.textContent = field.state;
    item.append(label, state);
    return item;
  }));
  document.querySelector('#route-note').textContent = route.note;
  document.querySelector('#route-command').textContent = `sidecar-ledger scan ./photos --from ${sourceSelect.value} --to ${destinationSelect.value}`;
  renderRecipe();
}

sourceSelect.addEventListener('change', renderRoute);
destinationSelect.addEventListener('change', renderRoute);
renderRoute();

document.querySelector('#copy-command').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.querySelector('#route-command').textContent);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select command to copy';
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#route-command'));
    selection.addRange(range);
  }
  window.setTimeout(() => { button.textContent = 'Copy command'; }, 1800);
});

const offlineBar = document.querySelector('#offline-bar');
function updateConnection() { offlineBar.hidden = navigator.onLine; }
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
updateConnection();

function cachedVerdict() {
  try { return JSON.parse(localStorage.getItem(verdictKey) || 'null'); } catch { return null; }
}

function setUnlocked(active, notice = '') {
  document.querySelector('#locked-view').hidden = active;
  document.querySelector('#unlocked-view').hidden = !active;
  document.querySelector('#verify-status').textContent = notice;
  if (active) renderRecipe();
}

function renderRecipe() {
  const target = document.querySelector('#recipe-content');
  if (!target || document.querySelector('#unlocked-view').hidden) return;
  const key = `${sourceSelect.value}:${destinationSelect.value}`;
  const steps = recipes[key] || [
    'Create a verified backup of originals and sidecars.',
    'Run Sidecar Ledger and archive its JSON report.',
    'Move a representative sample before the full archive.',
    'Compare field counts and rendered appearance after import.'
  ];
  target.replaceChildren();
  const heading = document.createElement('h4');
  heading.textContent = `${sourceSelect.options[sourceSelect.selectedIndex].text} → ${destinationSelect.options[destinationSelect.selectedIndex].text}`;
  const list = document.createElement('ol');
  for (const step of steps) { const item = document.createElement('li'); item.textContent = step; list.append(item); }
  target.append(heading, list);
}

async function verifyLicense(token, force = false) {
  const cached = cachedVerdict();
  if (!force && cached?.valid && Date.now() - cached.checkedAt < day) {
    setUnlocked(true, 'License verified within the last day.');
    return;
  }
  if (!navigator.onLine) {
    setUnlocked(Boolean(cached?.valid), cached?.valid ? 'Offline — using the last verified license.' : 'Connect once to verify this license.');
    return;
  }
  document.querySelector('#license-status').textContent = 'Checking license…';
  try {
    const response = await fetch(`${apiBase}/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const verdict = await response.json();
    localStorage.setItem(verdictKey, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    if (verdict.valid) {
      setUnlocked(true, 'License active.');
    } else {
      setUnlocked(false);
      document.querySelector('#license-status').textContent = 'License no longer active. Check the token or purchase a new license.';
    }
  } catch {
    setUnlocked(Boolean(cached?.valid), 'Could not reach license verification. Your free tools still work.');
    document.querySelector('#license-status').textContent = 'Could not verify right now. Check your connection and try again.';
  }
}

const params = new URLSearchParams(location.search);
if (params.has('license')) {
  localStorage.setItem(licenseKey, params.get('license').trim());
  params.delete('license');
  const clean = `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`;
  history.replaceState({}, '', clean);
}
const token = localStorage.getItem(licenseKey);
const cached = cachedVerdict();
if (token && cached?.valid) setUnlocked(true, 'Checking license in the background…');
if (token) verifyLicense(token);

document.querySelector('#show-restore').addEventListener('click', () => {
  const form = document.querySelector('#restore-form');
  form.hidden = false;
  document.querySelector('#license-token').focus();
});
document.querySelector('#restore-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const entered = document.querySelector('#license-token').value.trim();
  if (!entered) return;
  localStorage.setItem(licenseKey, entered);
  verifyLicense(entered, true);
});
document.querySelector('#forget-license').addEventListener('click', () => {
  localStorage.removeItem(licenseKey);
  localStorage.removeItem(verdictKey);
  setUnlocked(false);
  document.querySelector('#license-status').textContent = 'License removed from this browser.';
});

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
