console.log('IT’S ALIVE!');


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function getBasePath() {
  const isGitHubPages = location.hostname.includes('github.io');
  const pathSegments = window.location.pathname.split('/');
  
  if (isGitHubPages) {
    return '/portfolio/';
  }
  return '/'; 
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/ClemHubble', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');
const basePath = getBasePath();

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    if (ARE_WE_HOME) {
      url = basePath + url;
    } else {
      url = basePath + url;
    }
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && 
    a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

// Add theme switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-switcher">
      <option value="light dark" selected>Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

// Handle theme switching
const themeSwitcher = document.getElementById('theme-switcher');
themeSwitcher.addEventListener('change', (event) => {
  const selectedTheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', selectedTheme);
  if (selectedTheme === 'light dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }
});