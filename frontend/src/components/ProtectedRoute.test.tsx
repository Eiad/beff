import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', async () => {
    await act(async () => {
      renderWithRouter('/protected');
    });
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('renders children when authenticated via localStorage token', async () => {
    // Make a valid token
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const body = btoa(JSON.stringify({ sub: '1', name: 'Alice', email: 'a@test.com', exp }));
    localStorage.setItem('beff_auth_token', `${header}.${body}.sig`);

    await act(async () => {
      renderWithRouter('/protected');
    });
    expect(screen.getByText('Protected content')).toBeTruthy();
    localStorage.clear();
  });
});
