# Honest News: News API Integrations

This document outlines the free news APIs that Honest News integrates with, their capabilities, limitations, and our integration strategies.

## Overview of News APIs

We integrate with multiple news APIs to provide comprehensive coverage while managing costs and ensuring reliability. Each API has different strengths, limitations, and content focuses.

## Primary News APIs

### 1. NewsAPI

**Base URL**: `https://newsapi.org/v2/`

**Key Endpoints**:
- `/top-headlines` - Breaking news headlines
- `/everything` - Search through millions of articles

**Rate Limits**:
- Free plan: 100 requests/day, limited to 1 month old articles
- Developer plan ($49/month): 500 requests/day

**Content Coverage**:
- 80,000+ sources worldwide
- Good coverage of major publications
- Multiple languages

**Integration Strategy**:
- Use for primary headline fetching
- Implement aggressive caching to minimize requests
- Store article content to avoid repeated fetching

**Example Request**:
```javascript
const fetchTopHeadlines = async (category = 'general', country = 'us') => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}`,
      {
        headers: {
          'X-Api-Key': process.env.NEWSAPI_KEY
        }
      }
    );
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};
```

### 2. The Guardian API

**Base URL**: `https://content.guardianapis.com/`

**Key Endpoints**:
- `/search` - Search all content
- `/sections` - Get all sections

**Rate Limits**:
- Free tier: 500 calls/day
- No historical content limitations

**Content Coverage**:
- The Guardian content only
- Strong for UK and international news
- Good opinion and analysis content

**Integration Strategy**:
- Use for in-depth coverage of major international stories
- Supplement NewsAPI with additional perspectives
- Leverage for long-form content

**Example Request**:
```javascript
const fetchGuardianNews = async (query = '', section = '') => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/search?q=${query}&section=${section}&show-fields=bodyText,thumbnail`,
      {
        params: {
          'api-key': process.env.GUARDIAN_API_KEY
        }
      }
    );
    return response.data.response.results;
  } catch (error) {
    console.error('Error fetching from Guardian API:', error);
    return [];
  }
};
```

### 3. New York Times API

**Base URL**: `https://api.nytimes.com/svc/`

**Key Endpoints**:
- `/search/v2/articlesearch.json` - Search articles
- `/topstories/v2/{section}.json` - Get top stories

**Rate Limits**:
- Free tier: 500 requests/day, 5 requests/minute
- No historical limitations (access to archives)

**Content Coverage**:
- NYT content only
- Strong US coverage
- High-quality journalism with fact-checking

**Integration Strategy**:
- Use for US-focused news
- Leverage for historical context on ongoing stories
- Use for fact verification against other sources

**Example Request**:
```javascript
const fetchNYTNews = async (section = 'home') => {
  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json`,
      {
        params: {
          'api-key': process.env.NYT_API_KEY
        }
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching from NYT API:', error);
    return [];
  }
};
```

### 4. Currents API

**Base URL**: `https://api.currentsapi.services/v1/`

**Key Endpoints**:
- `/latest-news` - Get the latest news
- `/search` - Search for specific news

**Rate Limits**:
- Free tier: 600 requests/day

**Content Coverage**:
- Wide range of sources
- Good for niche topics
- Multi-language support

**Integration Strategy**:
- Use as a backup for NewsAPI
- Leverage for category-specific news
- Use for international news in multiple languages

**Example Request**:
```javascript
const fetchCurrentsNews = async (keywords = '', language = 'en') => {
  try {
    const response = await axios.get(
      `https://api.currentsapi.services/v1/search`,
      {
        params: {
          keywords,
          language,
          apiKey: process.env.CURRENTS_API_KEY
        }
      }
    );
    return response.data.news;
  } catch (error) {
    console.error('Error fetching from Currents API:', error);
    return [];
  }
};
```

## Secondary News APIs

### 5. GNews API

**Base URL**: `https://gnews.io/api/v4/`

**Rate Limits**:
- Free tier: 100 requests/day

**Integration Strategy**:
- Use for additional perspectives on major stories
- Keep as fallback for primary APIs

### 6. Bing News Search API

**Base URL**: `https://api.bing.microsoft.com/v7.0/news/`

**Rate Limits**:
- Free tier: 1,000 transactions/month

**Integration Strategy**:
- Use for trending topics and categorized news
- Leverage Microsoft's aggregation capabilities

### 7. Contextual Web Search API

**Base URL**: `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/`

