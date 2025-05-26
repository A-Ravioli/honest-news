import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle, Topic } from '../../types';

interface NewsState {
  articles: NewsArticle[];
  featuredArticles: NewsArticle[];
  topics: Topic[];
  currentCategory: string;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialState: NewsState = {
  articles: [],
  featuredArticles: [],
  topics: [],
  currentCategory: 'general',
  loading: false,
  error: null,
  refreshing: false,
};

// Mock data for development
const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'AI Revolution in Healthcare: New Breakthrough in Disease Detection',
    description: 'Researchers develop AI system that can detect rare diseases with 95% accuracy, potentially saving thousands of lives annually.',
    content: 'A revolutionary AI system developed by researchers at Stanford University has achieved a remarkable 95% accuracy rate in detecting rare diseases...',
    url: 'https://example.com/ai-healthcare',
    urlToImage: 'https://picsum.photos/400/300?random=1',
    publishedAt: new Date().toISOString(),
    source: {
      id: 'stanford-news',
      name: 'Stanford News',
      credibilityScore: 92,
    },
    category: 'technology',
    aiSummary: 'Stanford researchers have developed an AI system that can detect rare diseases with 95% accuracy, potentially revolutionizing early diagnosis and treatment.',
    scaleContext: 'This breakthrough could impact the lives of over 300 million people worldwide who suffer from rare diseases.',
    factCheck: {
      score: 88,
      verifiedClaims: 7,
      totalClaims: 8,
      sources: ['Stanford University', 'Nature Medicine', 'WHO'],
    },
    readingTime: 5,
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
    description: 'World leaders commit to ambitious new targets for carbon emission reductions by 2030.',
    content: 'In a landmark decision at the Global Climate Summit, 195 countries have agreed to unprecedented carbon reduction targets...',
    url: 'https://example.com/climate-summit',
    urlToImage: 'https://picsum.photos/400/300?random=2',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: {
      id: 'reuters',
      name: 'Reuters',
      credibilityScore: 94,
    },
    category: 'environment',
    aiSummary: '195 countries agree to new carbon reduction targets at Global Climate Summit, aiming for 50% reduction by 2030.',
    scaleContext: 'These commitments represent a $2.3 trillion global investment in clean energy infrastructure over the next decade.',
    factCheck: {
      score: 92,
      verifiedClaims: 12,
      totalClaims: 13,
      sources: ['UN Climate Change', 'IPCC', 'IEA'],
    },
    readingTime: 7,
  },
];

const mockTopics: Topic[] = [
  { id: '1', name: 'Technology', description: 'Latest tech innovations', articleCount: 245, trending: true, icon: '💻' },
  { id: '2', name: 'Health', description: 'Health and medical news', articleCount: 189, trending: false, icon: '🏥' },
  { id: '3', name: 'Environment', description: 'Climate and environmental issues', articleCount: 156, trending: true, icon: '🌍' },
  { id: '4', name: 'Politics', description: 'Political developments', articleCount: 312, trending: false, icon: '🏛️' },
  { id: '5', name: 'Business', description: 'Business and finance', articleCount: 278, trending: true, icon: '💼' },
];

// Async thunks for API calls
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (category: string = 'general') => {
    // In a real app, this would make API calls to news services
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      articles: mockArticles,
      topics: mockTopics,
    };
  }
);

export const refreshNews = createAsyncThunk(
  'news/refreshNews',
  async (category: string = 'general') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      articles: mockArticles,
      topics: mockTopics,
    };
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch news
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.topics = action.payload.topics;
        state.featuredArticles = action.payload.articles.slice(0, 3);
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      })
      // Refresh news
      .addCase(refreshNews.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshNews.fulfilled, (state, action) => {
        state.refreshing = false;
        state.articles = action.payload.articles;
        state.topics = action.payload.topics;
        state.featuredArticles = action.payload.articles.slice(0, 3);
      })
      .addCase(refreshNews.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.error.message || 'Failed to refresh news';
      });
  },
});

export const { setCurrentCategory, clearError } = newsSlice.actions;
export default newsSlice.reducer; 