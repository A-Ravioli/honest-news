export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: NewsSource;
  category: string;
  aiSummary?: string;
  scaleContext?: string;
  factCheck?: FactCheckResult;
  readingTime?: number;
}

export interface NewsSource {
  id: string;
  name: string;
  logo?: string;
  credibilityScore?: number;
  country?: string;
}

export interface FactCheckResult {
  score: number; // 0-100
  verifiedClaims: number;
  totalClaims: number;
  sources: string[];
}

export interface UserPreferences {
  topics: string[];
  detailLevel: 'brief' | 'standard' | 'comprehensive';
  fontSize: number;
  darkMode: boolean;
  notifications: {
    breakingNews: boolean;
    dailyDigest: boolean;
    topicUpdates: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'standard' | 'premium';
  preferences: UserPreferences;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  trending: boolean;
  icon?: string;
}

export interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  scaleContext?: {
    description: string;
    comparison: string;
    significance: string;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  importance: number; // 1-10
}

export interface AppState {
  user: User | null;
  articles: NewsArticle[];
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

export type RootTabParamList = {
  Home: undefined;
  Topics: undefined;
  Explore: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Article: { articleId: string };
  Settings: undefined;
  Auth: undefined;
}; 