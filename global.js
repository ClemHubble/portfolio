console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function getBasePath() {
  const isGitHubPages = location.hostname.includes('github.io');
  if (isGitHubPages) {
    const repoName = location.pathname.split('/')[1]; // Extracts the repo name
    return `/${repoName}/`;
  }
  return '/'; // For local development
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

const form = document.querySelector('form');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);

  let url = form.action + '?';

  for (let [name, value] of data) {
    url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }

  location.href = url;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data); 
    return data;
  } catch (error) {
    if (url.startsWith('../')) {
      const new_url = url.substring(3)
      const response = await fetch(new_url);
      const data = await response.json();
      console.log('Fetched data:', data); 
      return data;
    }
    console.error('Error fetching or parsing JSON data:', error);
  }
}

if (document.documentElement.classList.contains('projects')) {
  loadProjects();
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  if (!project || !containerElement) {
    console.error('Invalid parameters passed to renderProjects');
    return;
  }

  containerElement.innerHTML = '';

  project.forEach((proj) => {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${proj.title}</${headingLevel}>
      <img src="${proj.image || ''}" alt="${proj.title || 'Project image'}" loading="lazy">
      <div class="project-details">
        <p>${proj.description || 'No description available.'}</p>
        ${proj.year ? `<p class="project-year"><em>c. ${proj.year}</em></p>` : ''}
      </div>
    `;

    containerElement.appendChild(article);
  });
}

async function loadProjects() {
  const projectsContainer = document.querySelector('#projects-container');
  const projectsData = await fetchJSON(`${basePath}lib/projects.json`);

  if (projectsData && projectsContainer) {
    renderProjects(projectsData, projectsContainer, 'h3');
  }
}

if (document.documentElement.classList.contains('projects')) {
  loadProjects();
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}