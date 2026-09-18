import { z } from 'zod';

export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  location: z.string(),
  preferredLanguage: z.enum(['hinglish', 'hindi', 'english']).default('hinglish'),
  soundboxDeviceId: z.string().optional(),
  createdAt: z.string().datetime().optional()
});

export const TransactionSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  customerId: z.string(),
  amount: z.number().positive(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']).default('SUCCESS'),
  paymentMode: z.enum(['PAYTM_QR', 'UPI', 'CARD', 'WALLET']).default('PAYTM_QR'),
  timestamp: z.string(),
  items: z.array(z.string()).optional()
});

export const CustomerSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  displayName: z.string(),
  phoneMasked: z.string(),
  lastPurchaseAt: z.string(),
  totalTransactions: z.number().int(),
  totalSpend: z.number(),
  segment: z.enum(['ACTIVE_REGULAR', 'INACTIVE_REGULAR', 'OCCASIONAL', 'NEW']),
  preferredItems: z.array(z.string()).default([])
});

export const StorePolicySchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  ruleKey: z.string(),
  title: z.string(),
  description: z.string(),
  constraintType: z.enum(['MAX_DISCOUNT_PERCENT', 'MIN_ORDER_VALUE', 'PEAK_HOURS', 'APPROVAL_THRESHOLD']),
  value: z.any(),
  isActive: z.boolean().default(true)
});

export const BalanceSheetSchema = z.object({
  merchantId: z.string(),
  date: z.string(),
  dailyCollections: z.number(),
  settledAmount: z.number(),
  pendingSettlement: z.number(),
  upiTransactionsCount: z.number(),
  workingCapitalAdvanceBalance: z.number(),
  cashFlowHealth: z.enum(['HEALTHY', 'MONITOR', 'CRITICAL'])
});

export const MachineTelemetrySchema = z.object({
  soundboxId: z.string(),
  merchantId: z.string(),
  status: z.enum(['ONLINE', 'OFFLINE', 'LOW_BATTERY']),
  batteryLevel: z.number().min(0).max(100),
  firmwareVersion: z.string(),
  lastChimeAt: z.string(),
  networkSignal: z.enum(['EXCELLENT', 'GOOD', 'POOR'])
});

export const ActionDraftSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  title: z.string(),
  actionType: z.enum(['RE_ENGAGEMENT_CAMPAIGN', 'FLASH_DISCOUNT', 'INVENTORY_REORDER', 'PAYMENT_ALERT']),
  targetSegment: z.string(),
  audienceSize: z.number().int(),
  offerText: z.string(),
  discountPercent: z.number().min(0).max(100),
  validityDays: z.number().int().default(5),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  requiresApproval: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXECUTED']).default('DRAFT'),
  createdAt: z.string()
});

export const AuditEventSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  actor: z.enum(['MERCHANT', 'ACTIONMATE_AGENT', 'SYSTEM', 'PAYTM_SOUNDBOX']),
  actionType: z.string(),
  details: z.string(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string()
});
