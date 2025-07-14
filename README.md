# Interactive Job Data Visualization

A Vue 3 application that provides an interactive data visualization interface for job postings, featuring dynamic bar charts and detailed job information displays.

## 🚀 Live Demo

The application is deployed and available at: https://jobs-chart.netlify.app/

## 📋 Features

- **Interactive Bar Chart**: Visualizes job postings by month using Chart.js
- **Job Details Table**: Click on any bar to view detailed job information for that month
- **Modular Architecture**: Clean separation of concerns with reusable components
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Data**: Fetches job data from the Certara API
- **TypeScript Support**: Full type safety throughout the application
- **Comprehensive Testing**: 89+ unit tests ensuring reliability

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with Vue SFC
- **Charts**: Chart.js with vue-chartjs
- **Testing**: Vitest with Vue Test Utils
- **State Management**: Vue Composition API
- **Deployment**: Netlify with automatic builds

## 📦 Prerequisites

- **Node.js**: Version 22.14.0 or higher (required for crypto.hash compatibility)
- **npm**: Latest version recommended

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/haleyswain/jobs-chart
cd certara-challenge/certara-challenge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Setup

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The built files will be generated in the `dist/` directory.

## 🧪 Testing

### Run All Tests

```bash
npm run test:unit
```

### Run Tests in Watch Mode

```bash
npm run test:unit -- --watch
```

### Test Coverage

The test suite includes:
- Component rendering tests
- User interaction tests
- Data processing and formatting tests
- API service tests
- Responsive behavior tests

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── BarChart.vue    # Interactive chart component (display only)
│   ├── JobDetailsTable.vue # Job details display component
│   └── HomePage.vue   # Main home page
├── services/           # API and data services
│   ├── api.ts         # API client
│   ├── jobService.ts  # Job data service
│   └── formatDataForChart.ts # Chart data formatting
├── utils/             # Utility functions
│   └── dateFormatter.ts # Date formatting utilities
└── main.ts            # Application entry point
```

## 🔧 Configuration

### API Configuration

The application uses a proxy configuration to connect to the Certara API:

- **Development**: Vite proxy configuration in `vite.config.ts`
- **Production**: Netlify redirects in `public/_redirects`

### Environment Variables

For production deployment, set:

```bash
VITE_API_BASE_URL=https://dsg-api-test.k2-app.com
```

## 🌐 Deployment

### Netlify Deployment

The application is configured for Netlify deployment:

1. **Build Command**: `rm -rf node_modules package-lock.json && npm install && npm run build`
2. **Publish Directory**: `dist`
3. **Node Version**: 22.14.0
4. **API Proxy**: Configured via netlify environment variables

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

## 📊 Features Deep Dive

### Interactive Bar Chart

- **Monthly Grouping**: Jobs are automatically grouped by publication month
- **Click Interaction**: Click any bar to view detailed job information
- **Visual Feedback**: Selected bars change color and show pointer cursor on hover
- **Responsive Design**: Chart automatically adjusts to screen size
- **Component Architecture**: Focused solely on chart display and event emission

### Job Details Table

- **Filtered Display**: Shows only jobs from the selected month
- **Complete Information**: Title, organization, location, and formatted publication date
- **Sorting**: Jobs are displayed in chronological order
- **Responsive Table**: Optimized for mobile viewing
- **Modular Component**: Separate reusable component for job details display

## 🔍 Code Quality

### TypeScript

- Full TypeScript implementation with strict type checking
- Custom type definitions for all data structures
- Type-safe API calls and data transformations

### Testing

- Comprehensive unit test coverage
- Component testing with Vue Test Utils
- Service layer testing
- Mock implementations for external dependencies

### Linting and Formatting

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version**: Ensure you're using Node.js 22.14.0 or higher
2. **npm Registry**: If you encounter authentication issues, check your npm registry configuration
3. **API Proxy**: In development, ensure the Vite proxy is working correctly

### Known Limitations

- Chart initially displays small on some devices (resolved with resize event)
- API responses may vary; error handling is implemented for graceful degradation

## 📝 Additional Scripts

```bash
# Type checking
npm run type-check

# Preview production build
npm run preview

# Run all checks (lint, type-check, test)
npm run lint && npm run type-check && npm run test:unit
```

## 🏗️ Development Notes

- The application uses UTC date parsing for consistent timezone handling
- Chart.js is configured with responsive options for optimal mobile experience
- API calls include proper error handling and loading states
- Component architecture follows Vue 3 composition API best practices
- **Separation of Concerns**: BarChart component handles only chart display, JobSearch manages data and interactions
- **Event-Driven Architecture**: Components communicate via Vue events for better maintainability
- **TypeScript Integration**: Full type safety with proper interfaces and type definitions throughout

## 📄 License

This project is created for assessment purposes.

---

Built with ❤️ for the Certara technical assessment
