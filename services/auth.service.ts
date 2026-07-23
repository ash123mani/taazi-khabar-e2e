import { APIRequestContext } from 'playwright';

export class AuthService {
  constructor(private api: APIRequestContext) {}

  static readonly ADMIN_EMAIL = 'admin@taazi.app';
  static readonly ADMIN_PASSWORD = 'change-me';

  async register(email: string, password: string, name: string): Promise<{ accessToken: string } | null> {
    const res = await this.api.post('/api/auth/register', {
      data: { email, password, name },
    });
    if (res.status() === 201) {
      const body = await res.json();
      return { accessToken: body.access_token };
    }
    return null;
  }

  async login(email: string, password: string): Promise<{ accessToken: string } | null> {
    const res = await this.api.post('/api/auth/login', {
      data: { email, password },
    });
    if (res.ok()) {
      const body = await res.json();
      return { accessToken: body.access_token };
    }
    return null;
  }

  async ensureUserExists(email: string, password: string, name: string): Promise<string | null> {
    const registered = await this.register(email, password, name);
    if (registered) return registered.accessToken;

    const loggedIn = await this.login(email, password);
    return loggedIn?.accessToken ?? null;
  }

  async adminLogin(): Promise<string | null> {
    return this.login(AuthService.ADMIN_EMAIL, AuthService.ADMIN_PASSWORD).then(r => r?.accessToken ?? null);
  }
}
