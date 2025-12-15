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
  it('renders correctly with props', async () => {
    const wrapper = mount(LinkButton, {
      props: {
        to: '/test',
        text: 'Test Button',
        color: 'primary',
      },
      global: {
        plugins: [router],
      },
    });

    await router.isReady();

    // Check if the text is rendered
    expect(wrapper.text()).toBe('Test Button');

    // Check if the link is correct
    const btn = wrapper.findComponent({ name: 'VBtn' });
    expect(btn.props('to')).toBe('/test');
    expect(btn.props('color')).toBe('primary');
  });
});