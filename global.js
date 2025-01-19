console.log('IT’S ALIVE!');


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function getBasePath() {
  // Check if we're on GitHub Pages by looking for 'github.io' in the hostname
  const isGitHubPages = location.hostname.includes('github.io');
  // Get the current path segments
  const pathSegments = window.location.pathname.split('/');
  
  if (isGitHubPages) {
    // Ensure we always return /portfolio/
    return '/portfolio/';
  }
  return '/'; // Local development
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

  // Handle non-external URLs
  if (!url.startsWith('http')) {
    if (ARE_WE_HOME) {
      // When on home page, use absolute paths with base path
      url = basePath + url;
    } else {
      // When in subpages, first go up to base path
      // Remove the current page path and add the new path
      url = basePath + url;
    }
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  // Modify the current page detection
  a.classList.toggle(
    'current',
    a.host === location.host && 
    a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}