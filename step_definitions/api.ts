import { Given } from '@cucumber/cucumber';
import { World } from '../support/world';

Given('the application is running', async function (this: World) {
  const res = await this.apiContext.get('/api/health');
  if (!res.ok()) throw new Error('Backend not running');
});
