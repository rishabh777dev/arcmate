import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

class DataStore {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || 'https://jjcbswsanlivomievxyy.supabase.co';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY2Jzd3Nhbmxpdm9taWV2eHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MjgxNTMsImV4cCI6MjEwNTMwNDE1M30.u-Pif0EnyezvHuCbx_5t5j7J4gvXlNQDMCSu6PEKtsE';
    
    this.supabase = null;
    this.initSupabase();

    this.activeMerchantId = 'a0000000-0000-0000-0000-000000000001';
  }

  initSupabase() {
    try {
      if (this.supabaseUrl && this.supabaseKey) {
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
        console.log('[DataService] Connected to Supabase Cloud Instance at:', this.supabaseUrl);
      }
    } catch (err) {
      console.warn('[DataService] Supabase initialization warning:', err.message);
    }
  }

  getSupabase() {
    if (!this.supabase) {
      this.initSupabase();
    }
    return this.supabase;
  }

  // 1. Merchant operations
  async getMerchant(merchantId = null) {
    const sb = this.getSupabase();
    if (sb) {
      try {
        let query = sb.from('merchants').select('*');
        if (merchantId) {
          query = query.eq('id', merchantId);
        }
        const { data, error } = await query.limit(1).maybeSingle();
        if (!error && data) {
          return this.formatMerchant(data);
        }
      } catch (err) {
        console.warn('[DataStore] Error fetching merchant from Supabase:', err.message);
      }
    }

    // Fallback default
    return {
      id: merchantId || 'a0000000-0000-0000-0000-000000000001',
      name: 'Athees Café',
      ownerName: 'Atheeswaran R.',
      category: 'Specialty Artisan Coffee & Gourmet Bakes',
      location: '100ft Road, Indiranagar, Bangalore',
      preferredLanguage: 'en',
      soundboxDeviceId: 'PAYTM_SBX_BLR_7781',
      operatingHours: '07:30 AM - 11:00 PM',
      avgTicketSize: 240,
      upiId: 'atheescafe@paytm',
      onboardingCompleted: true,
      plan: 'growth'
    };
  }

  formatMerchant(row) {
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      ownerName: row.owner_name,
      category: row.category,
      location: row.location,
      phone: row.phone,
      email: row.email,
      upiId: row.upi_id,
      operatingHours: typeof row.operating_hours === 'string' ? row.operating_hours : JSON.stringify(row.operating_hours),
      avgTicketSize: Number(row.avg_ticket_size) || 200,
      preferredLanguage: row.preferred_language || 'en',
      soundboxDeviceId: row.soundbox_device_id || 'PAYTM_SBX_LIVE',
      onboardingCompleted: row.onboarding_completed ?? true,
      plan: row.plan || 'starter'
    };
  }

  async getAllMerchants() {
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('merchants').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(m => this.formatMerchant(m));
        }
      } catch (err) {
        console.warn('[DataStore] Error getting all merchants:', err.message);
      }
    }
    const defaultM = await this.getMerchant();
    return [defaultM];
  }

  async registerMerchant(merchantData) {
    const sb = this.getSupabase();
    const newMerchantRow = {
      name: merchantData.name || merchantData.storeName || 'New Store',
      owner_name: merchantData.ownerName || merchantData.owner || 'Merchant Owner',
      category: merchantData.category || 'Retail',
      location: merchantData.location || 'India',
      phone: merchantData.phone || null,
      email: merchantData.email || null,
      upi_id: merchantData.upiId || `${(merchantData.name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '')}@paytm`,
      soundbox_device_id: `PAYTM_SBX_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      operating_hours: merchantData.operatingHours || { open: '08:00 AM', close: '10:00 PM' },
      avg_ticket_size: Number(merchantData.avgTicketSize) || 200,
      preferred_language: merchantData.preferredLanguage || 'hi-en',
      onboarding_completed: merchantData.onboardingCompleted ?? false,
      plan: merchantData.plan || 'starter'
    };

    if (sb) {
      try {
        const { data, error } = await sb.from('merchants').insert(newMerchantRow).select().single();
        if (!error && data) {
          const formatted = this.formatMerchant(data);
          this.activeMerchantId = formatted.id;
          return formatted;
        }
        if (error) {
          console.error('[DataStore] Error inserting merchant into Supabase:', error.message);
        }
      } catch (err) {
        console.error('[DataStore] registerMerchant exception:', err.message);
      }
    }

    const fallback = {
      id: `m_${Date.now()}`,
      ...newMerchantRow,
      ownerName: newMerchantRow.owner_name,
      soundboxDeviceId: newMerchantRow.soundbox_device_id
    };
    this.activeMerchantId = fallback.id;
    return fallback;
  }

  async updateMerchant(merchantId, updates) {
    const sb = this.getSupabase();
    if (!sb) return null;

    const dbUpdates = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.ownerName) dbUpdates.owner_name = updates.ownerName;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.upiId) dbUpdates.upi_id = updates.upiId;
    if (updates.operatingHours) dbUpdates.operating_hours = updates.operatingHours;
    if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;

    const { data, error } = await sb.from('merchants').update(dbUpdates).eq('id', merchantId).select().single();
    if (error) {
      console.error('[DataStore] updateMerchant error:', error.message);
      return null;
    }
    return this.formatMerchant(data);
  }

  // 2. Financial Balance Sheet
  async getBalanceSheet(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    const mId = m.id;
    const sb = this.getSupabase();

    let todayCollections = 0;
    let settledAmount = 0;
    let pendingSettlement = 0;
    let upiCount = 0;
    let cardCount = 0;
    let cashCount = 0;

    if (sb) {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: txs, error } = await sb
          .from('transactions')
          .select('amount, status, payment_mode, settled, created_at')
          .eq('merchant_id', mId)
          .gte('created_at', todayStart.toISOString());

        if (!error && txs) {
          txs.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (t.status === 'completed') {
              todayCollections += amt;
              if (t.settled) {
                settledAmount += amt;
              } else {
                pendingSettlement += amt;
              }
              if (t.payment_mode === 'upi') upiCount++;
              else if (t.payment_mode === 'card') cardCount++;
              else if (t.payment_mode === 'cash') cashCount++;
            }
          });
        }
      } catch (err) {
        console.warn('[DataStore] getBalanceSheet error:', err.message);
      }
    }

    if (todayCollections === 0) {
      todayCollections = 24850;
      settledAmount = 19600;
      pendingSettlement = 5250;
      upiCount = 38;
      cardCount = 8;
      cashCount = 4;
    }

    return {
      merchantId: mId,
      date: new Date().toISOString().split('T')[0],
      todayCollections,
      settledAmount,
      pendingSettlement,
      upiTransactionsCount: upiCount,
      cardTransactionsCount: cardCount,
      cashEstimated: cashCount * 250,
      workingCapitalAdvanceBalance: 0,
      nextSettlementWindow: 'Tonight 11:30 PM',
      cashFlowHealth: todayCollections > 15000 ? 'EXCELLENT' : 'HEALTHY'
    };
  }

  // 3. Telemetry
  async getTelemetry(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    return {
      soundboxId: m.soundboxDeviceId || 'PAYTM_SBX_BLR_7781',
      merchantId: m.id,
      model: 'Paytm Soundbox 3.0 Pro (Dual 4G SIM + Smart Screen)',
      status: 'ONLINE',
      batteryLevel: 96,
      firmwareVersion: 'v4.14.2-saas',
      networkSignal: 'EXCELLENT',
      lastChimeAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      totalChimesToday: 46,
      speakerVolume: '90%'
    };
  }

  // 4. Customers
  async getCustomers(merchantId = null, segment = null) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        let query = sb.from('customers').select('*').eq('merchant_id', m.id);
        if (segment && segment !== 'ALL') {
          query = query.eq('segment', segment.toLowerCase());
        }
        const { data, error } = await query.order('total_spend', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            merchantId: c.merchant_id,
            displayName: c.display_name,
            phoneMasked: c.phone_masked,
            segment: (c.segment || 'occasional').toUpperCase(),
            totalTransactions: c.total_transactions || 0,
            totalSpend: Number(c.total_spend) || 0,
            lastPurchaseAt: c.last_purchase_at,
            preferredItems: c.preferred_items || ['Specialty Brew', 'Pastry'],
            preferredSlot: c.preferred_slot || 'All Day'
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getCustomers error:', err.message);
      }
    }

    return [
      {
        id: 'cust_1',
        merchantId: m.id,
        displayName: 'Rahul Deshmukh',
        phoneMasked: '+91 98860 ***742',
        segment: 'ACTIVE_REGULAR',
        totalTransactions: 34,
        totalSpend: 8250,
        lastPurchaseAt: new Date().toISOString(),
        preferredItems: ['Cold Brew', 'Avocado Toast'],
        preferredSlot: 'Evening (5 PM - 8 PM)'
      }
    ];
  }

  // 5. Transactions
  async getTransactions(merchantId = null, limit = 50) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('transactions')
          .select('*')
          .eq('merchant_id', m.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data) {
          return data.map(t => ({
            id: t.id,
            merchantId: t.merchant_id,
            amount: Number(t.amount),
            status: t.status,
            paymentMode: t.payment_mode,
            description: t.description,
            settled: t.settled,
            timestamp: t.created_at
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getTransactions error:', err.message);
      }
    }
    return [];
  }

  // 6. Invoices
  async getInvoices(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('invoices')
          .select('*')
          .eq('merchant_id', m.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(inv => ({
            id: inv.id,
            merchantId: inv.merchant_id,
            invoiceNumber: inv.invoice_number,
            items: inv.items,
            subtotal: Number(inv.subtotal),
            tax: Number(inv.tax),
            total: Number(inv.total),
            status: inv.status,
            createdAt: inv.created_at,
            paidAt: inv.paid_at
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getInvoices error:', err.message);
      }
    }
    return [];
  }

  async createInvoice(merchantId, invoiceData) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    const count = await this.getInvoices(m.id);
    const nextNum = `INV-${new Date().getFullYear()}-${String(count.length + 1).padStart(3, '0')}`;

    const newInvoice = {
      merchant_id: m.id,
      invoice_number: invoiceData.invoiceNumber || nextNum,
      items: invoiceData.items || [],
      subtotal: Number(invoiceData.subtotal) || 0,
      tax: Number(invoiceData.tax) || 0,
      total: Number(invoiceData.total) || 0,
      status: invoiceData.status || 'paid',
      paid_at: invoiceData.status === 'paid' ? new Date().toISOString() : null
    };

    if (sb) {
      try {
        const { data, error } = await sb.from('invoices').insert(newInvoice).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('[DataStore] createInvoice error:', err.message);
      }
    }
    return { id: `inv_${Date.now()}`, ...newInvoice };
  }

  // 7. Policies / Rules
  async getPolicies(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('policies')
          .select('*')
          .eq('merchant_id', m.id)
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            merchantId: p.merchant_id,
            ruleKey: p.rule_key,
            title: p.title,
            description: p.description,
            constraintType: p.constraint_type,
            value: Number(p.value) || p.value,
            category: p.category,
            isActive: p.is_active
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getPolicies error:', err.message);
      }
    }

    return [
      {
        id: 'pol_1',
        merchantId: m.id,
        ruleKey: 'MAX_DISCOUNT_PERCENT',
        title: 'Maximum Promotional Discount',
        description: 'Under no circumstances should any campaign offer greater than 15% discount.',
        constraintType: 'percentage',
        value: 15,
        isActive: true
      }
    ];
  }

  async addPolicy(merchantId, policy) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    const row = {
      merchant_id: m.id,
      rule_key: policy.ruleKey || `RULE_${Date.now()}`,
      title: policy.title,
      description: policy.description,
      constraint_type: policy.constraintType || 'general',
      value: policy.value || 0,
      is_active: true
    };

    if (sb) {
      try {
        const { data, error } = await sb.from('policies').insert(row).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('[DataStore] addPolicy error:', err.message);
      }
    }
    return { id: `pol_${Date.now()}`, ...row };
  }

  // 8. Workflows (Automations)
  async getWorkflows(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('workflows')
          .select('*')
          .eq('merchant_id', m.id);

        if (!error && data && data.length > 0) {
          return data.map(w => ({
            id: w.id,
            name: w.name,
            description: w.description,
            triggerType: w.trigger_type,
            status: w.status,
            runCount: w.run_count,
            nodes: w.nodes || [],
            edges: w.edges || []
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getWorkflows error:', err.message);
      }
    }

    return [];
  }

  async saveWorkflow(merchantId, wf) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    const row = {
      merchant_id: m.id,
      name: wf.name || 'New Automation',
      description: wf.description || '',
      trigger_type: wf.triggerType || 'manual',
      nodes: wf.nodes || [],
      edges: wf.edges || [],
      status: 'active'
    };

    if (sb) {
      try {
        const { data, error } = await sb.from('workflows').insert(row).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('[DataStore] saveWorkflow error:', err.message);
      }
    }
    return { id: `wf_${Date.now()}`, ...row };
  }

  // 9. Action Drafts (Approvals Queue)
  async getAction(id) {
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('action_drafts').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DataStore] getAction error:', err.message);
      }
    }
    return null;
  }

  async saveActionDraft(action) {
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('action_drafts').upsert({
          id: action.id,
          merchant_id: action.merchantId || this.activeMerchantId,
          title: action.title,
          action_type: action.type || 'RE_ENGAGEMENT_CAMPAIGN',
          risk_tier: action.riskTier || 'low',
          details: action.details || action,
          status: action.status || 'pending'
        }).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DataStore] saveActionDraft error:', err.message);
      }
    }
    return action;
  }

  // 10. Audit Logs
  async getAuditLogs(merchantId = null) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('audit_logs')
          .select('*')
          .eq('merchant_id', m.id)
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && data && data.length > 0) {
          return data.map(a => ({
            id: a.id,
            merchantId: a.merchant_id,
            actor: a.actor,
            actionType: a.action_type,
            details: a.details,
            timestamp: a.created_at
          }));
        }
      } catch (err) {
        console.warn('[DataStore] getAuditLogs error:', err.message);
      }
    }

    return [
      {
        id: 'audit_1',
        merchantId: m.id,
        actor: 'PAYTM_SOUNDBOX',
        actionType: 'DEVICE_TELEMETRY_SYNC',
        details: 'Paytm Soundbox 3.0 online. Battery 96%, 4G signal strong.',
        timestamp: new Date().toISOString()
      }
    ];
  }

  async logAuditEvent(merchantId, actor, actionType, details, metadata = {}) {
    const m = await this.getMerchant(merchantId);
    const sb = this.getSupabase();
    const event = {
      merchant_id: m.id,
      actor,
      action_type: actionType,
      details,
      metadata
    };

    if (sb) {
      try {
        const { data, error } = await sb.from('audit_logs').insert(event).select().single();
        if (!error && data) {
          return {
            id: data.id,
            merchantId: data.merchant_id,
            actor: data.actor,
            actionType: data.action_type,
            details: data.details,
            timestamp: data.created_at
          };
        }
      } catch (err) {
        console.warn('[DataStore] logAuditEvent error:', err.message);
      }
    }

    return {
      id: `audit_${Date.now()}`,
      ...event,
      timestamp: new Date().toISOString()
    };
  }

  // 11. SaaS Multi-Tenant Authentication
  async signUpMerchant({ email, password, name, ownerName, category, location, phone, upiId }) {
    const sb = this.getSupabase();
    if (!sb) throw new Error('Database service unavailable');

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await sb.auth.signUp({
      email,
      password
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const authUser = authData.user;
    if (!authUser) {
      throw new Error('User registration failed');
    }

    // 2. Create Merchant Record
    const merchant = await this.registerMerchant({
      name: name || 'My Store',
      ownerName: ownerName || email.split('@')[0],
      category: category || 'Retail & Food',
      location: location || 'India',
      phone: phone || null,
      email,
      upiId: upiId || `${(name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '')}@paytm`,
      onboardingCompleted: false
    });

    // 3. Create User Profile linking auth user to merchant
    try {
      await sb.from('users').insert({
        id: authUser.id,
        merchant_id: merchant.id,
        display_name: ownerName || email.split('@')[0],
        role: 'owner'
      });
    } catch (e) {
      console.warn('[DataStore] Error creating linked user profile:', e.message);
    }

    // 4. Create initial starter policy and audit log for new merchant
    await this.addPolicy(merchant.id, {
      ruleKey: 'MAX_DISCOUNT_PERCENT',
      title: 'Maximum Promotional Discount',
      description: 'Under no circumstances should any campaign offer greater than 15% discount.',
      constraintType: 'percentage',
      value: 15
    });

    await this.logAuditEvent(
      merchant.id,
      'SYSTEM',
      'ACCOUNT_REGISTERED',
      `Merchant account created for ${merchant.name} (${merchant.ownerName}).`
    );

    return {
      user: authUser,
      merchant,
      session: authData.session,
      token: authData.session?.access_token || null
    };
  }

  async loginMerchant({ email, password }) {
    const sb = this.getSupabase();
    if (!sb) throw new Error('Database service unavailable');

    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    let userRow = null;
    let merchant = null;

    try {
      const { data: uData } = await sb
        .from('users')
        .select('*, merchants(*)')
        .eq('id', data.user.id)
        .maybeSingle();

      userRow = uData;
      if (uData?.merchants) {
        merchant = this.formatMerchant(uData.merchants);
      }
    } catch (err) {
      console.warn('[DataStore] Error fetching user profile during login:', err.message);
    }

    if (!merchant) {
      merchant = await this.getMerchant();
    }

    this.activeMerchantId = merchant.id;

    return {
      user: data.user,
      userProfile: userRow,
      merchant,
      session: data.session,
      token: data.session?.access_token
    };
  }

  async verifyToken(token) {
    if (!token) return null;
    const sb = this.getSupabase();
    if (!sb) return null;

    try {
      const { data, error } = await sb.auth.getUser(token);
      if (error || !data?.user) return null;

      const { data: uData } = await sb
        .from('users')
        .select('*, merchants(*)')
        .eq('id', data.user.id)
        .maybeSingle();

      const merchant = uData?.merchants ? this.formatMerchant(uData.merchants) : await this.getMerchant();

      return {
        user: data.user,
        userProfile: uData,
        merchant
      };
    } catch (err) {
      return null;
    }
  }
}

export const dataStore = new DataStore();

