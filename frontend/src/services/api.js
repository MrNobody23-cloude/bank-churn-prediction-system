const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.useLocalFallback = false;
  }

  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.useLocalFallback = false;
      return await response.json();
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error.message);
      this.useLocalFallback = true;
      return null;
    }
  }

  async getCustomers() {
    return this.fetch('/customers');
  }

  async getCustomer(id) {
    return this.fetch(`/customers/${id}`);
  }

  async predict(data) {
    return this.fetch('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMetrics() {
    return this.fetch('/metrics');
  }

  async getDistribution() {
    return this.fetch('/analytics/distribution');
  }

  async getGeographyAnalysis() {
    return this.fetch('/analytics/geography');
  }

  async getAgeAnalysis() {
    return this.fetch('/analytics/age');
  }

  async getStats() {
    return this.fetch('/analytics/stats');
  }

  async getFeatureImportance() {
    return this.fetch('/feature-importance');
  }

  isUsingFallback() {
    return this.useLocalFallback;
  }
}

export const apiService = new ApiService();
export default apiService;
