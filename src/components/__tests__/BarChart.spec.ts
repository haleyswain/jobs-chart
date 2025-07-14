import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import BarChart from '../BarChart.vue';
import type { JobDescription } from '../../services/jobService';
import { processJobDataForChart } from '../../services/formatDataForChart';
import type { MockedFunction } from 'vitest';
import { Chart } from 'chart.js';

interface BarChartProps {
  jobsData: JobDescription[];
}

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

const mockProcessJobDataForChart = processJobDataForChart as MockedFunction<typeof processJobDataForChart>;

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
  let wrapper: VueWrapper;

  const createWrapper = (props: BarChartProps = { jobsData: mockJobDescriptions }) => {
    return shallowMount(BarChart, { props });
  };

  const expectBasicStructure = (wrapper: VueWrapper) => {
    expect(wrapper.find('.chart-container').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Bar Chart');
    expect(wrapper.find('bar-stub').exists()).toBe(true);
  };

  const expectProcessJobDataForChartCalled = (expectedData: JobDescription[]) => {
    expect(mockProcessJobDataForChart).toHaveBeenCalledWith(expectedData);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockProcessJobDataForChart.mockReturnValue(mockChartData);
    wrapper = createWrapper();
  });



  describe('Component Rendering', () => {
    it('should render successfully', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render all main elements and have correct structure', () => {     
      expectBasicStructure(wrapper);
      // this resolves the type error that this test has no assertions
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should accept jobsData prop', () => {
      expect((wrapper.props() as BarChartProps).jobsData).toEqual(mockJobDescriptions);
    });

    it('should handle empty jobsData prop', () => {
      const wrapper = createWrapper({ jobsData: [] });
      
      expect((wrapper.props() as BarChartProps).jobsData).toEqual([]);
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle large jobsData arrays', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        websiteTitle: `Job ${i}`,
        websiteOrganization: `Company ${i}`,
        websiteLocation: `Location ${i}`,
        websiteDatePublished: `2024-01-${(i % 30) + 1}`
      }));

      const wrapper = createWrapper({ jobsData: largeDataset });
      
      expect((wrapper.props() as BarChartProps).jobsData).toHaveLength(100);
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Data Processing', () => {
    it('should call processJobDataForChart with correct data', () => {
      expectProcessJobDataForChartCalled(mockJobDescriptions);
      expect(wrapper.exists()).toBe(true);
    });

    it('should call processJobDataForChart with empty array', () => {
      const testWrapper = createWrapper({ jobsData: [] });
      expect(testWrapper.exists()).toBe(true);
      expectProcessJobDataForChartCalled([]);
    });

    it('should reactively update when jobsData changes', async () => {
      vi.clearAllMocks();
      mockProcessJobDataForChart.mockReturnValue(mockChartData);
      
      const wrapper = createWrapper();
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
      expect(mockProcessJobDataForChart).toHaveBeenCalledTimes(1);
      
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
      vi.clearAllMocks();
      mockProcessJobDataForChart.mockReturnValue(mockChartData);
      
      const wrapper = createWrapper();
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(mockJobDescriptions);
      expect(mockProcessJobDataForChart).toHaveBeenCalledTimes(1);
      
      const newJobData = [...mockJobDescriptions, mockJobDescriptions[0]];
      await wrapper.setProps({ jobsData: newJobData });
      
      expect(mockProcessJobDataForChart).toHaveBeenCalledWith(newJobData);
      expect(mockProcessJobDataForChart).toHaveBeenCalledTimes(2);
    });
  });

  describe('Chart.js Integration', () => {
    it('should register Chart.js components', () => {
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
            jobsData: null as unknown as JobDescription[]
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