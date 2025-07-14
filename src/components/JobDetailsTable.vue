<template>
  <div v-if="selectedJobs.length > 0" class="job-details-table">
    <h3>Job Details for {{ monthName }}</h3>
    <table class="jobs-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Organization</th>
          <th>Location</th>
          <th>Date Published</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in selectedJobs" :key="`${job.websiteTitle}-${job.websiteOrganization}-${job.websiteDatePublished}`">
          <td>{{ job.websiteTitle }}</td>
          <td>{{ job.websiteOrganization }}</td>
          <td>{{ job.websiteLocation }}</td>
          <td>{{ formatDate(job.websiteDatePublished) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JobDescription } from '../services/jobService';
import { formatDate } from '../utils/dateFormatter';

const props = defineProps<{
  selectedJobs: JobDescription[];
  selectedMonth: number | null;
}>();

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthName = computed(() => {
  return props.selectedMonth !== null ? monthNames[props.selectedMonth] : '';
});
</script>

<style scoped>
.job-details-table {
  margin-top: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  min-width: 600px;
}

.jobs-table th,
.jobs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
  max-width: 200px;
}

.jobs-table th {
  font-weight: 600;
  background-color: #f8f9fa;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 1;
}

h3 {
  color: #495057;
  margin-bottom: 10px;
}
/* Tablet */
@media (max-width: 768px) {
  .table-scroll-hint {
    display: block;
  }
  
  .jobs-table {
    min-width: 500px;
    font-size: 14px;
  }
  
  .jobs-table th,
  .jobs-table td {
    padding: 8px;
    max-width: 150px;
  }
  
  h3 {
    font-size: 1.1rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .job-details-table {
    margin-top: 15px;
  }
  
  .jobs-table {
    min-width: 400px;
    font-size: 12px;
  }
  
  .jobs-table th,
  .jobs-table td {
    padding: 6px;
    max-width: 100px;
  }
  
  h3 {
    font-size: 1rem;
    text-align: center;
  }
}
</style> 