import { vi } from 'vitest';

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
