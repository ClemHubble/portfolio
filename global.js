console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Function to detect if the site is running on GitHub Pages
function isGitHubPages() {
  return window.location.hostname === 'ClemHubble.github.io' && window.location.pathname.startsWith('/portfolio');
}

// Base path for GitHub Pages (only needed on GitHub Pages)
const basePath = isGitHubPages() ? '/portfolio' : '';

// Example of using basePath to adjust links dynamically
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/ClemHubble/portfolio', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Adjust URL for GitHub Pages (if applicable)
  url = !ARE_WE_HOME && !url.startsWith('http') ? basePath + '/' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}