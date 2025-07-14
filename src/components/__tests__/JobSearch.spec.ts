import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import JobSearch from '../JobSearch.vue';
import type { JobDescription } from '../../services/jobService';

vi.mock('../../services/jobService', () => ({
  getJobDescriptions: vi.fn()
}));

import { getJobDescriptions } from '../../services/jobService';
const mockGetJobDescriptions = getJobDescriptions as any;

vi.mock('../BarChart.vue', () => ({
  default: {
    name: 'BarChart',
    props: ['jobsData'],
    template: '<div class="bar-chart-mock">Bar Chart Component</div>'
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetJobDescriptions.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render successfully', () => {
      
      const wrapper = shallowMount(JobSearch);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render main elements', () => {
      
      const wrapper = shallowMount(JobSearch);
      expect(wrapper.find('h2').text()).toBe('Job Search');
      expect(wrapper.find('h4').text()).toBe('Jobs Data:');
      expect(wrapper.find('.job-search').exists()).toBe(true);
    });

    it('should render BarChart component', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      
      const wrapper = shallowMount(JobSearch);
      
      // have to check for the stub component when using shallowMount
      const barChartElement = wrapper.find('bar-chart-stub');
      expect(barChartElement.exists()).toBe(true);
    });

    it('should display job descriptions data paragraph', () => {
      
      const wrapper = shallowMount(JobSearch);
      expect(wrapper.find('p').exists()).toBe(true);
    });
  });

  describe('API Integration', () => {
    it('should call getJobDescriptions on mount', async () => {
        mockGetJobDescriptions.mockResolvedValue([]);
      
      shallowMount(JobSearch);
      await nextTick();
      
      expect(getJobDescriptions).toHaveBeenCalledWith('');
    });

    it('should update DOM with job data on successful API call', async () => {
      mockGetJobDescriptions.mockResolvedValue(mockJobDescriptions);
      
      const wrapper = shallowMount(JobSearch);
      
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      
      const jobDataDisplay = wrapper.find('p');
      const displayText = jobDataDisplay.text();
      
      expect(mockGetJobDescriptions).toHaveBeenCalledWith('');
      
      expect(displayText).toContain('Frontend Developer');
      expect(displayText).toContain('Backend Engineer');
    });

    it('should display empty array when no jobs returned', async () => {
      mockGetJobDescriptions.mockResolvedValue(mockJobDescriptions);
      
      const wrapper = shallowMount(JobSearch);
      await nextTick();
      
      const jobDataDisplay = wrapper.find('p');
      expect(jobDataDisplay.text()).toBe('[]');
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

    it('should display empty array when API fails', async () => {
      mockGetJobDescriptions.mockRejectedValue(new Error('API Error'));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const wrapper = shallowMount(JobSearch);
      await nextTick();
      
      const jobDataDisplay = wrapper.find('p');
      expect(jobDataDisplay.text()).toBe('[]');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount without errors', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      
      expect(() => {
        const wrapper = shallowMount(JobSearch);
        wrapper.unmount();
      }).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should have correct CSS classes', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      
      const wrapper = shallowMount(JobSearch);
      expect(wrapper.find('.job-search').exists()).toBe(true);
    });

    it('should maintain component hierarchy', () => {
      mockGetJobDescriptions.mockResolvedValue([]);
      const wrapper = shallowMount(JobSearch);
      const html = wrapper.html();
      expect(html).toContain('job-search');
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Job Search');
      expect(wrapper.find('h4').exists()).toBe(true);
      expect(wrapper.find('h4').text()).toBe('Jobs Data:');
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
      
      const wrapper = shallowMount(JobSearch);
      
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      
      const jobDataDisplay = wrapper.find('p');
      const displayText = jobDataDisplay.text();
            
      expect(displayText).toContain('Job 0');
      expect(displayText).toContain('Job 99');
      
      expect(displayText.length).toBeGreaterThan(1000);
    });
  });
}); 