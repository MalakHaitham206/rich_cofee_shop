// ============================================================
// api_client.ts
// A reusable fetch wrapper that automatically injects the
// JWT token (stored in localStorage) into every request.
// This mirrors how the mobile app's AuthService works —
// every call adds  Authorization: Bearer <token>.
// ============================================================

const API_URL = import.meta.env.VITE_API_URL as string;

const TOKEN_KEY = 'admin_token';

/** Read the JWT from localStorage */
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Build headers with Content-Type + Bearer token */
function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Parse response — throw on non-2xx */
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data as T;
}

export const apiClient = {
  /** GET request */
  get: <T>(path: string): Promise<T> =>
    fetch(`${API_URL}${path}`, { headers: authHeaders() }).then(handleResponse<T>),

  /** POST request */
  post: <T>(path: string, body: unknown): Promise<T> =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse<T>),

  /** PATCH request */
  patch: <T>(path: string, body: unknown): Promise<T> =>
    fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse<T>),

  /** DELETE request */
  delete: <T>(path: string): Promise<T> =>
    fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<T>),
};
