<template>
    <div class="chart-container">
        <h2>Bar Chart</h2>
        <Bar :data="formattedJobDescriptionData" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { JobDescription } from '../services/jobService';
import { processJobDataForChart } from '../services/formatDataForChart';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
    jobsData: JobDescription[];
}>();

const formattedJobDescriptionData = computed(() => {
    return processJobDataForChart(props.jobsData);
});
</script>

<style scoped>
</style>