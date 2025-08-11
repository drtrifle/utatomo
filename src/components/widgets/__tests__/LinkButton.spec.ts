import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LinkButton from '../LinkButton.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/test', component: { template: '<div></div>' } }],
});

describe('LinkButton.vue', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(LinkButton, {
      props: {
        to: '/test',
        text: 'Test Button',
        color: '#ff0000',
        hoverColor: '#cc0000',
      },
      global: {
        plugins: [router],
      },
    });

    // Check if the text is rendered
    expect(wrapper.text()).toBe('Test Button');

    // Check if the link is correct
    expect(wrapper.find('a').attributes('href')).toBe('/test');

    // Check if the style is applied
    const style = wrapper.attributes('style');
    expect(style).toContain('background-color: rgb(255, 0, 0)');
    expect(style).toContain('--hover-color: #cc0000');
  });
});
