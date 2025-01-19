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

const themeSwitcher = document.getElementById('theme-switcher');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  
  if (colorScheme === 'light dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', colorScheme);
  }

  themeSwitcher.value = colorScheme;
}

themeSwitcher.addEventListener('change', (event) => {
  const selectedTheme = event.target.value;

  localStorage.colorScheme = selectedTheme;

  setColorScheme(selectedTheme);
});

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark');
}