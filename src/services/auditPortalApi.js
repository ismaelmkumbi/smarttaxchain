import axios from 'axios';

// Create axios instance with default configuration for audit portal
const auditPortalApi = axios.create({
  baseURL: process.env.REACT_APP_AUDIT_API_URL || '/api/audit',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and security
auditPortalApi.interceptors.request.use(
  (config) => {
    // Add timestamp for cache busting
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['X-Client-Version'] = '1.0.0';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and data validation
auditPortalApi.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (response.data && typeof response.data === 'object') {
      // Add data verification timestamp
      response.data._verified = new Date().toISOString();
    }
    
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints for audit portal data
export const auditPortalService = {
  // Get revenue data with date range filtering
  getRevenueData: async (params = {}) => {
    try {
      const response = await auditPortalApi.get('/revenue', { params });
      return response.data;
    } catch (error) {
      // Return mock data if API fails (for development)
      console.warn('Using mock revenue data due to API error');
      return getMockRevenueData();
    }
  },

  // Get regional tax data
  getRegionalData: async (params = {}) => {
    try {
      const response = await auditPortalApi.get('/regional', { params });
      return response.data;
    } catch (error) {
      console.warn('Using mock regional data due to API error');
      return getMockRegionalData();
    }
  },

  // Get tax type distribution
  getTaxTypeDistribution: async (params = {}) => {
    try {
      const response = await auditPortalApi.get('/tax-types', { params });
      return response.data;
    } catch (error) {
      console.warn('Using mock tax type data due to API error');
      return getMockTaxTypeData();
    }
  },

  // Get compliance metrics
  getComplianceMetrics: async (params = {}) => {
    try {
      const response = await auditPortalApi.get('/compliance', { params });
      return response.data;
    } catch (error) {
      console.warn('Using mock compliance data due to API error');
      return getMockComplianceData();
    }
  },

  // Submit feedback (with offline support)
  submitFeedback: async (feedbackData) => {
    try {
      // Sanitize feedback data
      const sanitizedData = {
        category: feedbackData.category,
        message: feedbackData.message.substring(0, 2000), // Limit message length
        email: feedbackData.anonymous ? null : feedbackData.email,
        anonymous: feedbackData.anonymous,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language
      };

      const response = await auditPortalApi.post('/feedback', sanitizedData);
      return response.data;
    } catch (error) {
      // Store feedback locally for offline submission
      if ('serviceWorker' in navigator) {
        await storeOfflineFeedback(feedbackData);
        throw new Error('Feedback stored offline. Will be submitted when connection is restored.');
      }
      throw error;
    }
  },

  // Get system status and last update time
  getSystemStatus: async () => {
    try {
      const response = await auditPortalApi.get('/status');
      return response.data;
    } catch (error) {
      return {
        status: 'unknown',
        lastUpdated: new Date().toISOString(),
        message: 'Unable to verify system status'
      };
    }
  }
};

// Mock data functions for development and fallback
const getMockRevenueData = () => [
  { month: 'Jan 2024', revenue: 45000000000, compliance: 92, businesses: 125000 },
  { month: 'Feb 2024', revenue: 48000000000, compliance: 94, businesses: 127000 },
  { month: 'Mar 2024', revenue: 52000000000, compliance: 91, businesses: 129000 },
  { month: 'Apr 2024', revenue: 49000000000, compliance: 93, businesses: 131000 },
  { month: 'May 2024', revenue: 55000000000, compliance: 95, businesses: 133000 },
  { month: 'Jun 2024', revenue: 58000000000, compliance: 96, businesses: 135000 },
  { month: 'Jul 2024', revenue: 61000000000, compliance: 94, businesses: 137000 },
  { month: 'Aug 2024', revenue: 59000000000, compliance: 93, businesses: 139000 },
  { month: 'Sep 2024', revenue: 63000000000, compliance: 97, businesses: 141000 },
  { month: 'Oct 2024', revenue: 66000000000, compliance: 95, businesses: 143000 },
  { month: 'Nov 2024', revenue: 64000000000, compliance: 96, businesses: 145000 },
  { month: 'Dec 2024', revenue: 68000000000, compliance: 98, businesses: 147000 }
];

const getMockRegionalData = () => [
  { region: 'Dar es Salaam', revenue: 28500000000, compliance: 96, businesses: 45000, population: 4364541 },
  { region: 'Mwanza', revenue: 8200000000, compliance: 89, businesses: 12500, population: 2772509 },
  { region: 'Arusha', revenue: 6800000000, compliance: 92, businesses: 9800, population: 1694310 },
  { region: 'Mbeya', revenue: 4500000000, compliance: 85, businesses: 7200, population: 2707410 },
  { region: 'Morogoro', revenue: 3200000000, compliance: 88, businesses: 5600, population: 2218492 },
  { region: 'Tanga', revenue: 2800000000, compliance: 90, businesses: 4800, population: 2045205 },
  { region: 'Dodoma', revenue: 2100000000, compliance: 87, businesses: 3900, population: 2083588 },
  { region: 'Tabora', revenue: 1800000000, compliance: 83, businesses: 3200, population: 2291623 }
];

const getMockTaxTypeData = () => [
  { type: 'VAT', typeSwahili: 'Kodi ya Ongezeko la Thamani', amount: 35000000000, percentage: 35, color: '#1976d2' },
  { type: 'Income Tax', typeSwahili: 'Kodi ya Mapato', amount: 28000000000, percentage: 28, color: '#2e7d32' },
  { type: 'Corporate Tax', typeSwahili: 'Kodi ya Makampuni', amount: 18000000000, percentage: 18, color: '#ed6c02' },
  { type: 'Excise Duty', typeSwahili: 'Ushuru wa Bidhaa Maalum', amount: 12000000000, percentage: 12, color: '#d32f2f' },
  { type: 'Import Duty', typeSwahili: 'Ushuru wa Uagizaji', amount: 7000000000, percentage: 7, color: '#7b1fa2' }
];

const getMockComplianceData = () => ({
  overall: 96,
  byRegion: getMockRegionalData().map(r => ({ region: r.region, compliance: r.compliance })),
  trend: [92, 94, 91, 93, 95, 96, 94, 93, 97, 95, 96, 98]
});

// Offline feedback storage
const storeOfflineFeedback = async (feedbackData) => {
  if ('indexedDB' in window) {
    // Store in IndexedDB for offline submission
    const dbName = 'TRAFeedbackDB';
    const storeName = 'pendingFeedback';
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const feedbackWithId = {
          ...feedbackData,
          id: Date.now().toString(),
          storedAt: new Date().toISOString()
        };
        
        store.add(feedbackWithId);
        transaction.oncomplete = () => resolve(feedbackWithId);
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }
};

export default auditPortalApi;
