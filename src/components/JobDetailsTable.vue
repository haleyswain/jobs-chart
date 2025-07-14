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
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.jobs-table th,
.jobs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.jobs-table th {
  font-weight: 600;
}

h3 {
  color: #495057;
  margin-bottom: 10px;
}
</style> 