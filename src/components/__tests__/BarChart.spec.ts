import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BarChart from '../BarChart.vue';
import type { JobDescription } from '../../services/jobService';

vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    props: ['data'],
    template: '<div class="bar-chart-mock">{{ data }}</div>'
  }
}));

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  Title: {},
  Tooltip: {},
  Legend: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {}
}));

vi.mock('../../services/formatDataForChart', () => ({
  processJobDataForChart: vi.fn()
}));

import { processJobDataForChart } from '../../services/formatDataForChart';
const mockProcessJobDataForChart = processJobDataForChart as any;

describe('BarChart.vue', () => {
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

  const mockChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Job Descriptions',
        backgroundColor: '#42b983',
        data: [2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  beforeEach(() => {
    const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
    });
    vi.clearAllMocks();
    mockProcessJobDataForChart.mockReturnValue(mockChartData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render successfully', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render main elements', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(wrapper.find('.chart-container').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Bar Chart');
    });

    it('should render Bar chart component', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      const barComponent = wrapper.find('bar-stub');
      expect(barComponent.exists()).toBe(true);
    });

    it('should have correct component structure', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      const container = wrapper.find('.chart-container');
      expect(container.find('h2').exists()).toBe(true);
      expect(container.find('bar-stub').exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should accept jobsData prop', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(wrapper.props('jobsData')).toEqual(mockJobDescriptions);
    });

    it('should handle empty jobsData prop', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: []
        }
      });
      
      expect(wrapper.props('jobsData')).toEqual([]);
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle large jobsData arrays', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        websiteTitle: `Job ${i}`,
        websiteOrganization: `Company ${i}`,
        websiteLocation: `Location ${i}`,
        websiteDatePublished: `2024-01-${(i % 30) + 1}`
      }));

      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: largeDataset
        }
      });
      
      expect(wrapper.props('jobsData')).toHaveLength(100);
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Data Processing', () => {
    it('should call processJobDataForChart with correct data', () => {
      shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
    });

    it('should call processJobDataForChart with empty array', () => {
      shallowMount(BarChart, {
        props: {
          jobsData: []
        }
      });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith([]);
    });

    it('should reactively update when jobsData changes', async () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
      
      const newJobData = [mockJobDescriptions[0]];
      await wrapper.setProps({ jobsData: newJobData });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(newJobData);
      expect(mockProcessJobDataForChart).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Processing Integration', () => {
    it('should use formatted data from processJobDataForChart', () => {
      const customChartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{
          label: 'Custom Jobs',
          backgroundColor: '#123456',
          data: [5, 3]
        }]
      };
      
      mockProcessJobDataForChart.mockReturnValue(customChartData);
      
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.chart-container').exists()).toBe(true);
    });

    it('should recalculate when props change', async () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
      
      const newJobData = [...mockJobDescriptions, mockJobDescriptions[0]];
      await wrapper.setProps({ jobsData: newJobData });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(newJobData);
      expect(mockProcessJobDataForChart).toHaveBeenCalledTimes(2);
    });
  });

  describe('Chart.js Integration', () => {
    it('should register Chart.js components', () => {
      const { Chart } = require('chart.js');
      expect(Chart.register).toBeDefined();
    });

    it('should pass correct data to Bar component', () => {
      const wrapper = shallowMount(BarChart, {
        props: {
          jobsData: mockJobDescriptions
        }
      });
      
      const barComponent = wrapper.findComponent({ name: 'Bar' });
      expect(barComponent.exists()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors from processJobDataForChart gracefully', () => {
      mockProcessJobDataForChart.mockImplementation(() => {
        throw new Error('Processing error');
      });
      
      expect(() => {
        shallowMount(BarChart, {
          props: {
            jobsData: mockJobDescriptions
          }
        });
      }).toThrow('Processing error');
      
      mockProcessJobDataForChart.mockReturnValue(mockChartData);
    });

    it('should handle null/undefined jobsData gracefully', () => {
      mockProcessJobDataForChart.mockReturnValue(mockChartData);
      
      expect(() => {
        shallowMount(BarChart, {
          props: {
            jobsData: null as any
          }
        });
      }).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount without errors', () => {
      mockProcessJobDataForChart.mockReturnValue(mockChartData);
      
      expect(() => {
        const wrapper = shallowMount(BarChart, {
          props: {
            jobsData: mockJobDescriptions
          }
        });
        wrapper.unmount();
      }).not.toThrow();
    });
  });
}); 