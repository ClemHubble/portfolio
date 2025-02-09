let data = [];
let commits = [];

const width = 1000;
const height = 600;

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
    createScatterplot(); 
}

function processCommits() {
    commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        
        let ret = {
            id: commit,
            url: 'https://github.com/portfolio/commit/' + commit,
            author,
            date,
            time,
            timezone,
            datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: lines.length,
        };
        
        Object.defineProperty(ret, 'lines', {
            value: lines,
            enumerable: false, 
            writable: false,  
            configurable: false, 
        });
        
        return ret;
    });
}

function createScatterplot() {
    processCommits();

    console.log("Commits:", commits);

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

    const dots = svg.append('g').attr('class', 'dots');

    dots
      .selectAll('circle')
      .data(commits)
      .join('circle')
      .attr('cx', (d) => xScale(d.datetime))
      .attr('cy', (d) => yScale(d.hourFrac))
      .attr('r', 5)
      .attr('fill', 'steelblue');
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
});
