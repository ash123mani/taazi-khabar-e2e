import { APIRequestContext } from 'playwright';

export interface ArticleRef {
  id: string;
  source: string;
  headline: string;
}

export class ArticleService {
  constructor(private api: APIRequestContext) {}

  async fetchFirstArticle(): Promise<ArticleRef | null> {
    const res = await this.api.get('/api/articles?limit=1');
    if (!res.ok()) return null;
    const body = await res.json();
    const list = Array.isArray(body) ? body : body.articles ?? [];
    return list.length > 0 ? list[0] : null;
  }

  async fetchArticles(limit = 5): Promise<ArticleRef[]> {
    const res = await this.api.get(`/api/articles?limit=${limit}`);
    if (!res.ok()) return [];
    const body = await res.json();
    return Array.isArray(body) ? body : body.articles ?? [];
  }
}
