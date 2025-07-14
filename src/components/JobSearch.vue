<template>
  <div class="job-search">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading job data...</p>
    </div>
    <div v-else-if="error" class="error">
      <h3>⚠️ Error Loading Job Data</h3>
      <p>{{ error }}</p>
      <button @click="searchJobs" class="retry-button">Try Again</button>
    </div>
    <div v-else>
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
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  color: #c33;
  text-align: center;
}

.error h3 {
  margin: 0 0 10px 0;
  color: #c33;
}

.error p {
  margin: 0 0 15px 0;
}

.retry-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #369970;
}

.retry-button:active {
  background-color: #2d7a5a;
}
</style> 