import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * n8n Cloud & MCP Client
 * Connects directly to the user's live n8n Cloud MCP Server:
 * Endpoint: https://rishi108.app.n8n.cloud/mcp-server/http
 */
export class N8nCloudClient {
  constructor() {
    this.instanceUrl = process.env.N8N_INSTANCE_URL || 'https://rishi108.app.n8n.cloud';
    this.mcpUrl = process.env.N8N_MCP_URL || 'https://rishi108.app.n8n.cloud/mcp-server/http';
    this.token = process.env.N8N_ACCESS_TOKEN || process.env.N8N_API_KEY || null;
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://rishi108.app.n8n.cloud/webhook/merchant-action';
  }

  setAccessToken(token) {
    this.token = token;
    process.env.N8N_ACCESS_TOKEN = token;
    process.env.N8N_API_KEY = token;
  }

  setInstanceUrl(url) {
    this.instanceUrl = url;
    this.mcpUrl = `${url.replace(/\/+$/, '')}/mcp-server/http`;
  }

  setWebhookUrl(url) {
    this.webhookUrl = url;
    process.env.N8N_WEBHOOK_URL = url;
  }

  isConfigured() {
    return !!this.token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  parseSse(raw) {
    if (typeof raw === 'object' && raw !== null) return raw;
    if (typeof raw === 'string') {
      const match = raw.match(/data:\s*(\{.*\})/s);
      if (match) {
        try { return JSON.parse(match[1]); } catch (e) {}
      }
      try { return JSON.parse(raw); } catch (e) {}
    }
    return raw;
  }

  /**
   * Test connection to n8n MCP Server
   */
  async testMcpConnection() {
    if (!this.token) {
      return { 
        connected: false, 
        message: 'Automation server token not configured.' 
      };
    }

    try {
      const res = await axios.post(
        this.mcpUrl,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'PaytmActionMate',
              version: '1.0.0'
            }
          }
        },
        { headers: this.getHeaders(), timeout: 8000 }
      );

      const parsed = this.parseSse(res.data);

      return {
        connected: true,
        endpoint: this.mcpUrl,
        capabilities: parsed.result?.capabilities || {}
      };
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          connected: false,
          error: 'Authentication failed. Please verify your n8n access token.'
        };
      }
      return {
        connected: false,
        error: err.message,
        details: err.response?.data
      };
    }
  }

  /**
   * Call any MCP Tool on n8n Cloud
   */
  async callMcpTool(name, args = {}) {
    if (!this.token) return { error: 'Not authenticated' };

    try {
      const res = await axios.post(
        this.mcpUrl,
        {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name,
            arguments: args
          }
        },
        { headers: this.getHeaders(), timeout: 15000 }
      );

      const parsed = this.parseSse(res.data);
      return parsed.result;
    } catch (err) {
      console.warn(`[N8nCloudClient] Error calling tool ${name}:`, err.message);
      return { error: err.message };
    }
  }

  /**
   * List available MCP tools from n8n
   */
  async listMcpTools() {
    if (!this.token) return [];

    try {
      const res = await axios.post(
        this.mcpUrl,
        {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/list',
          params: {}
        },
        { headers: this.getHeaders(), timeout: 8000 }
      );
      const parsed = this.parseSse(res.data);
      return parsed.result?.tools || [];
    } catch (err) {
      console.warn('[N8nCloudClient] Error listing MCP tools:', err.message);
      return [];
    }
  }

  /**
   * Query workflows from user's live n8n workspace
   */
  async searchWorkflows(query = '') {
    const result = await this.callMcpTool('search_workflows', { query });
    try {
      if (result?.content?.[0]?.text) {
        return JSON.parse(result.content[0].text);
      }
      if (result?.structuredContent) {
        return result.structuredContent;
      }
    } catch (e) {}
    return { data: [], count: 0 };
  }

  /**
   * Dispatch action to n8n Cloud via Webhook or MCP
   */
  async dispatchAction(payload) {
    if (!this.webhookUrl) {
      return { success: false, reason: 'No webhook configured' };
    }

    try {
      console.log(`[N8nCloudClient] Dispatching action to live n8n: ${this.webhookUrl}`);
      const res = await axios.post(this.webhookUrl, payload, {
        headers: this.getHeaders(),
        timeout: 10000
      });
      return {
        success: true,
        live: true,
        response: res.data
      };
    } catch (err) {
      console.warn(`[N8nCloudClient] Live webhook dispatch error (${err.message})`);
      return {
        success: false,
        live: false,
        error: err.message
      };
    }
  }
}

export const n8nCloudClient = new N8nCloudClient();
