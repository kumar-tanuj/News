// ============================================
// FILE: js/news.js
// ============================================

const NewsPage = {
  currentPage: 1,
  currentQuery: '',
  relationshipName: '',
  totalResults: 0,
  articles: [],

  init(data = {}) {
    this.relationshipName = data.relationshipName || '';
    this.currentQuery = this.relationshipName ? this.relationshipName.replace(/[-–]/g, ' ').trim() : '';
    this.currentPage = 1;
    this.articles = [];
    
    this.setupEventListeners();
    this.loadNews();
  },

  setupEventListeners() {
    // Back button
    document.getElementById('news-back-btn').addEventListener('click', (e) => {
      e.preventDefault();
      App.loadPage('home');
    });

    // Search form
    document.getElementById('news-search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // Load more button
    document.getElementById('load-more-btn').addEventListener('click', () => {
      this.loadMore();
    });
  },

  async loadNews() {
    Utils.showLoading('news-loading');
    
    let newsData;
    if (this.currentQuery) {
      newsData = await NewsService.searchNews(this.currentQuery, this.currentPage);
    } else {
      newsData = await NewsService.fetchDefaultNews(this.currentPage);
    }

    Utils.hideLoading('news-loading');

    if (newsData.status === 'ok') {
      this.totalResults = newsData.totalResults;
      
      if (this.currentPage === 1) {
        this.articles = newsData.articles;
      } else {
        this.articles = [...this.articles, ...newsData.articles];
      }
      
      this.render();
    }
  },

  render() {
    this.updateTitle();
    this.renderNewsGrid();
    this.updateLoadMoreButton();
  },

  updateTitle() {
    const title = this.relationshipName 
      ? `News for ${this.relationshipName}` 
      : this.currentQuery 
        ? `Search results for "${this.currentQuery}"` 
        : "Latest International News";
    
    document.getElementById('news-page-title').textContent = title;
    document.getElementById('news-result-count').textContent = `${this.totalResults} articles found`;
  },

  renderNewsGrid() {
    const grid = document.getElementById('news-grid');
    
    if (this.articles.length === 0) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><h3>No articles found</h3><p>Try a different search query</p></div></div>';
      return;
    }

    if (this.currentPage === 1) {
      grid.innerHTML = '';
    }

    this.articles.forEach((article, index) => {
      if (this.currentPage > 1) {
        const existingCount = grid.children.length;
        if (index < existingCount) return;
      }

      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = this.renderNewsCard(article);
      grid.appendChild(col);
    });
  },

  renderNewsCard(article) {
    return `
      <div class="news-card">
        ${article.urlToImage ? `
          <img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'">
        ` : ''}
        <div class="news-card-body">
          <h3 class="news-title">${article.title}</h3>
          ${article.description ? `<p class="news-description">${article.description}</p>` : ''}
          <div class="news-meta">
            <span>${article.source.name}</span>
            <span>${Utils.formatDate(article.publishedAt)}</span>
          </div>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-link">
            Read Full Article →
          </a>
        </div>
      </div>
    `;
  },

  updateLoadMoreButton() {
    const hasMore = this.articles.length < this.totalResults;
    const container = document.getElementById('load-more-container');
    container.style.display = hasMore ? 'block' : 'none';
  },

  handleSearch() {
    const input = document.getElementById('search-input');
    this.currentQuery = input.value.trim();
    this.relationshipName = '';
    this.currentPage = 1;
    this.articles = [];
    this.loadNews();
  },

  loadMore() {
    this.currentPage++;
    const btn = document.getElementById('load-more-btn');
    btn.disabled = true;
    btn.querySelector('.spinner-border').style.display = 'inline-block';
    
    this.loadNews().then(() => {
      btn.disabled = false;
      btn.querySelector('.spinner-border').style.display = 'none';
    });
  }
};

window.NewsPage = NewsPage;