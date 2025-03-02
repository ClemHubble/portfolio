import { fetchJSON, renderProjects, fetchGitHubData } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('ClemHubble');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = 
    `
    <table>
    <tr>
      <th> Public Repos </th>
      <th> Public Gists </th>
      <th> Followers </th>
      <th> Following </th>
    </tr>
    <tr>
    <td>${githubData.public_repos}</td>
    <td>${githubData.public_gists}</td>
    <td>${githubData.followers}</td>
    <td>${githubData.following}</td>
    </tr>
    </table>
    `;
}