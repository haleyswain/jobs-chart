<template>
    <div class="chart-container">
        <h2>Bar Chart</h2>
        <Bar :data="formattedJobDescriptionData" :options="chartOptions" />
        <JobDetailsTable 
          :selectedJobs="selectedJobs" 
          :selectedMonth="selectedMonth" 
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import type { JobDescription } from '../services/jobService';
import { processJobDataForChart } from '../services/formatDataForChart';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import JobDetailsTable from './JobDetailsTable.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
    jobsData: JobDescription[];
}>();

const selectedMonth = ref<number | null>(null);
const selectedJobs = ref<JobDescription[]>([]);

const formattedJobDescriptionData = computed(() => {
    const chartData = processJobDataForChart(props.jobsData);
    
    if (!chartData || !chartData.labels) {
      return chartData;
    }
    
    const backgroundColor = chartData.labels.map((_, index) => {
      return selectedMonth.value === index ? '#ff6b6b' : '#42b983';
    });
    
    const hoverBackgroundColor = chartData.labels.map((_, index) => {
      return selectedMonth.value === index ? '#ff5252' : '#369970';
    });
    
    return {
      ...chartData,
      datasets: chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor,
        hoverBackgroundColor
      }))
    };
});

const getJobsForMonth = (monthIndex: number): JobDescription[] => {
  return props.jobsData.filter(job => {
    const date = new Date(job.websiteDatePublished);
    return !isNaN(date.getTime()) && date.getUTCMonth() === monthIndex;
  });
};

const handleBarClick = (event: any, elements: any[]) => {
  if (elements.length > 0) {
    const clickedIndex = elements[0].index;
    selectedMonth.value = clickedIndex;
    selectedJobs.value = getJobsForMonth(clickedIndex);
  }
};

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Job Descriptions by Month'
    },
    legend: {
      display: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Jobs'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    }
  },
  onClick: handleBarClick,
  onHover: (event: any, elements: any[]) => {
    const canvas = event.native?.target;
    if (canvas) {
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  }
};
</script>

<style scoped>
</style>