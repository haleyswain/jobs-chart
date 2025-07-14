import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import HomePage from '../HomePage.vue';

vi.mock('../JobSearch.vue', () => ({
  default: {
    name: 'JobSearch',
    template: '<div class="job-search-mock">Job Search Component</div>'
  }
}));

describe('HomePage.vue', () => {
  it('should render successfully', () => {
    const wrapper = shallowMount(HomePage);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the main container with correct class', () => {
    const wrapper = shallowMount(HomePage);
    expect(wrapper.find('.page-container').exists()).toBe(true);
  });

  it('should render JobSearch component', () => {
    const wrapper = shallowMount(HomePage);
    expect(wrapper.find('job-search-stub').exists()).toBe(true);
  });

  it('should mount and unmount without errors', () => {
    expect(() => {
      const wrapper = shallowMount(HomePage);
      wrapper.unmount();
    }).not.toThrow();
  });
});
