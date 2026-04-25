// ============================================================
// auth_service.ts — Feature: Auth
// Calls POST /auth/login on the Fastify backend.
// Mirrors the mobile app's AuthService.login() method.
// ============================================================

const API_URL   = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = 'admin_token';

export class AuthService {
  /**
   * Login — POST /auth/login
   * Returns { token, user: { id, name, email, role } }
   */
  static async login(email: string, password: string) {
    const res  = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  }

  /** Read the stored JWT */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
