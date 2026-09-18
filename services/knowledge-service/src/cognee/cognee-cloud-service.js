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
    this.apiKey = process.env.COGNEE_API_KEY || 'fec9104ee85f585012ecacab833ad622fd35ecfea3c30e3f6bd9a6f797e1b086';
    this.datasetId = '5aece55b-b308-5884-8acf-f5735344fac6';
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
  async addDocument(data, datasetName = 'merchant_rules') {
    if (!this.apiKey) {
      return { live: false, message: 'COGNEE_API_KEY not configured. Running on high-performance local knowledge engine.' };
    }

    try {
      const text = typeof data === 'string'
        ? data
        : `${data.title ? data.title + ': ' : ''}${data.content || JSON.stringify(data)}`;

      console.log(`[CogneeCloud] Ingesting text into live Cognee AWS instance: ${this.baseUrl}/api/v1/add_text`);
      const response = await axios.post(
        `${this.baseUrl}/api/v1/add_text`,
        {
          text_data: [text],
          datasetName
        },
        { headers: this.getHeaders(), timeout: 15000 }
      );

      if (response.data?.dataset_id) {
        this.datasetId = response.data.dataset_id;
      }

      // Automatically trigger Cognify in background to extract entities and knowledge links
      this.cognify([datasetName]).catch(e => console.warn('[CogneeCloud] Auto-cognify background notice:', e.message));

      return { live: true, data: response.data };
    } catch (err) {
      console.warn(`[CogneeCloud] Live add failed (${err.message}). Using resilient fallback.`);
      return { live: false, error: err.message };
    }
  }

  /**
   * Triggers Cognify graph extraction in Cognee Cloud
   */
  async cognify(datasets = ['merchant_rules']) {
    if (!this.apiKey) return { live: false };

    try {
      console.log(`[CogneeCloud] Cognifying datasets on live tenant: ${datasets.join(', ')}`);
      const response = await axios.post(
        `${this.baseUrl}/api/v1/cognify`,
        {
          datasets,
          run_in_background: true
        },
        { headers: this.getHeaders(), timeout: 15000 }
      );
      return { live: true, data: response.data };
    } catch (err) {
      console.warn(`[CogneeCloud] Live cognify notice (${err.message})`);
      return { live: false, error: err.message };
    }
  }

  /**
   * Search knowledge graph & memories in Cognee Cloud
   */
  async search(query, searchType = 'CHUNKS') {
    if (!this.apiKey) return null;

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/search`,
        { query, searchType: searchType || 'CHUNKS' },
        { headers: this.getHeaders(), timeout: 8000 }
      );
      return response.data;
    } catch (err) {
      console.warn(`[CogneeCloud] Search notice (${err.message})`);
      return null;
    }
  }

  /**
   * Fetch live knowledge graph visualization from Cognee Cloud
   */
  async getLiveGraph(datasetId = null) {
    if (!this.apiKey) return null;

    try {
      const targetId = datasetId || this.datasetId;
      const response = await axios.get(
        `${this.baseUrl}/api/v1/visualize/json?dataset_id=${targetId}&full=true`,
        { headers: this.getHeaders(), timeout: 8000 }
      );
      return response.data;
    } catch (err) {
      console.warn(`[CogneeCloud] Live graph fetch notice (${err.message})`);
      return null;
    }
  }
}

export const cogneeCloudService = new CogneeCloudService();
