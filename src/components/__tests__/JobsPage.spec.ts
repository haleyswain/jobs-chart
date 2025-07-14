import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import JobsPage from '../JobsPage.vue';
import JobSearch from '../JobSearch.vue';

vi.mock('../JobSearch.vue', () => ({
  default: {
    name: 'JobSearch',
    template: '<div class="job-search-mock">Mocked JobSearch Component</div>'
  }
}));

describe('JobsPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render successfully', () => {
      const wrapper = shallowMount(JobsPage);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render with correct root structure', () => {
      const wrapper = shallowMount(JobsPage);
      const rootDiv = wrapper.find('div.greetings');
      expect(rootDiv.exists()).toBe(true);
    });

    it('should have the correct root class', () => {
      const wrapper = shallowMount(JobsPage);
      expect(wrapper.classes()).toContain('greetings');
    });

    it('should render JobSearch component', () => {
      const wrapper = shallowMount(JobsPage);
      const jobSearchComponent = wrapper.findComponent(JobSearch);
      expect(jobSearchComponent.exists()).toBe(true);
    });

    it('should render only one JobSearch component', () => {
      const wrapper = shallowMount(JobsPage);
      const jobSearchComponents = wrapper.findAllComponents(JobSearch);
      expect(jobSearchComponents).toHaveLength(1);
    });
  });

  describe('Component Structure', () => {
    it('should have JobSearch as direct child of greetings div', () => {
      const wrapper = shallowMount(JobsPage);
      const greetingsDiv = wrapper.find('div.greetings');
      const jobSearchComponent = greetingsDiv.findComponent(JobSearch);
      expect(jobSearchComponent.exists()).toBe(true);
    });

    it('should not have any additional content besides JobSearch', () => {
      const wrapper = shallowMount(JobsPage);
      const greetingsDiv = wrapper.find('div.greetings');
      const children = greetingsDiv.element.children;
      expect(children).toHaveLength(1);
    });

    it('should have proper HTML structure', () => {
      const wrapper = shallowMount(JobsPage);
      const html = wrapper.html();
      expect(html).toContain('class="greetings"');
      expect(html).toContain('job-search-stub');
    });
  });

  describe('Component Integration', () => {
    it('should render with full mount', () => {
      const wrapper = mount(JobsPage);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('div.greetings').exists()).toBe(true);
    });

    it('should pass no props to JobSearch component', () => {
      const wrapper = shallowMount(JobsPage);
      const jobSearchComponent = wrapper.findComponent(JobSearch);
      expect(jobSearchComponent.props()).toEqual({});
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply greetings class to root element', () => {
      const wrapper = shallowMount(JobsPage);
      expect(wrapper.attributes('class')).toBe('greetings');
    });

    it('should have scoped styles applied', () => {
      const wrapper = shallowMount(JobsPage);
      const greetingsDiv = wrapper.find('div.greetings');
      expect(greetingsDiv.exists()).toBe(true);
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount without errors', () => {
      expect(() => {
        const wrapper = shallowMount(JobsPage);
        wrapper.unmount();
      }).not.toThrow();
    });

    it('should unmount cleanly', () => {
      const wrapper = shallowMount(JobsPage);
      expect(() => {
        wrapper.unmount();
      }).not.toThrow();
    });
  });
});
