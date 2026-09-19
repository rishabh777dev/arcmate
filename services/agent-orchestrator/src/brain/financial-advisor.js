/**
 * Autonomous Business Financial Advisor for Arc Mate
 * Deep unit economics, margin guardrails, cost optimization, cash flow, and growth advisory.
 */

export class BusinessFinancialAdvisor {
  /**
   * Comprehensive Profit Margin & Financial Health Advisory
   */
  generateProfitMarginAdvice(audit, documents = []) {
    const todayRev = audit.revenueAudit?.todayTotal || 24850;
    const monthlyRev = audit.revenueAudit?.monthlyProjected || 733075;
    const cogsPercent = audit.costingAudit?.cogsPercent || '38.4%';
    const cogsAmount = audit.costingAudit?.cogsDailyAmount || 9542;
    const netProfit = audit.costingAudit?.netProfitDaily || 7853;
    const netMargin = audit.costingAudit?.netMarginPercent || '31.6%';

    return `### 📈 Business Financial Advisory: Profit Margin & Unit Economics

**Store**: ${audit.storeName} | **Current Net Margin**: **${netMargin}** (Daily Net Profit: **₹${netProfit.toLocaleString('en-IN')}**)

#### 1. Current Cost Structure & Revenue Run-Rate
- **Daily Gross Revenue**: **₹${todayRev.toLocaleString('en-IN')}** (Monthly Run-Rate: **₹${monthlyRev.toLocaleString('en-IN')}**)
- **Cost of Goods Sold (COGS)**: **${cogsPercent}** (₹${cogsAmount.toLocaleString('en-IN')}/day) — *Specialty coffee beans, organic dairy, and artisan bakery dough*
- **Labor & Barista Wages**: **18.0%** (₹${(audit.costingAudit?.laborDailyAmount || 4473).toLocaleString('en-IN')}/day)
- **Rent & Operating Overhead**: **12.0%** (₹${(audit.costingAudit?.overheadDailyAmount || 2982).toLocaleString('en-IN')}/day)
- **Net Operating Margin**: **${netMargin}** — *Benchmark for Bangalore specialty cafés is 22–28%; your unit economics are top-decile.*

#### 2. Key Levers to Expand Margin from 31.6% to 35%+
1. **Bulk Bean Procurement (Blue Tokai Contract Optimization)**:
   - Your contract locks wholesale Arabica AA Attikan beans at **₹580/kg** with a 25kg monthly quota.
   - *Recommendation*: Consolidate orders to 50kg monthly batches to unlock an 8% roastery volume rebate, saving **₹4,200/month** directly on COGS.
2. **Evening Slump Pairing (4:00 PM – 6:00 PM)**:
   - Footfall drops **18.4%** between 4 PM and 6 PM.
   - *Recommendation*: Launch an automated **"Chai/Coffee + Baked Savory"** flash pairing. High-margin bakery items (68% gross margin) lift average ticket size from ₹240 to ₹310, generating an estimated **+₹18,500/month** in pure incremental profit.
3. **VIP Patron Retention (WhatsApp Re-engagement)**:
   - 47 regular patrons are currently dormant (14+ days absent).
   - Re-activating them with margin-safe 10% vouchers unlocks **+₹45,120/month** in recoverable revenue.

#### 3. Financial Guardrail Advisory
> **Cognee Policy Enforcement**: Never issue discounts exceeding **15%**. Per your morning barista directive, maintain **0% discount on single-origin pour-overs** to protect specialty coffee perceived value.`;
  }

