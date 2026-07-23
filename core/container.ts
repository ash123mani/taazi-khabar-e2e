import { Page, APIRequestContext } from 'playwright';

type Factory<T> = (container: Container) => T;

export class Container {
  private registry = new Map<string, Factory<unknown>>();
  private instances = new Map<string, unknown>();
  private page?: Page;
  private apiContext?: APIRequestContext;

  setPage(page: Page): void {
    this.page = page;
  }

  getPage(): Page {
    if (!this.page) throw new Error('Page not set in container');
    return this.page;
  }

  setApiContext(ctx: APIRequestContext): void {
    this.apiContext = ctx;
  }

  getApiContext(): APIRequestContext {
    if (!this.apiContext) throw new Error('API context not set in container');
    return this.apiContext;
  }

  register<T>(key: string, factory: Factory<T>): void {
    this.registry.set(key, factory as Factory<unknown>);
  }

  resolve<T>(key: string): T {
    const existing = this.instances.get(key);
    if (existing) return existing as T;

    const factory = this.registry.get(key);
    if (!factory) throw new Error(`No factory registered for "${key}"`);

    const instance = factory(this);
    this.instances.set(key, instance);
    return instance as T;
  }

  clear(): void {
    this.instances.clear();
  }

  reset(): void {
    this.instances.clear();
    this.page = undefined;
    this.apiContext = undefined;
  }
}

export const container = new Container();
