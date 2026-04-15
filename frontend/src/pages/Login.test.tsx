import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';

vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '../api/axios';
const mockPost = vi.mocked(api.post);

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('Login page', () => {
  it('shows validation errors on empty submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeTruthy();
    });
  });

  it('shows error on 401 response', async () => {
    const { default: axios } = await import('axios');
    const err = new (axios as typeof import('axios').default).AxiosError('Unauthorized');
    Object.assign(err, { response: { status: 401 } });
    mockPost.mockRejectedValueOnce(err);

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });
  });

  it('navigates to /dashboard on successful login', async () => {
    mockPost.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { id: '1', name: 'Bob', email: 'bob@test.com', createdAt: '' } },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });
});