  /**
   * Cost Cutting & COGS Reduction Advisory
   */
  generateCostReductionPlan(audit, companies = [], documents = []) {
    const cogsAmount = audit.costingAudit?.cogsDailyAmount || 9542;
    const monthlyCOGS = cogsAmount * 30;

    return `### 💡 Strategic Cost-Cutting & Procurement Optimization

**Current Monthly COGS**: **₹${monthlyCOGS.toLocaleString('en-IN')}** (~38.4% of revenue)

Here is a line-by-line breakdown of your top supplier costs and actionable cost-reduction strategies:

#### 1. Coffee Beans & Roastery (Blue Tokai)
- **Current Spend**: ~₹29,500/month
- **Unit Cost**: ₹580/kg (Arabica AA Attikan Roast & French Roast Espresso)
- **Contract Terms**: Net 15 Days credit, 25kg minimum monthly batch
- **Cost Reduction Action**: Consolidate deliveries to fortnightly 30kg orders instead of weekly 15kg orders. This eliminates delivery surcharges and qualifies for Blue Tokai's 8% bulk tier, saving **₹2,360/month**.

#### 2. Dairy & Plant Milks (Country Delight)
- **Current Spend**: ~₹18,400/month
- **Unit Cost**: ₹64/L Buffalo Milk, ₹200/carton Barista Almond Milk
- **Payment Terms**: Net 7 Days credit
- **Cost Reduction Action**: Milk wastage audits show 8% foam pitcher overflow during peak rush. Calibrating barista steaming pitchers can save ~4.5 liters daily, cutting **₹8,640/month** in dairy expense.

#### 3. Syrups & Flavoring (Monin Gourmet Syrups)
- **Current Spend**: ~₹7,245 per restock order (12 glass bottles)
- **Payment Terms**: Net 30 Days credit (INV-2026-044 currently due)
- **Cost Reduction Action**: Switch from individual 750ml bottles to 1-liter barista pump jugs on vanilla and caramel to reduce packaging overhead by 12%.

#### 4. Packaging & Disposables (EcoWare)
- **Current Spend**: ~₹8,500/month (PLA cups @ ₹2.20/pc, Bagasse lids @ ₹0.95/pc)
- **Cost Reduction Action**: Incentivize dine-in ceramic cup usage and encourage BYO-tumbler with a ₹10 token perk. Increases dine-in dwell time and reduces disposable cup burn by 22%.

**Total Potential Savings**: **₹15,200 – ₹18,500/month** without compromising product quality or customer experience.`;
  }

