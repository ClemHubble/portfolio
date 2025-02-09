let data = [];
let commits = [];

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

function displayStats() {
    processCommits();

    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    // Total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    // Total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);

    // Additional stats
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