import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

const storageState: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => storageState[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { storageState[key] = value; }),
  removeItem: vi.fn((key: string) => { delete storageState[key]; }),
  clear: vi.fn(() => { Object.keys(storageState).forEach((k) => delete storageState[k]); }),
  get length() { return Object.keys(storageState).length; },
  key: vi.fn((index: number) => Object.keys(storageState)[index] ?? null),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));
