// let data = [];
// let commits = [];
// let selectedCommits = [];
// let xScale;
// let yScale;
// let brushSelection = null;
// let commitProgress = 100;
// let timeScale;
// let commitMaxTime; 

// const timeSlider = document.getElementById('timeSlider');
// const selectedTime = document.getElementById('selectedTime');

// const width = 1000;
// const height = 600;

// async function loadData() {
//     data = await d3.csv('loc.csv', (row) => ({
//         ...row,
//         line: Number(row.line), 
//         depth: Number(row.depth),
//         length: Number(row.length),
//         date: new Date(row.date + 'T00:00' + row.timezone),
//         datetime: new Date(row.datetime),
//     }));

//     displayStats();
//     createScatterplot(); 
// }

// function processCommits() {
//     const commitMap = new Map(); 

//     commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
//         let first = lines[0];
//         let { author, date, time, timezone, datetime } = first;

//         let totalChanges = lines.length;
//         let additions = totalChanges;
//         let deletions = 0;

//         for (const entry of lines) {
//             const prevLength = commitMap.get(entry.file) || 0;
//             const lengthDiff = prevLength - entry.length;

//             if (lengthDiff > 0) {
//                 deletions += lengthDiff;
//             }

//             commitMap.set(entry.file, entry.length);
//         }

//         return {
//             id: commit,
//             url: `https://github.com/portfolio/commit/${commit}`,
//             author,
//             date,
//             time,
//             timezone,
//             datetime,
//             hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//             totalLines: totalChanges,
//             additions: additions,
//             deletions: deletions
//         };
//     });
// }

// function updateTimeDisplay() {
//     let commitProgress = Number(timeSlider.value);
//     if (commitProgress === -1){
//         selectedTime.textContent = 'any time';
//     } else {
//         selectedTime.textContent = timeScale.invert(commitProgress).toLocaleString();
//         console.log(timeScale.invert(commitProgress).toLocaleString()); 
//     }
// }

// function brushSelector() {
//     const svg = document.querySelector('svg');
//     d3.select(svg)
//         .call(d3.brush().on('start brush end', brushed));
// }

// function brushed(evt) {
//     brushSelection = evt.selection;
//     selectedCommits = !brushSelection
//       ? []
//       : commits.filter((commit) => {
//           let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
//           let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
//           let x = xScale(commit.datetime);
//           let y = yScale(commit.hourFrac);
  
//           return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
//         });
//     updateSelection();
//     updateSelectionCount();
//     updateLanguageBreakdown(selectedCommits); 

// }

// function isCommitSelected(commit) {
//     return selectedCommits.some(sc => sc.id === commit.id);
// }

// function updateSelection() {
//     d3.selectAll('circle')
//         .classed('selected', d => isCommitSelected(d))
//         .style('fill', d => isCommitSelected(d) ? '#ff6b6b' : (d.hourFrac < 6 || d.hourFrac >= 18 ? '#4477AA' : '#DD7733'));
// }

// function updateSelectionCount() {
//     const countElement = document.getElementById('selection-count');
//     countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
// }


// function updateLanguageBreakdown(selectedCommits) {
//     const container = document.getElementById('language-breakdown');

//     if (!selectedCommits || selectedCommits.length === 0) {
//         container.innerHTML = '';
//         return;
//     }

//     const selectedLines = data.filter(d => 
//         selectedCommits.some(commit => commit.id === d.commit)
//     );

//     const breakdown = d3.rollup(
//         selectedLines,
//         v => v.length,
//         d => d.type
//     );

//     container.innerHTML = '';

//     for (const [language, count] of breakdown) {
//         const proportion = count / selectedLines.length;
//         const formatted = d3.format('.1~%')(proportion);

//         container.innerHTML += `
//             <dt>${language}</dt>
//             <dd>${count} lines (${formatted})</dd>
//         `;
//     }

//     return breakdown;
// }

// function createScatterplot() {
//     processCommits();

//     console.log("Commits:", commits);

//     const width = 800;
//     const height = 400;

//     const margin = { top: 20, right: 30, bottom: 40, left: 50 };

//     const usableArea = {
//         top: margin.top,
//         right: width - margin.right,
//         bottom: height - margin.bottom,
//         left: margin.left,
//         width: width - margin.left - margin.right,
//         height: height - margin.top - margin.bottom,
//     };

//     const svg = d3
//         .select('#chart')
//         .append('svg')
//         .attr('viewBox', `0 0 ${width} ${height}`)
//         .style('overflow', 'visible');

