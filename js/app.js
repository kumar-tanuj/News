// Main Application
const App = {
  currentPage: 'home',
  relationships: [],

  async init() {
    // Initialize services
    SupabaseService.init();
    
    // Load relationships
    await this.loadRelationships();
    
    // Setup navigation
    this.setupNavigation();
    
    // Load home page
    this.loadPage('home');
  },

  async loadRelationships() {
    this.relationships = await SupabaseService.getRelationships();
  },

  setupNavigation() {
    document.getElementById('nav-home').addEventListener('click', (e) => {
      e.preventDefault();
      this.loadPage('home');
    });

    document.getElementById('nav-news').addEventListener('click', (e) => {
      e.preventDefault();
      this.loadPage('news');
    });
  },

  async loadPage(pageName, data = {}) {
    this.currentPage = pageName;
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // For detail page, keep home nav active since it's part of the Monitored Relationships section
    if (pageName === 'detail') {
      const navElement = document.getElementById('nav-home');
      if (navElement) {
        navElement.classList.add('active');
      }
    } else {
      const navElement = document.getElementById(`nav-${pageName}`);
      if (navElement) {
        navElement.classList.add('active');
      }
    }
    
    // Load page content
    const container = document.getElementById('page-container');
    
    try {
      const response = await fetch(`pages/${pageName}.html`);
      const html = await response.text();
      container.innerHTML = html;
      
      // Initialize page-specific functionality
      if (pageName === 'home') {
        HomePage.init(this.relationships);
      } else if (pageName === 'news') {
        NewsPage.init(data);
      } else if (pageName === 'detail') {
        DetailPage.init(data);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      container.innerHTML = '<div class="alert alert-danger">Error loading page</div>';
    }
  },

  loadDetailPage(relationshipId) {
    this.loadPage('detail', { relationshipId });
  },

  loadNewsPageForRelationship(relationshipName) {
    this.loadPage('news', { relationshipName });
  }
};

// Utility Functions
const Utils = {
  formatDate(dateString, short = false) {
    const date = new Date(dateString);
    if (short) {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'block';
  },

  hideLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'none';
  }
};

window.Utils = Utils;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.App = App;