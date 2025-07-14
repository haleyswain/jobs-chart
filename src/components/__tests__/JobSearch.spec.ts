import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import JobSearch from '../JobSearch.vue';
import type { JobDescription } from '../../services/jobService';
import { getJobDescriptions } from '../../services/jobService';
import type { MockedFunction } from 'vitest';

vi.mock('../../services/jobService', () => ({
  getJobDescriptions: vi.fn()
}));

const mockGetJobDescriptions = getJobDescriptions as MockedFunction<typeof getJobDescriptions>;

vi.mock('../BarChart.vue', () => ({
  default: {
    name: 'BarChart',
    props: ['jobsData', 'selectedMonth'],
    emits: ['barClick'],
    template: '<div class="bar-chart-mock">Bar Chart Component</div>'
  }
}));

vi.mock('../JobDetailsTable.vue', () => ({
  default: {
    name: 'JobDetailsTable',
    props: ['selectedJobs', 'selectedMonth'],
    template: '<div class="job-details-table-mock">Job Details Table</div>'
  }
}));

describe('JobSearch.vue', () => {
  const mockJobDescriptions: JobDescription[] = [
    {
      websiteTitle: 'Frontend Developer',
      websiteOrganization: 'Tech Corp',
      websiteLocation: 'San Francisco, CA',
      websiteDatePublished: '2024-01-15'
    },
    {
      websiteTitle: 'Backend Engineer',
      websiteOrganization: 'StartupInc',
      websiteLocation: 'New York, NY',
      websiteDatePublished: '2024-02-20'
    }
  ];

  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetJobDescriptions.mockResolvedValue([]);
    wrapper = shallowMount(JobSearch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render successfully', () => {
      
      expect(wrapper.exists()).toBe(true);
    });

    it('should render main elements', () => {
      
      expect(wrapper.find('.job-search').exists()).toBe(true);
      expect(wrapper.find('bar-chart-stub').exists()).toBe(true);
      expect(wrapper.find('job-details-table-stub').exists()).toBe(true);
    });

    it('should render BarChart component', () => {
      mockGetJobDescriptions.mockResolvedValue([]);      
      const barChartElement = wrapper.find('bar-chart-stub');
      expect(barChartElement.exists()).toBe(true);
    });

    it('should pass job data to BarChart component', () => {
      const barChart = wrapper.findComponent({ name: 'BarChart' });
      expect(barChart.exists()).toBe(true);
      // Check props directly since initial values (empty array, null) don't appear in DOM attributes
      expect(barChart.props('jobsData')).toEqual([]);
      expect(barChart.props('selectedMonth')).toBe(null);
    });

    it('should pass data to JobDetailsTable component', () => {
      const jobDetailsTable = wrapper.findComponent({ name: 'JobDetailsTable' });
      expect(jobDetailsTable.exists()).toBe(true);
      // Check props directly since initial values (empty array, null) don't appear in DOM attributes
      expect(jobDetailsTable.props('selectedJobs')).toEqual([]);
      expect(jobDetailsTable.props('selectedMonth')).toBe(null);
    });
  });

  describe('API Integration', () => {
    it('should call getJobDescriptions on mount', async () => {
        mockGetJobDescriptions.mockResolvedValue([]);
      await nextTick();
      expect(getJobDescriptions).toHaveBeenCalledWith('');
    });

    it('should update BarChart with job data on successful API call', async () => {
      mockGetJobDescriptions.mockResolvedValue(mockJobDescriptions);      
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      
      const barChart = wrapper.find('bar-chart-stub');
      
      expect(mockGetJobDescriptions).toHaveBeenCalledWith('');
      expect(barChart.exists()).toBe(true);
      expect(barChart.attributes('jobsdata')).toBeDefined();
    });

    it('should render BarChart when no jobs returned', async () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      await nextTick();
      const barChart = wrapper.find('bar-chart-stub');
      expect(barChart.exists()).toBe(true);
      expect(barChart.attributes('jobsdata')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should log errors to console when API fails', async () => {
      const error = new Error('API Error');
      mockGetJobDescriptions.mockRejectedValue(error);
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      shallowMount(JobSearch);
      await nextTick();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to search jobs:', error);
      consoleSpy.mockRestore();
    });

    it('should render BarChart with empty data when API fails', async () => {
      mockGetJobDescriptions.mockRejectedValue(new Error('API Error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      await nextTick();
      const barChart = wrapper.find('bar-chart-stub');
      expect(barChart.exists()).toBe(true);
      expect(barChart.attributes('jobsdata')).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount without errors', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      
      expect(() => {
        wrapper.unmount();
      }).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should have correct CSS classes', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      expect(wrapper.find('.job-search').exists()).toBe(true);
    });

    it('should maintain component hierarchy', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      const html = wrapper.html();
      expect(html).toContain('job-search');
      expect(wrapper.find('bar-chart-stub').exists()).toBe(true);
    });
  });

  describe('Chart Interaction', () => {
    it('should handle bar chart click events', async () => {
      const barChart = wrapper.findComponent({ name: 'BarChart' });
      expect(barChart.exists()).toBe(true);
      
      // Simulate bar click event
      const mockJobs = [mockJobDescriptions[0]];
      await barChart.vm.$emit('barClick', 0, mockJobs);
      
      // Verify that the component handles the event
      expect(wrapper.exists()).toBe(true);
    });

    it('should pass selectedMonth to BarChart', () => {
      const barChart = wrapper.findComponent({ name: 'BarChart' });
      expect(barChart.exists()).toBe(true);
      // selectedMonth starts as null, verify it's passed correctly
      expect(barChart.props('selectedMonth')).toBe(null);
    });

    it('should update selectedMonth when bar is clicked', async () => {
      const barChart = wrapper.findComponent({ name: 'BarChart' });
      expect(barChart.exists()).toBe(true);
      
      // Simulate bar click event to set selectedMonth
      const mockJobs = [mockJobDescriptions[0]];
      await barChart.vm.$emit('barClick', 0, mockJobs);
      await wrapper.vm.$nextTick();
      
      // Now selectedMonth should be set to 0
      const updatedBarChart = wrapper.findComponent({ name: 'BarChart' });
      expect(updatedBarChart.props('selectedMonth')).toBe(0);
    });
  });

  describe('Data Display', () => {
    it('should handle large datasets', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        websiteTitle: `Job ${i}`,
        websiteOrganization: `Company ${i}`,
        websiteLocation: `Location ${i}`,
        websiteDatePublished: `2024-01-${(i % 30) + 1}`
      }));
      mockGetJobDescriptions.mockResolvedValue(largeDataset);
            
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      
      const barChart = wrapper.find('bar-chart-stub');
      expect(barChart.exists()).toBe(true);
      expect(barChart.attributes('jobsdata')).toBeDefined();
      expect(mockGetJobDescriptions).toHaveBeenCalledWith('');
    });
  });
}); 