//     xScale = d3.scaleTime()
//         .domain(d3.extent(commits, (d) => d.datetime))
//         .range([usableArea.left, usableArea.right])
//         .nice();

//     yScale = d3.scaleLinear()
//         .domain([24, 0])
//         .range([usableArea.bottom, usableArea.top]);

//     svg.append('g')
//         .attr('class', 'gridlines')
//         .attr('transform', `translate(${usableArea.left}, 0)`)
//         .call(
//             d3.axisLeft(yScale)
//                 .tickSize(-usableArea.width)
//                 .tickFormat('')
//         )
//         .style('color', '#ccc')
//         .style('opacity', 0.3)
//         .call(g => {
//             g.selectAll('.domain').remove();
//             g.selectAll('line').style('stroke-dasharray', '2,2');
//         });

//     const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d'));
//     const yAxis = d3
//         .axisLeft(yScale)
//         .tickFormat((d) => (d === 24 ? '24' : String(d).padStart(2, '0') + ':00'))
//         .ticks(12);

//     svg.append('g')
//         .attr('class', 'x-axis')
//         .attr('transform', `translate(0, ${usableArea.bottom})`)
//         .call(xAxis)
//         .select('.domain')
//         .style('stroke', '#000');

//     svg.append('g')
//         .attr('class', 'y-axis')
//         .attr('transform', `translate(${usableArea.left}, 0)`)
//         .call(yAxis)
//         .select('.domain')
//         .style('stroke', '#000');

//     function updateTooltipContent(commit) {
//         const tooltip = document.getElementById('commit-tooltip');
//         const link = document.getElementById('commit-link');
//         const date = document.getElementById('commit-date');
//         const time = document.getElementById('commit-time');
//         const author = document.getElementById('commit-author');
//         const lines = document.getElementById('commit-lines');

//         if (!commit || Object.keys(commit).length === 0) {
//             tooltip.hidden = true;  
//             return;
//         }

//         link.href = commit.url;
//         link.textContent = commit.id;
//         date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
//         time.textContent = commit.datetime?.toLocaleString('en', { timeStyle: 'short' });
//         author.textContent = commit.author;
//         lines.textContent = `+${commit.additions} -${commit.deletions}`;
//     }

//     function updateTooltipVisibility(isVisible) {
//         const tooltip = document.getElementById('commit-tooltip');
//         if (isVisible) {
//             tooltip.classList.add('visible');
//         } else {
//             tooltip.classList.remove('visible');
//         }
//     }

//     function updateTooltipPosition(event) {
//         const tooltip = document.getElementById('commit-tooltip');
//         tooltip.style.left = `${event.clientX + 10}px`; 
//         tooltip.style.top = `${event.clientY + 10}px`;
//     }

//     const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

//     const rScale = d3
//         .scaleSqrt() 
//         .domain([minLines, maxLines])
//         .range([2, 30]); 

//     const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

//     const dots = svg.append('g').attr('class', 'dots');

//     dots
//         .selectAll('circle')
//         .data(sortedCommits)
//         .join('circle')
//         .attr('cx', (d) => xScale(d.datetime))
//         .attr('cy', (d) => yScale(d.hourFrac))
//         .attr('r', (d) => rScale(d.totalLines)) 
//         .style('fill', (d) => {
//             const hour = d.hourFrac;
//             return hour < 6 || hour >= 18 ? '#4477AA' : '#DD7733';
//         })
//         .style('fill-opacity', 0.7) 
//         .on('mouseenter', (event, commit) => {
//             updateTooltipContent(commit);
//             updateTooltipVisibility(true);
//             updateTooltipPosition(event);
//             d3.select(event.currentTarget).classed('selected', true).style('fill-opacity', 1); 
//         })
//         .on('mousemove', (event) => {
//             updateTooltipPosition(event);
//         })
//         .on('mouseleave', (event) => {
//             updateTooltipContent({});
//             updateTooltipVisibility(false);
//             d3.select(event.currentTarget).classed('selected', false).style('fill-opacity', 0.7); 
//         });

//     brushSelector();
// }

// function displayStats() {
//     processCommits();

//     const dl = d3.select('#stats').append('dl').attr('class', 'stats');

//     dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
//     dl.append('dd').text(data.length);

//     dl.append('dt').text('Total commits');
//     dl.append('dd').text(commits.length);

//     dl.append('dt').text('Number of files');
//     dl.append('dd').text(d3.group(data, d => d.file).size);

//     dl.append('dt').text('Maximum file length (in lines)');
//     dl.append('dd').text(d3.max(data, d => d.line));

