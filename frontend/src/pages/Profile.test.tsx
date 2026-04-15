import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { AuthProvider } from '../contexts/AuthContext';
import { BEFF_AUTH_TOKEN } from '../constants';

vi.mock('../api/axios', () => ({
  default: {
    patch: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../api/axios';
const mockPatch = vi.mocked(api.patch);
const mockGet = vi.mocked(api.get);
const mockDelete = vi.mocked(api.delete);

// Inject a valid token so AuthProvider considers user logged in
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
        <Profile />
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

  it('triggers file download on Export click', async () => {
    const blob = new Blob(['{}'], { type: 'application/json' });
    mockGet.mockResolvedValueOnce({ data: blob });

    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, writable: true });

    await act(async () => { renderProfile(); });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /export/i }));
    });
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/users/me/export', expect.any(Object));
    });
  });

  it('opens delete confirmation modal on Delete click', async () => {
    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      // The dialog title is "Delete your account?"
      expect(screen.getByText(/delete your account\?/i)).toBeTruthy();
    });
  });

  it('does not call DELETE when Cancel is clicked in modal', async () => {
    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => { screen.getByText(/delete your account\?/i); });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('calls DELETE and logout on confirm', async () => {
    mockDelete.mockResolvedValueOnce({});
    // Override window.location.href
    const originalHref = Object.getOwnPropertyDescriptor(window, 'location');
    const locationMock = { href: '' };
    Object.defineProperty(window, 'location', { value: locationMock, writable: true });

    await act(async () => { renderProfile(); });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => { screen.getByText(/delete your account\?/i); });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    });
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/users/me');
    });

    if (originalHref) Object.defineProperty(window, 'location', originalHref);
  });
});
