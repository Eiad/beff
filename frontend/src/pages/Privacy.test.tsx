import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Privacy from './Privacy';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/Toast';
import { BEFF_AUTH_TOKEN } from '../constants';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../api/axios';
const mockGet = vi.mocked(api.get);
const mockDelete = vi.mocked(api.delete);

function injectToken(name = 'Test User') {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const body = btoa(JSON.stringify({ sub: '1', name, email: 'test@test.com', exp }));
  localStorage.setItem(BEFF_AUTH_TOKEN, `${header}.${body}.sig`);
}

function renderPrivacy() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Privacy />
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

describe('Privacy page', () => {
  it('triggers file download on Export click', async () => {
    const blob = new Blob(['{}'], { type: 'application/json' });
    mockGet.mockResolvedValueOnce({ data: blob });

    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, writable: true });

    await act(async () => { renderPrivacy(); });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /export/i }));
    });
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/users/me/export', expect.any(Object));
    });
  });

  it('opens delete confirmation modal on Delete click', async () => {
    await act(async () => { renderPrivacy(); });
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => {
      expect(screen.getByText(/delete your account\?/i)).toBeTruthy();
    });
  });

  it('does not call DELETE when Cancel is clicked in modal', async () => {
    await act(async () => { renderPrivacy(); });
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => { screen.getByText(/delete your account\?/i); });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('calls DELETE when confirm text is typed and Delete Account is clicked', async () => {
    mockDelete.mockResolvedValueOnce({});
    const originalHref = Object.getOwnPropertyDescriptor(window, 'location');
    const locationMock = { href: '' };
    Object.defineProperty(window, 'location', { value: locationMock, writable: true });

    await act(async () => { renderPrivacy(); });
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => { screen.getByText(/delete your account\?/i); });

    const confirmInput = screen.getByPlaceholderText('delete my account');
    fireEvent.change(confirmInput, { target: { value: 'delete my account' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    });
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/users/me');
    });

    if (originalHref) Object.defineProperty(window, 'location', originalHref);
  });
});
