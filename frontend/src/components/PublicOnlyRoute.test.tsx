import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PublicOnlyRoute from './PublicOnlyRoute';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>Login form</div>
              </PublicOnlyRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('PublicOnlyRoute', () => {
  it('renders children when not authenticated', async () => {
    await act(async () => {
      renderWithRouter();
    });
    expect(screen.getByText('Login form')).toBeTruthy();
  });

  it('redirects to /dashboard when already authenticated', async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const body = btoa(JSON.stringify({ sub: '1', name: 'Alice', email: 'a@test.com', exp }));
    localStorage.setItem('beff_auth_token', `${header}.${body}.sig`);

    await act(async () => {
      renderWithRouter();
    });
    expect(screen.getByText('Dashboard')).toBeTruthy();
    localStorage.clear();
  });
});