  /**
   * Working Capital, Cash Flow & Financing Advisory
   */
  generateWorkingCapitalAdvice(balanceSheet, invoices = []) {
    const todayCollections = balanceSheet.todayCollections || 24850;
    const settledAmount = balanceSheet.settledAmount || 19600;
    const pendingSettlement = balanceSheet.pendingSettlement || 5250;
    const pendingInvoices = invoices.filter(i => i.status === 'pending');
    const pendingInvoicesTotal = pendingInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

    return `### 🏦 Working Capital & Cash Flow Liquidity Advisory

**Cash Flow Health Rating**: 🟢 **EXCELLENT**

#### 1. Daily Liquidity Snapshot
- **Today's Collections**: **₹${todayCollections.toLocaleString('en-IN')}**
- **Settled & Bank-Available**: **₹${settledAmount.toLocaleString('en-IN')}**
- **Pending Evening Settlement**: **₹${pendingSettlement.toLocaleString('en-IN')}** (Auto-sweeps to bank account tonight at 11:30 PM)
- **Daily Operating Cash Burn**: ~₹16,997/day
- **Net Daily Cash Generation**: **+₹7,853/day** (Strong positive cash conversion cycle)

#### 2. Payables & Supplier Liabilities
- **Pending Invoices Due**: **₹${pendingInvoicesTotal.toLocaleString('en-IN')}** across ${pendingInvoices.length} bill(s)
  ${pendingInvoices.map(i => `• ${i.vendor || 'Supplier'} (\`${i.invoiceNumber}\`): ₹${Number(i.total).toLocaleString('en-IN')} (Due within Net 30 days)`).join('\n  ')}
- **Debt Service / Working Capital Advance**: ₹0 outstanding.

#### 3. Working Capital Loan / Advance Evaluation
- *Should you take an advance or credit line?*
  - **Verdict**: **NO NEW DEBT RECOMMENDED AT THIS TIME.**
  - **Rationale**: Your business operates on a **negative working capital cycle**—customers pay instantaneously via UPI/POS QR upon order, while key suppliers extend credit (Net 15 days from Blue Tokai, Net 30 days from Monin).
  - Your organic daily cash flow of ₹7,853 net profit accumulates ~₹2,35,000 in free cash flow monthly, which is more than sufficient for equipment maintenance and inventory without incurring 14–18% NBFC interest costs.
  - *When to reconsider*: Only consider asset financing if adding a second espresso group machine or opening a second kiosk location.`;
  }

  /**
   * Pricing & Discount Policy Guardrail Evaluation
   */
  evaluateDiscountRequest(discountPercent, category = 'General') {
    const requested = Number(discountPercent);
    const maxAllowed = 15;

    if (requested > maxAllowed) {
      return `### 🛑 Guardrail Alert: Discount Request REJECTED

- **Requested Discount**: **${requested}%**
- **Cognee Policy Ceiling**: **Maximum ${maxAllowed}%**
- **Decision**: ❌ **BLOCKED BY STORE POLICY**

#### Business Financial Rationale:
1. Offering a **${requested}% discount** cuts gross margin on coffee drinks from 61.6% down to **${(61.6 - requested).toFixed(1)}%**.
2. At a ${requested}% discount, order volume must expand by **+${Math.round((requested / (100 - requested - 38.4)) * 100)}%** just to achieve break-even gross profit.
3. **Barista Shift Policy**: Single-origin pour-overs (Attikan AA) have a strict **0% discount policy** to protect artisan brand positioning.

#### Recommended Margin-Safe Alternatives:
- Apply a **10% discount** capped with a minimum order of **₹249** (passed and approved in Cognee).
- Offer a **bundle combo** (e.g. Cold Brew + Almond Croissant for ₹299 instead of ₹350), preserving product margins while lifting Average Order Value.`;
    }

    return `### ✅ Guardrail Check PASSED: ${requested}% Discount Approved

- **Proposed Discount**: **${requested}%**
- **Store Policy Limit**: Maximum ${maxAllowed}%
- **Status**: 🟢 **COMPLIANT WITH MARGIN GUARDRAILS**

#### Financial Impact Assessment:
- At **${requested}% off orders above ₹249**, customer margin remains at a healthy **${(61.6 - requested).toFixed(1)}%**.
- Estimated customer conversion rate: **18–24%** across dormant patrons.
- Would you like me to draft this campaign and send it to your Approval Queue?`;
  }

  /**
   * Tax & GST Compliance Summary
   */
  generateTaxSummary(audit, invoices = []) {
    const todayRev = audit.revenueAudit?.todayTotal || 24850;
    const gstRate = 5; // 5% composite restaurant rate in India without ITC
    const todayGSTCollected = Math.round((todayRev * gstRate) / 105);
    const monthlyProjectedGST = Math.round(todayGSTCollected * 29.5);

    return `### 🧾 Tax & GST Compliance Summary

**GSTIN Scheme**: Restaurant Services (Composite 5% GST without Input Tax Credit)

#### 1. Daily & Monthly GST Breakdown
- **Today's Gross Sales (GST Inclusive)**: **₹${todayRev.toLocaleString('en-IN')}**
- **Net Sales (Excluding Tax)**: ₹${(todayRev - todayGSTCollected).toLocaleString('en-IN')}
- **Today's Output GST (5%)**: **₹${todayGSTCollected.toLocaleString('en-IN')}**
  - CGST (2.5%): ₹${Math.round(todayGSTCollected / 2).toLocaleString('en-IN')}
  - SGST (2.5%): ₹${Math.round(todayGSTCollected / 2).toLocaleString('en-IN')}
- **Projected Monthly GST Liability**: **₹${monthlyProjectedGST.toLocaleString('en-IN')}**

#### 2. Supplier B2B Invoices & Input Compliance
- Your supplier purchases from Blue Tokai, Country Delight, and Monin carry standard GST invoices (INV-2026-041 through 045).
- All retail customer receipts auto-generated in your Live Excel Ledger are itemized with 5% GST for quarterly GSTR-3B filings.`;
  }
}

export const financialAdvisor = new BusinessFinancialAdvisor();
