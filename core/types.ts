import { Page } from 'playwright';

export interface IPageObject {
  readonly page: Page;
}

export interface IActions<T> {
  navigate(...args: unknown[]): Promise<void>;
}

export interface IAssertions {
  verify(): Promise<void>;
}

export type Constructor<T> = new (...args: unknown[]) => T;
