// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import TurnstileContact from './TurnstileContact';

vi.mock('next/script', () => ({ default: () => null }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('shows an error when the Turnstile script never becomes ready', () => {
  vi.useFakeTimers();
  render(<TurnstileContact siteKey="test-site-key" />);
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByRole('alert').textContent).toMatch(/anti-spam.*indisponible/i);
});
