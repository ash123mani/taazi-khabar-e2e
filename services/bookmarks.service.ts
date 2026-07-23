import { APIRequestContext } from 'playwright';

export class BookmarkService {
  constructor(private api: APIRequestContext, private accessToken: string) {}

  async toggle(articleId: string): Promise<boolean> {
    const res = await this.api.post(`/api/bookmarks/${articleId}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    return res.ok();
  }

  async isBookmarked(articleId: string): Promise<boolean> {
    const res = await this.api.get('/api/bookmarks', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok()) return false;
    const body = await res.json();
    return (body.bookmarked_ids ?? []).includes(articleId);
  }

  async bookmarkMultiple(articleIds: string[]): Promise<number> {
    let count = 0;
    for (const id of articleIds) {
      if (await this.toggle(id)) count++;
    }
    return count;
  }
}