**Rate Limits**:
- Free tier: 100 requests/month

**Integration Strategy**:
- Use for specialized searches and deep research
- Leverage for premium tier content analysis

## API Integration Architecture

### Aggregation Service

Our news aggregation service follows these principles:

1. **Load Balancing**: Distribute requests across multiple APIs to stay within free tier limits
2. **Fallback Chain**: If a primary API fails, automatically try secondary sources
3. **Deduplication**: Identify and merge duplicate stories from different sources
4. **Content Persistence**: Store full article content to minimize API calls
5. **Scheduled Fetching**: Regularly update news in the background instead of on-demand

```javascript
// Example aggregation service (simplified)
class NewsAggregationService {
  constructor() {
    this.apiProviders = [
      { name: 'newsapi', fetcher: fetchNewsAPI, weight: 0.4, isWorking: true },
      { name: 'guardian', fetcher: fetchGuardian, weight: 0.2, isWorking: true },
      { name: 'nyt', fetcher: fetchNYT, weight: 0.2, isWorking: true },
      { name: 'currents', fetcher: fetchCurrents, weight: 0.2, isWorking: true }
    ];
    this.cache = new ArticleCache();
  }

  async getNews(category, count = 20) {
    // Try to get from cache first
    const cachedNews = this.cache.getByCategory(category);
    if (cachedNews.length >= count) {
      return cachedNews.slice(0, count);
    }

    // Get from APIs
    const results = [];
    const workingProviders = this.apiProviders.filter(p => p.isWorking);
    
    for (const provider of workingProviders) {
      try {
        const providerCount = Math.ceil(count * provider.weight);
        const news = await provider.fetcher(category, providerCount);
        results.push(...news);
      } catch (error) {
        provider.isWorking = false;
        console.error(`Provider ${provider.name} failed:`, error);
      }
    }

    // Deduplicate, sort and cache
    const uniqueNews = this.deduplicateNews(results);
    this.cache.storeByCategory(category, uniqueNews);
    
    return uniqueNews.slice(0, count);
  }

  deduplicateNews(articles) {
    // Implementation of deduplication logic
    // Using title similarity, url comparison, etc.
  }
}
```

### Content Extraction

Many APIs provide limited content in their responses. We implement a content extraction service to get the full article text:

```javascript
const fetchFullArticleContent = async (url) => {
  try {
    // First check if we already have this content
    const existingContent = await ArticleModel.findOne({ url });
    if (existingContent && existingContent.fullText) {
      return existingContent.fullText;
    }

    // Otherwise extract it
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Remove ads, navigation, etc.
    $('nav, script, style, iframe, footer, header, aside').remove();
    
    // Find main content (customize per site if needed)
    let content = $('article').text() || $('main').text() || $('body').text();
    content = content.trim().replace(/\s+/g, ' ');
    
    // Store for future use
    await ArticleModel.updateOne(
      { url },
      { $set: { fullText: content } },
      { upsert: true }
    );
    
    return content;
  } catch (error) {
    console.error('Error extracting article content:', error);
    return null;
  }
};
```

## API Request Optimization

To maximize the value of limited free API calls:

1. **Intelligent Scheduling**:
   - Schedule fetches during low-usage hours
   - Vary frequency based on category importance
   - Fetch trending topics more frequently

2. **Smart Caching**:
   - Cache articles for at least 6 hours
   - Cache popular topics longer
   - Implement an LRU cache for efficient memory usage

3. **Selective Fetching**:
   - Only fetch full content for articles users are likely to read
   - Use topic modeling to identify important stories
   - Prioritize sources based on reliability and completeness

## Handling API Limitations

### Rate Limiting
- Implement token bucket algorithm for rate limiting
- Queue requests during peak times
- Use exponential backoff for retries

### Content Freshness
- Mark article age clearly in the UI
- Prioritize updating breaking news categories
- Implement "update now" feature for premium users

### API Fallbacks
- Monitor API health and automatically switch providers
- Maintain a "status board" of current API availability
- Scale back refresh rates when APIs are near limits

## Source Attribution and Compliance

All news APIs require proper attribution:

1. **Source Linking**:
   - Always link back to original article
   - Display source name prominently
   - Include source logos where applicable

2. **Terms Compliance**:
   - Follow each API's terms of service
   - Respect robots.txt for content extraction
   - Implement required disclaimers

3. **Copyright Considerations**:
   - Only store content for personal use cases
   - Implement content aging/deletion policies
   - Provide "read original" option prominently 