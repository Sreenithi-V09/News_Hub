export interface Article {
  id: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
  category?: Category;
  summary?: string; // AI Generated summary
}

export enum Category {
  General = 'general',
  Technology = 'technology',
  Business = 'business',
  Sports = 'sports',
  Entertainment = 'entertainment',
  Health = 'health',
  Science = 'science',
}

export enum Language {
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: Language;
}