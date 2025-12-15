import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

config.global.plugins.push(vuetify);

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock segmentit
vi.mock('segmentit', () => ({
  useDefault: vi.fn().mockReturnValue({
    doSegment: (text: string) => text.split(''),
  }),
}));

// Mock pinyin
vi.mock('pinyin', () => ({
  __esModule: true,
  default: vi.fn((text: string) => [[text]]),
}));
