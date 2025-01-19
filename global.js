console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Modified to always return the correct base path
function getBasePath() {
  // Check if we're on GitHub Pages by looking for 'github.io' in the hostname
  const isGitHubPages = location.hostname.includes('github.io');
  if (isGitHubPages) {
    return '/portfolio/';  // Your repository name
  }
  return '/';  // Local development
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

  // Only modify non-external URLs
  if (!url.startsWith('http')) {
    if (ARE_WE_HOME) {
      url = getBasePath() + url;  // Add portfolio prefix on GitHub Pages
    } else {
      url = '../' + url;  // Go up one level when in subpages
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