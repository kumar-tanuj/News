// News Service
const NewsService = {
  async fetchNews(queryParams) {
    try {
      const { NEWS_API } = window.CONFIG;
      const url = `${NEWS_API.BASE_URL}/everything?${queryParams}&apiKey=${NEWS_API.KEY}&pageSize=${NEWS_API.PAGE_SIZE}&sortBy=publishedAt`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        status: 'error',
        totalResults: 0,
        articles: []
      };
    }
  },

  async fetchNewsForRelationship(relationshipName, page = 1) {
    const query = relationshipName.replace(/[-–]/g, ' ').trim();
    return this.fetchNews(`q=${encodeURIComponent(query)}&page=${page}`);
  },

  async searchNews(searchQuery, page = 1) {
    return this.fetchNews(`q=${encodeURIComponent(searchQuery)}&page=${page}`);
  },

  async fetchDefaultNews(page = 1) {
    return this.fetchNews(`q=international+relations+diplomacy&page=${page}`);
  }
};

// Export
window.NewsService = NewsService;