//     dl.append('dt').text('Average file length (in lines)');
//     dl.append('dd').text(d3.mean(d3.rollups(data, v => d3.max(v, d => d.line), d => d.file), d => d[1]));

//     dl.append('dt').text('Time of day most work is done');
//     const workByPeriod = d3.rollups(
//         data,
//         v => v.length,
//         d => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
//     );
//     dl.append('dd').text(d3.greatest(workByPeriod, d => d[1])?.[0]);
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     await loadData();
//     timeScale = d3.scaleTime([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)], [0, 100]);
//     commitMaxTime = timeScale.invert(commitProgress);
// });

// timeSlider.addEventListener('input', updateTimeDisplay);
// updateTimeDisplay();

let data = [];
let commits = [];
let filteredCommits = []; // New variable for filtered commits
let selectedCommits = [];
let xScale;
let yScale;
let brushSelection = null;
let commitProgress = 100;
let timeScale;
let commitMaxTime; 

const timeSlider = document.getElementById('timeSlider');
const selectedTime = document.getElementById('selectedTime');

const width = 1000;
const height = 600;

// Add CSS for transitions
const styleElement = document.createElement('style');
styleElement.textContent = `
  circle {
    transition: r 0.3s ease-out, cx 0.3s ease-out, cy 0.3s ease-out;
  }
  
  @starting-style {
    circle {
      r: 0;
    }
  }
`;
document.head.appendChild(styleElement);

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), 
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));

    displayStats();
    processCommits();
    // Initial setup with all commits
    filteredCommits = [...commits];
    updateScatterplot(filteredCommits);
}

function processCommits() {
    const commitMap = new Map(); 

    commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;

        let totalChanges = lines.length;
        let additions = totalChanges;
        let deletions = 0;

        for (const entry of lines) {
            const prevLength = commitMap.get(entry.file) || 0;
            const lengthDiff = prevLength - entry.length;

            if (lengthDiff > 0) {
                deletions += lengthDiff;
            }

            commitMap.set(entry.file, entry.length);
        }

        return {
            id: commit,
            url: `https://github.com/portfolio/commit/${commit}`,
            author,
            date,
            time,
            timezone,
            datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: totalChanges,
            additions: additions,
            deletions: deletions
        };
    });
}

function filterCommitsByTime() {
    commitMaxTime = timeScale.invert(commitProgress);
    filteredCommits = commits.filter(commit => commit.datetime <= commitMaxTime);
    
    // Update visuals with filtered data
    updateScatterplot(filteredCommits);
    
    // Also update your selection if needed
    if (selectedCommits.length > 0) {
        selectedCommits = selectedCommits.filter(commit => 
            filteredCommits.some(fc => fc.id === commit.id)
        );
        updateSelection();
        updateLanguageBreakdown(selectedCommits);
    }
    
    updateSelectionCount();
}

function updateTimeDisplay() {
    commitProgress = Number(timeSlider.value);
    if (commitProgress === -1) {
        selectedTime.textContent = 'any time';
        // Show all commits when slider is at -1
        filteredCommits = [...commits];
        updateScatterplot(filteredCommits);
    } else {
        commitMaxTime = timeScale.invert(commitProgress);
        selectedTime.textContent = commitMaxTime.toLocaleString();
        filterCommitsByTime();
    }
}

function brushSelector() {
    const svg = document.querySelector('svg');
    d3.select(svg)
        .call(d3.brush().on('start brush end', brushed));
}

function brushed(evt) {
    brushSelection = evt.selection;
    selectedCommits = !brushSelection
      ? []
      : filteredCommits.filter((commit) => {
          let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
          let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
          let x = xScale(commit.datetime);
          let y = yScale(commit.hourFrac);
  
          return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
        });
    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown(selectedCommits); 
}

function isCommitSelected(commit) {
    return selectedCommits.some(sc => sc.id === commit.id);
}

function updateSelection() {
    d3.selectAll('circle')
        .classed('selected', d => isCommitSelected(d))
        .style('fill', d => isCommitSelected(d) ? '#ff6b6b' : (d.hourFrac < 6 || d.hourFrac >= 18 ? '#4477AA' : '#DD7733'));
}

function updateSelectionCount() {
    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
}

