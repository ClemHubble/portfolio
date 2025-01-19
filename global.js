console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function getBasePath() {
  // Get the base path depending on whether we're on GitHub Pages or local
  const path = location.pathname;
  const baseDir = path.substring(0, path.lastIndexOf('/'));
  return baseDir;
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

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  if (!url.startsWith('http')) {
    if (ARE_WE_HOME) {
        url = url; // Keep as is for home page
    } else {
        // Use absolute path from root of the project
        url = `${getBasePath()}/../${url}`;
    }
  }

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