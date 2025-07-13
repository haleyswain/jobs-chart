import type { JobDescription } from './api';

export function processJobDataForChart(jobs: JobDescription[]) {
    const monthCounts: { [key: number]: number } = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // make sure all months are initialized to 0 to ensure all 12 months appear on the chart
    for (let i = 0; i < 12; i++) {
      monthCounts[i] = 0;
    }
  
    jobs.forEach(job => {
      try {
        const date = new Date(job.websiteDatePublished);
        const month = date.getMonth(); 
        if (!isNaN(month)) {
          monthCounts[month]++;
        }
      } catch (e) {
        console.error("Error parsing date:", job.websiteDatePublished, e);
      }
    });
  
    const labels = monthNames;
    const data = labels.map((_, index) => monthCounts[index]);
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Number of Job Descriptions',
          backgroundColor: '#42b983',
          data: data,
        },
      ],
    };
  }