function updateLanguageBreakdown(selectedCommits) {
    const container = document.getElementById('language-breakdown');

    if (!selectedCommits || selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const selectedLines = data.filter(d => 
        selectedCommits.some(commit => commit.id === d.commit)
    );

    const breakdown = d3.rollup(
        selectedLines,
        v => v.length,
        d => d.type
    );

    container.innerHTML = '';

    for (const [language, count] of breakdown) {
        const proportion = count / selectedLines.length;
        const formatted = d3.format('.1~%')(proportion);

        container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
    }

    return breakdown;
}

function updateScatterplot(filteredData) {
    // Remove existing SVG to redraw
    d3.select('#chart svg').remove();
    
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    // Update scales with filtered data
    xScale = d3.scaleTime()
        .domain(d3.extent(filteredData, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3.scaleLinear()
        .domain([24, 0])
        .range([usableArea.bottom, usableArea.top]);

    svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(
            d3.axisLeft(yScale)
                .tickSize(-usableArea.width)
                .tickFormat('')
        )
        .style('color', '#ccc')
        .style('opacity', 0.3)
        .call(g => {
            g.selectAll('.domain').remove();
            g.selectAll('line').style('stroke-dasharray', '2,2');
        });

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3
        .axisLeft(yScale)
        .tickFormat((d) => (d === 24 ? '24' : String(d).padStart(2, '0') + ':00'))
        .ticks(12);

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis)
        .select('.domain')
        .style('stroke', '#000');

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis)
        .select('.domain')
        .style('stroke', '#000');

    function updateTooltipContent(commit) {
        const tooltip = document.getElementById('commit-tooltip');
        const link = document.getElementById('commit-link');
        const date = document.getElementById('commit-date');
        const time = document.getElementById('commit-time');
        const author = document.getElementById('commit-author');
        const lines = document.getElementById('commit-lines');

        if (!commit || Object.keys(commit).length === 0) {
            tooltip.hidden = true;  
            return;
        }

        link.href = commit.url;
        link.textContent = commit.id;
        date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
        time.textContent = commit.datetime?.toLocaleString('en', { timeStyle: 'short' });
        author.textContent = commit.author;
        lines.textContent = `+${commit.additions} -${commit.deletions}`;
    }

    function updateTooltipVisibility(isVisible) {
        const tooltip = document.getElementById('commit-tooltip');
        if (isVisible) {
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    }

    function updateTooltipPosition(event) {
        const tooltip = document.getElementById('commit-tooltip');
        tooltip.style.left = `${event.clientX + 10}px`; 
        tooltip.style.top = `${event.clientY + 10}px`;
    }

    // Update rScale with filtered data
    const [minLines, maxLines] = d3.extent(filteredData, (d) => d.totalLines);
    const rScale = d3
        .scaleSqrt() 
        .domain([minLines, maxLines])
        .range([2, 30]); 

    const sortedCommits = d3.sort(filteredData, (d) => -d.totalLines);

    const dots = svg.append('g').attr('class', 'dots');

    dots
        .selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines)) 
        .style('fill', (d) => {
            const hour = d.hourFrac;
            return hour < 6 || hour >= 18 ? '#4477AA' : '#DD7733';
        })
        .style('fill-opacity', 0.7) 
        .on('mouseenter', (event, commit) => {
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
            d3.select(event.currentTarget).classed('selected', true).style('fill-opacity', 1); 
        })
        .on('mousemove', (event) => {
            updateTooltipPosition(event);
        })
        .on('mouseleave', (event) => {
            updateTooltipContent({});
            updateTooltipVisibility(false);
            d3.select(event.currentTarget).classed('selected', isCommitSelected(event.target.__data__)).style('fill-opacity', 0.7); 
        });
        
    // Apply selection styling to initially selected commits
    updateSelection();
    
    // Add brush after creating the dots
    brushSelector();
}

function displayStats() {
    processCommits();

    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);

    dl.append('dt').text('Number of files');
    dl.append('dd').text(d3.group(data, d => d.file).size);

    dl.append('dt').text('Maximum file length (in lines)');
    dl.append('dd').text(d3.max(data, d => d.line));

    dl.append('dt').text('Average file length (in lines)');
    dl.append('dd').text(d3.mean(d3.rollups(data, v => d3.max(v, d => d.line), d => d.file), d => d[1]));

    dl.append('dt').text('Time of day most work is done');
    const workByPeriod = d3.rollups(
        data,
        v => v.length,
        d => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    );
    dl.append('dd').text(d3.greatest(workByPeriod, d => d[1])?.[0]);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    timeScale = d3.scaleTime()
        .domain([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)])
        .range([0, 100]);
    
    // Set up time slider event
    timeSlider.addEventListener('input', updateTimeDisplay);
    updateTimeDisplay();
});