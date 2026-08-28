import './styles.css';
import { recipes } from './data.js';

// Keep the catalog-friendly query entry in the isolated demo before any
// browser storage or optional license logic can run.
if (new URLSearchParams(location.search).get('demo') === '1') {
  location.replace('/demo/');
} else {
  const slug = 'photo-edit-ledger';
  const apiBase = 'https://api.sociobot.in/api/v1';
  const licenseKey = `sb_license:${slug}`;
  const verdictKey = `${licenseKey}:verdict`;
  const day = 86_400_000;

  const offlineBar = document.querySelector('#offline-bar');
  function updateConnection() { offlineBar.hidden = navigator.onLine; }
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();

  document.querySelector('#hero-title').focus();
  document.querySelector('#route-announcement').textContent = document.title;

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
    const route = document.querySelector('#recipe-route').value;
    const steps = recipes[route];
    const heading = document.createElement('h4');
    heading.textContent = `Migration steps: ${document.querySelector('#recipe-route').selectedOptions[0].textContent}`;
    const list = document.createElement('ol');
    for (const step of steps) {
      const item = document.createElement('li'); item.textContent = step; list.append(item);
    }
    target.replaceChildren(heading, list);
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
      if (verdict.valid) setUnlocked(true, 'License active.');
      else {
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
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
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
  document.querySelector('#recipe-route').addEventListener('change', renderRecipe);

  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
