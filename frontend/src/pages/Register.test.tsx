import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import { AuthProvider } from '../contexts/AuthContext';

// Mock axios instance
vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '../api/axios';
const mockPost = vi.mocked(api.post);

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
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

describe('Register page', () => {
  it('shows validation errors on empty submit', async () => {
    renderRegister();
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeTruthy();
    });
  });

  it('shows error when passwords do not match', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/do not match/i)).toBeTruthy();
    });
  });

  it('shows server error on 409 (duplicate email)', async () => {
    const { default: axios } = await import('axios');
    const err = new (axios as typeof import('axios').default).AxiosError('Conflict');
    Object.assign(err, { response: { status: 409 } });
    mockPost.mockRejectedValueOnce(err);

    renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(/already exists/i)).toBeTruthy();
    });
  });

  it('navigates to /dashboard on successful registration', async () => {
    mockPost.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { id: '1', name: 'Alice', email: 'alice@test.com', createdAt: '' } },
    });

    renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });
});
