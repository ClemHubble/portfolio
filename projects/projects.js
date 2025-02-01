import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.innerHTML = `${projects.length} Projects`;
}

let query = '';

function setQuery(newQuery) {
  query = newQuery.toLowerCase(); 

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  return filteredProjects;
}

function renderPieChartAndLegend(projects) {
  let rolledData = d3.rollups(
    projects, 
    (v) => v.length, 
    (d) => d.year 
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year.toString()
  }));

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);

  let svg = d3.select('svg');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.html(''); 

  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', d3.schemeTableau10[idx]);
  });

  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${d3.schemeTableau10[idx]}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChartAndLegend(projects);

let searchInput = document.getElementsByClassName('searchBar')[0];

searchInput.addEventListener('input', (event) => {
  let updatedProjects = setQuery(event.target.value);
  
  renderProjects(updatedProjects, projectsContainer, 'h2');
  if (projectsTitle) {
    projectsTitle.innerHTML = `${updatedProjects.length} Projects`;
  }

  renderPieChartAndLegend(updatedProjects);
});
