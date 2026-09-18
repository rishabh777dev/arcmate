import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cognee Cloud Client
 * Connects directly to the user's live Cognee AWS instance
 * Base URL: https://tenant-f05eece1-d390-44ab-ae6b-269435b97222.aws.cognee.ai
 * Tenant ID: f05eece1-d390-44ab-ae6b-269435b97222
 * User ID: 85cdfcc0-d895-4415-ae61-11f1375820b0
 */
export class CogneeCloudService {
  constructor() {
    this.baseUrl = process.env.COGNEE_API_URL || 'https://tenant-f05eece1-d390-44ab-ae6b-269435b97222.aws.cognee.ai';
    this.tenantId = process.env.COGNEE_TENANT_ID || 'f05eece1-d390-44ab-ae6b-269435b97222';
    this.userId = process.env.COGNEE_USER_ID || '85cdfcc0-d895-4415-ae61-11f1375820b0';
    this.apiKey = process.env.COGNEE_API_KEY || null;
  }

  setApiKey(key) {
    this.apiKey = key;
    process.env.COGNEE_API_KEY = key;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-Id': this.tenantId
    };
    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }
    return headers;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Ingest a business rule, policy, or document into Cognee Cloud
   */
  async addDocument(data, datasetName = 'merchant_knowledge') {
    if (!this.apiKey) {
      return { live: false, message: 'COGNEE_API_KEY not configured. Running on high-performance local knowledge engine.' };
    }

    try {
      console.log(`[CogneeCloud] Ingesting document to live tenant: ${this.baseUrl}/api/v1/add`);
      const response = await axios.post(
        `${this.baseUrl}/api/v1/add`,
        {
          datasetName,
          data: typeof data === 'string' ? data : JSON.stringify(data)
        },
        { headers: this.getHeaders(), timeout: 8000 }
      );
      return { live: true, data: response.data };
    } catch (err) {
      console.warn(`[CogneeCloud] Live add failed (${err.message}). Using resilient graph store.`);
      return { live: false, error: err.message };
    }
  }

  /**
   * Triggers Cognify graph extraction in Cognee Cloud
   */
  async cognify(datasets = ['merchant_knowledge']) {
    if (!this.apiKey) return { live: false };

    try {
      console.log(`[CogneeCloud] Cognifying datasets on live tenant: ${this.baseUrl}/api/v1/cognify`);
      const response = await axios.post(
        `${this.baseUrl}/api/v1/cognify`,
        { datasets },
        { headers: this.getHeaders(), timeout: 10000 }
      );
      return { live: true, data: response.data };
    } catch (err) {
      console.warn(`[CogneeCloud] Live cognify error (${err.message})`);
      return { live: false, error: err.message };
    }
  }

  /**
   * Search knowledge graph & memories in Cognee Cloud
   */
  async search(query, searchType = 'GRAPH') {
    if (!this.apiKey) return null;

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/search`,
        { query, searchType },
        { headers: this.getHeaders(), timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.warn(`[CogneeCloud] Search error (${err.message})`);
      return null;
    }
  }
}

export const cogneeCloudService = new CogneeCloudService();
