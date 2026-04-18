import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/Toast';
import { BEFF_AUTH_TOKEN } from '../constants';

vi.mock('../api/axios', () => ({
  default: {
    patch: vi.fn(),
  },
}));

import api from '../api/axios';
const mockPatch = vi.mocked(api.patch);

function injectToken(name = 'Test User') {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const body = btoa(JSON.stringify({ sub: '1', name, email: 'test@test.com', exp }));
  localStorage.setItem(BEFF_AUTH_TOKEN, `${header}.${body}.sig`);
}

function renderProfile() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Profile />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  injectToken();
});

describe('Profile page', () => {
  it('shows edit input when pencil is clicked', async () => {
    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByLabelText('Edit name'));
    expect(screen.getByLabelText('Save name')).toBeTruthy();
  });

  it('hides input on Escape key', async () => {
    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByLabelText('Edit name'));
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByLabelText('Save name')).toBeNull();
    });
  });

  it('calls PATCH on save and updates name', async () => {
    mockPatch.mockResolvedValueOnce({ data: { name: 'Updated Name' } });
    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByLabelText('Edit name'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Save name'));
    });
    expect(mockPatch).toHaveBeenCalledWith('/users/me', { name: 'Updated Name' });
  });
});
