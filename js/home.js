// Home Page
const HomePage = {
  relationships: [],
  filteredRelationships: [],

  init(relationships) {
    this.relationships = relationships;
    this.filteredRelationships = relationships;
    this.setupSearch();
    this.render();
  },

  setupSearch() {
    const searchInput = document.getElementById('relationship-search');
    searchInput.addEventListener('input', (e) => {
      this.filterRelationships(e.target.value);
    });
  },

  filterRelationships(query) {
    if (!query.trim()) {
      this.filteredRelationships = this.relationships;
    } else {
      this.filteredRelationships = this.relationships.filter(rel =>
        rel.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    this.renderRelationshipsList();
  },

  render() {
    this.renderRelationshipsList();
    this.renderStatistics();
    this.loadCriticalNews();
  },

  renderRelationshipsList() {
    const container = document.getElementById('relationships-list');
    
    if (this.filteredRelationships.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No relationships found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredRelationships.map(rel => `
      <a href="#" class="relationship-card" data-id="${rel.id}">
        <div class="relationship-name">${rel.name}</div>
        <div class="relationship-events">${rel.events} events</div>
      </a>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.relationship-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.getAttribute('data-id');
        App.loadDetailPage(parseInt(id));
      });
    });
  },

  renderStatistics() {
    const total = this.filteredRelationships.length;
    const critical = this.filteredRelationships.filter(r => r.events > 15).length;
    const moderate = this.filteredRelationships.filter(r => r.events >= 8 && r.events <= 15).length;

    document.getElementById('statistics').innerHTML = `
      <div class="row g-4">
        <div class="col-md-4">
          <div class="stat-box">
            <div class="stat-number">${total}</div>
            <div class="stat-label">Monitored Relationships</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-box">
            <div class="stat-number" style="color: var(--accent-red);">${critical}</div>
            <div class="stat-label">Critical Threats</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-box">
            <div class="stat-number" style="color: var(--accent-yellow);">${moderate}</div>
            <div class="stat-label">Moderate Concerns</div>
          </div>
        </div>
      </div>
    `;
  },

  async loadCriticalNews() {
    const critical = this.filteredRelationships.filter(r => r.events > 15);
    
    if (critical.length === 0) {
      document.getElementById('critical-news-section').innerHTML = '';
      return;
    }

    const container = document.getElementById('critical-news-section');
    container.innerHTML = `
      <div class="section-header mt-5">
        <h2>Critical Relationship News</h2>
        <p>Latest news for high-risk relationships</p>
      </div>
      <div id="critical-news-content">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    `;

    const newsContent = document.getElementById('critical-news-content');
    newsContent.innerHTML = '';

    for (const rel of critical.slice(0, 5)) {
      const news = await NewsService.fetchNewsForRelationship(rel.name);
      
      if (news.articles && news.articles.length > 0) {
        newsContent.innerHTML += this.renderSimpleNewsSection(rel.name, news.articles.slice(0, 3));
      }
    }
  },

  renderSimpleNewsSection(title, articles) {
    return `
      <div class="simple-news-section">
        <h4>${title}</h4>
        <div>
          ${articles.slice(0, 1).map(article => `
            <div class="simple-news-item">
              <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                ${article.title}
              </a>
              <div class="simple-news-meta">
                <span>${article.source.name}</span>
                <span>${Utils.formatDate(article.publishedAt, true)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.HomePage = HomePage;