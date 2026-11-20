// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ContactEmailReveal from './ContactEmailReveal';

afterEach(cleanup);

it('reveals the professional email and mailto after activation', () => {
  render(<ContactEmailReveal />);
  expect(screen.queryByRole('link', { name: /contact@/ })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /adresse e-mail/i }));
  expect(screen.getByRole('link', { name: 'contact@safouane-affane.fr' }).getAttribute('href')).toBe('mailto:contact@safouane-affane.fr');
});
