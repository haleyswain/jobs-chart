<template>
    <div class="chart-container">
        <Bar :data="formattedJobDescriptionData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue';
import { Bar } from 'vue-chartjs';
import type { JobDescription } from '../services/jobService';
import { processJobDataForChart } from '../services/formatDataForChart';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import type { ChartEvent, ActiveElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
    jobsData: JobDescription[];
    selectedMonth?: number | null;
}>();

const emit = defineEmits<{
  barClick: [monthIndex: number, jobs: JobDescription[]];
}>();

const formattedJobDescriptionData = computed(() => {
    const chartData = processJobDataForChart(props.jobsData);
    
    if (!chartData || !chartData.labels) {
      return chartData;
    }
    
    const backgroundColor = chartData.labels.map((_, index) => {
      return props.selectedMonth === index ? '#ff6b6b' : '#42b983';
    });
    
    const hoverBackgroundColor = chartData.labels.map((_, index) => {
      return props.selectedMonth === index ? '#ff5252' : '#369970';
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

const handleBarClick = (event: ChartEvent, elements: ActiveElement[]) => {
  if (elements.length > 0) {
    const clickedIndex = elements[0].index;
    const jobs = getJobsForMonth(clickedIndex);
    emit('barClick', clickedIndex, jobs);
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
  onHover: (event: ChartEvent, elements: ActiveElement[]) => {
    const canvas = event.native?.target as HTMLCanvasElement;
    if (canvas) {
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  }
};

// Force chart resize on mount to fix initial sizing issues
onMounted(async () => {
  await nextTick();
  // Trigger a resize event to ensure chart sizes properly on load
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  height: 400px;
  position: relative;
  margin-bottom: 20px;
}

/* Ensure the canvas responds properly to container size changes */
.chart-container canvas {
  max-width: 100% !important;
  height: auto !important;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .chart-container {
    min-height: 300px;
    height: 300px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    min-height: 250px;
    height: 250px;
  }
}
</style>