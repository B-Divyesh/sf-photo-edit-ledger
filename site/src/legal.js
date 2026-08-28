import './styles.css';

const heading = document.querySelector('h1');
if (heading) heading.focus();
const announcement = document.querySelector('#route-announcement');
if (announcement) announcement.textContent = document.title;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
