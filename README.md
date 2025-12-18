# OSINT Dashboard

A powerful OSINT (Open Source Intelligence) dashboard built with HTML, CSS, Bootstrap, and vanilla JavaScript, integrated with Supabase for data management and NewsAPI for news aggregation.

## Project Structure

```
osint-dashboard/
├── index.html                 # Main HTML file
├── pages/
│ ├── home.html               # Home page template
│ ├── news.html               # News page template
│ └── detail.html             # Detail page template
├── css/
│ ├── style.css               # Main styles & layout
│ └── components.css          # Component-specific styles
└── js/
  ├── config.js               # Configuration & API keys
  ├── supabase-service.js     # Supabase data service
  ├── news-service.js         # News API service
  ├── app.js                  # Main application logic
  ├── home.js                 # Home page functionality
  ├── news.js                 # News page functionality
  └── detail.js               # Detail page functionality
```

## Features

- **Countries Dashboard**: View and manage country-specific OSINT data
- **News Aggregation**: Fetch and display news from NewsAPI
- **Detail Views**: In-depth information pages
- **Responsive Design**: Built with Bootstrap for mobile-first design
- **Real-time Data**: Integrated with Supabase for backend data

## Prerequisites

- Node.js (for package management)
- A modern web browser
- Internet connection (for API calls and CDN resources)

## Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd osint-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

API keys are configured in `js/config.js` for this project.

## Running the Application

### Option 1: Using Live Server (Recommended)

Install live-server globally (if not already installed):
```bash
npm install -g live-server
```

Start the development server:
```bash
live-server --port=3000
```

### Option 2: Using Node.js HTTP Server

Install http-server globally:
```bash
npm install -g http-server
```

Start the server:
```bash
http-server -p 3000
```

### Option 3: Using Python (if available)

If you have Python installed:
```bash
python -m http.server 3000
```

### Option 4: Direct Browser Open

Simply open `index.html` in your browser. However, this may cause CORS issues with API calls.

## Accessing the Dashboard

Once the server is running, open your browser and navigate to:
```
http://localhost:3000
```

## API Configuration

The application uses:
- **Supabase**: For backend data storage
- **NewsAPI**: For news aggregation

API keys are configured in `js/config.js`. Update them with your own keys if needed.

## Development

- **HTML**: Main structure in `index.html`, page templates in `pages/`
- **CSS**: Styles in `css/style.css` and `css/components.css`
- **JavaScript**: Modular JS files in `js/` directory
- **Bootstrap**: Responsive framework loaded via CDN

## Troubleshooting

1. **CORS Errors**: Ensure you're running from a local server, not opening `index.html` directly
2. **API Errors**: Check your API keys in `js/config.js`
3. **Bootstrap Issues**: Verify CDN links are accessible
4. **Supabase Connection**: Ensure Supabase URL and key are correct

## Contributing

1. Make changes to the respective files
2. Test locally with the development server
3. Ensure responsive design works on mobile devices

## License

[Add your license here]