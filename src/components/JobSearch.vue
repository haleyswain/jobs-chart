<template>
  <div class="job-search">
    <BarChart 
      :jobsData="jobDescriptions" 
      :selectedMonth="selectedMonth"
      @barClick="handleBarClick" 
    />
    <JobDetailsTable 
      :selectedJobs="selectedJobs" 
      :selectedMonth="selectedMonth" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getJobDescriptions } from '../services/jobService';
import type { JobDescription } from '../services/jobService';
import BarChart from './BarChart.vue';
import JobDetailsTable from './JobDetailsTable.vue';

const searchQuery = ref('');
const jobDescriptions = ref<JobDescription[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hasSearched = ref(false);

const selectedMonth = ref<number | null>(null);
const selectedJobs = ref<JobDescription[]>([]);

const searchJobs = async () => {
  loading.value = true;
  error.value = null;
  hasSearched.value = true;
  
  try {
    const jobs = await getJobDescriptions(searchQuery.value);
    jobDescriptions.value = jobs;
  } catch (err) {
    jobDescriptions.value = [];
    if (err) {
      error.value = `Error`;
    } else {
      error.value = 'An unexpected error occurred while searching for jobs';
    }
    console.error('Failed to search jobs:', err);
  } finally {
    loading.value = false;
  }
};

const handleBarClick = (monthIndex: number, jobs: JobDescription[]) => {
  selectedMonth.value = monthIndex;
  selectedJobs.value = jobs;
};

onMounted(() => {
  searchJobs();
});
</script>

<style scoped>
.job-search {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.search-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.search-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  color: #c33;
}

.results h3 {
  margin-bottom: 20px;
  color: #333;
}

.job-list {
  display: grid;
  gap: 20px;
}

.job-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.job-title {
  margin: 0 0 15px 0;
  color: #007bff;
  font-size: 1.2em;
}

.job-details {
  display: grid;
  gap: 8px;
}

.job-details p {
  margin: 0;
  color: #555;
}

.job-details strong {
  color: #333;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style> 