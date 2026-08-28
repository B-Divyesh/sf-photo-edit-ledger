import './styles.css';
import { assessRoute } from './data.js';

const defaults = { source: 'lightroom', destination: 'immich' };
const source = document.querySelector('#source');
const destination = document.querySelector('#destination');
const results = document.querySelector('#field-results');

function renderRoute() {
  const route = assessRoute(source.value, destination.value);
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
}

source.addEventListener('change', renderRoute);
destination.addEventListener('change', renderRoute);
document.querySelector('#reset-demo').addEventListener('click', () => {
  source.value = defaults.source;
  destination.value = defaults.destination;
  renderRoute();
  document.querySelector('#route-announcement').textContent = 'Demo reset to the Lightroom to Immich sample.';
});
document.querySelector('#copy-command').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  try { await navigator.clipboard.writeText('sidecar-ledger demo'); button.textContent = 'Copied'; }
  catch { button.textContent = 'Select command to copy'; }
  window.setTimeout(() => { button.textContent = 'Copy command'; }, 1800);
});
renderRoute();
document.querySelector('#demo-title').focus();
document.querySelector('#route-announcement').textContent = 'Demo — sample data, nothing is saved.';
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
