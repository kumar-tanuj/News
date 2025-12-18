// ============================================
// FILE: js/detail.js
// ============================================

const DetailPage = {
  relationshipId: null,
  relationship: null,
  stats: [],

  async init(data) {
    this.relationshipId = data.relationshipId;
    
    // Setup back button
    document.getElementById('detail-back-btn').addEventListener('click', (e) => {
      e.preventDefault();
      // When going back from detail page, ensure home nav stays active
      App.loadPage('home');
      
      // Also ensure the nav-home element has the active class
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      const navElement = document.getElementById('nav-home');
      if (navElement) {
        navElement.classList.add('active');
      }
    });

    // Setup tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.getAttribute('data-tab'));
      });
    });

    await this.loadData();
    this.render();
  },

  async loadData() {
    this.relationship = await SupabaseService.getRelationshipById(this.relationshipId);
    this.stats = await SupabaseService.getRelationshipStats(this.relationshipId);
  },

  render() {
    if (!this.relationship) {
      document.getElementById('detail-title').textContent = 'Relationship not found';
      return;
    }

    document.getElementById('detail-title').textContent = this.relationship.name;
    this.renderTabContent('overview'); // Default tab
  },

  renderTabContent(tabName) {
    const contentDiv = document.getElementById(`${tabName}-tab`);
    if (!contentDiv) return;

    switch (tabName) {
      case 'overview':
        this.renderOverview(contentDiv);
        break;
      case 'dime':
        this.renderDime(contentDiv);
        break;
      case 'economic':
        this.renderEconomic(contentDiv);
        break;
      case 'impact':
        this.renderImpact(contentDiv);
        break;
      case 'recommendations':
        this.renderRecommendations(contentDiv);
        break;
    }
  },

  renderOverview(container) {
    container.innerHTML = `
      <div class="row g-4 mb-4" id="metrics-grid"></div>
      <div id="detail-news-section"></div>
    `;
    this.renderMetrics();
    this.loadNews();
  },

  renderDime(container) {
    const dimeCategories = ['Diplomatic', 'Information', 'Military', 'Economic'];
    const dimeStats = this.stats.filter(stat => 
      dimeCategories.some(cat => stat.metric.toLowerCase().includes(cat.toLowerCase()))
    );

    container.innerHTML = `
      <div class="section-header">
        <h2>DIME Analysis</h2>
        <p>Dimensions of Interactive Military Engagement framework</p>
      </div>
      <div class="row g-4">
        ${dimeStats.map(stat => `
          <div class="col-md-3">
            <div class="metric-box">
              <div class="metric-number">${stat.value !== null ? stat.value : 0}</div>
              <div class="metric-label">${stat.metric} Events</div>
            </div>
          </div>
        `).join('')}
      </div>
      ${dimeStats.length === 0 ? '<div class="empty-state"><h3>No DIME metrics available</h3><p>Insufficient data for DIME analysis</p></div>' : ''}
    `;
  },

  renderEconomic(container) {
    const economicStats = this.stats.filter(stat => 
      stat.metric.toLowerCase().includes('economic')
    );

    container.innerHTML = `
      <div class="section-header">
        <h2>Economic Analysis</h2>
        <p>Financial and trade relationship indicators</p>
      </div>
      <div class="row g-4">
        ${economicStats.map(stat => `
          <div class="col-md-3">
            <div class="metric-box">
              <div class="metric-number">${stat.value !== null ? stat.value : 0}</div>
              <div class="metric-label">${stat.metric} Events</div>
            </div>
          </div>
        `).join('')}
      </div>
      ${economicStats.length === 0 ? '<div class="empty-state"><h3>No economic metrics available</h3><p>Insufficient data for economic analysis</p></div>' : ''}
      <div class="card mt-4">
        <h3 class="card-title">Economic Impact Assessment</h3>
        <p class="text-muted">Based on current data, this relationship shows ${economicStats.reduce((sum, s) => sum + (s.value !== null ? s.value : 0), 0)} economic-related events.</p>
      </div>
    `;
  },

  renderImpact(container) {
    const impactStats = this.stats.filter(stat => 
      stat.metric.toLowerCase().includes('impact') || stat.metric.toLowerCase().includes('effect')
    );

    container.innerHTML = `
      <div class="section-header">
        <h2>Impact Analysis</h2>
        <p>Assessment of relationship influence and effects</p>
      </div>
      <div class="row g-4">
        ${impactStats.map(stat => `
          <div class="col-md-3">
            <div class="metric-box">
              <div class="metric-number">${stat.value !== null ? stat.value : 0}</div>
              <div class="metric-label">${stat.metric} Events</div>
            </div>
          </div>
        `).join('')}
      </div>
      ${impactStats.length === 0 ? '<div class="empty-state"><h3>No impact metrics available</h3><p>Insufficient data for impact analysis</p></div>' : ''}
      <div class="card mt-4">
        <h3 class="card-title">Overall Impact</h3>
        <p class="text-muted">Total events for this relationship: ${this.relationship.events}</p>
        <div class="alert alert-${this.relationship.events > 15 ? 'danger' : this.relationship.events > 8 ? 'warning' : 'success'}">
          Threat Level: ${this.relationship.events > 15 ? 'Critical' : this.relationship.events > 8 ? 'Moderate' : 'Low'}
        </div>
      </div>
    `;
  },

  renderRecommendations(container) {
    const totalEvents = this.relationship.events;
    const criticalStats = this.stats.filter(stat => stat.value !== null && stat.value > 10);

    container.innerHTML = `
      <div class="section-header">
        <h2>Recommendations</h2>
        <p>Actionable intelligence and monitoring suggestions</p>
      </div>
      <div class="alert alert-info">
        <h3 class="alert-heading">Monitoring Recommendations</h3>
        <ul>
          <li>Continue monitoring news sources for ${this.relationship.name}</li>
          ${totalEvents > 15 ? '<li>Increase monitoring frequency due to high activity</li>' : ''}
          ${criticalStats.length > 0 ? '<li>Focus on critical metrics: ' + criticalStats.map(s => s.metric).join(', ') + '</li>' : ''}
          <li>Review diplomatic channels for potential interventions</li>
        </ul>
      </div>
      <div class="card mt-4">
        <h3 class="card-title">Intelligence Priorities</h3>
        <p class="text-muted">Based on current data analysis, prioritize information gathering on emerging trends in this relationship.</p>
      </div>
    `;
  },

  renderMetrics() {
    const grid = document.getElementById('metrics-grid');
    
    if (this.stats.length === 0) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><h3>No metrics available</h3><p>Insufficient data for analysis</p></div></div>';
      return;
    }

    grid.innerHTML = this.stats.map(stat => `
      <div class="col-md-3">
        <div class="metric-box">
          <div class="metric-number">${stat.value !== null ? stat.value : 0}</div>
          <div class="metric-label">${stat.metric} Events</div>
        </div>
      </div>
    `).join('');
  },

  async loadNews() {
    const newsSection = document.getElementById('detail-news-section');
    newsSection.innerHTML = `
      <div class="section-header mt-5">
        <h2>Latest News</h2>
        <p>Recent developments related to this relationship</p>
      </div>
      <div class="loading-spinner">
        <div class="spinner-border text-primary"></div>
      </div>
    `;

    const news = await NewsService.fetchNewsForRelationship(this.relationship.name);

    if (news.articles && news.articles.length > 0) {
      newsSection.innerHTML = `
        <div class="section-header mt-5">
          <h2>Latest News</h2>
          <p>Recent developments related to this relationship</p>
          <div class="text-right">
            <a href="#" class="news-link" onclick="App.loadNewsPageForRelationship('${this.relationship.name}'); return false;">
              Show All News →
            </a>
          </div>
        </div>
        <div class="row g-4">
          ${news.articles.map(article => `
            <div class="col-md-4">
              ${this.renderNewsCard(article)}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      newsSection.innerHTML = '<div class="empty-state"><h3>No recent news found</h3><p>Check back later for updates</p></div>';
    }
  },

  renderNewsCard(article) {
    return `
      <div class="news-card">
        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'">` : ''}
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

  switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';

    // Render content for the tab
    this.renderTabContent(tabName);
  }
};

window.DetailPage = DetailPage;