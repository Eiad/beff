import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { BEFF_AUTH_TOKEN } from '../constants';

// Helper: create a JWT with a given exp (seconds from now, default 1 hour)
function makeToken(payload: Record<string, unknown>, expiresInSec = 3600) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp }));
  return `${header}.${body}.sig`;
}

function makeExpiredToken(payload: Record<string, unknown>) {
  const exp = Math.floor(Date.now() / 1000) - 10; // 10 seconds in the past
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp }));
  return `${header}.${body}.sig`;
}

// Test consumer component
function Consumer() {
  const { user, isLoading, login, logout, updateUser } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="user">{user ? user.name : 'null'}</div>
      <button onClick={() => login(makeToken({ sub: '1', email: 'a@b.com', name: 'Bob' }), { id: '1', name: 'Bob', email: 'a@b.com', createdAt: '' })}>
        login
      </button>
      <button onClick={logout}>logout</button>
      <button onClick={() => updateUser({ name: 'Updated' })}>update</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('AuthContext', () => {
  it('starts loading then resolves to null when no token', async () => {
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('hydrates user from valid token in localStorage', async () => {
    const token = makeToken({ sub: '99', email: 'test@test.com', name: 'Alice' });
    localStorage.setItem(BEFF_AUTH_TOKEN, token);
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    expect(screen.getByTestId('user').textContent).toBe('Alice');
  });

  it('clears expired token and sets user to null', async () => {
    const token = makeExpiredToken({ sub: '99', email: 'test@test.com', name: 'Alice' });
    localStorage.setItem(BEFF_AUTH_TOKEN, token);
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem(BEFF_AUTH_TOKEN)).toBeNull();
  });

  it('login() sets user and stores token', async () => {
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    await act(async () => {
      screen.getByText('login').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('Bob');
    expect(localStorage.getItem(BEFF_AUTH_TOKEN)).toBeTruthy();
  });

  it('logout() clears user and removes token', async () => {
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    await act(async () => { screen.getByText('login').click(); });
    await act(async () => { screen.getByText('logout').click(); });
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem(BEFF_AUTH_TOKEN)).toBeNull();
  });

  it('updateUser() merges partial into current user', async () => {
    await act(async () => {
      render(<AuthProvider><Consumer /></AuthProvider>);
    });
    await act(async () => { screen.getByText('login').click(); });
    await act(async () => { screen.getByText('update').click(); });
    expect(screen.getByTestId('user').textContent).toBe('Updated');
  });

  it('throws if useAuth() is used outside AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    consoleError.mockRestore();
  });
});
