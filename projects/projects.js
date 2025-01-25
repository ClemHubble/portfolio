import { fetchJSON, renderProjects } from '../global.js';

// Fetch projects data
const projects = await fetchJSON('../lib/projects.json');

// Get the container to display the projects
const projectsContainer = document.querySelector('.projects');

// Render the projects
renderProjects(projects, projectsContainer, 'h2');

// Count the number of projects and update the title
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.innerHTML = `${projects.length} Projects`;
}
