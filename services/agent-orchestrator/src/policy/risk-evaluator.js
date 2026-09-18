import { knowledgeEngine } from '@actionmate/knowledge-service';

export class RiskEvaluator {
  evaluateRisk(actionType, parameters) {
    if (actionType === 'RE_ENGAGEMENT_CAMPAIGN') {
      const policyCheck = knowledgeEngine.validateActionAgainstPolicies(parameters);
      return {
        riskLevel: policyCheck.isValid ? 'MEDIUM' : 'HIGH',
        requiresApproval: true,
        reason: 'Outbound communication to 47 customers offering promotional discount.',
        policyCheck
      };
    }

    if (actionType === 'INVENTORY_REORDER' || actionType === 'FINANCIAL_PAYOUT') {
      return {
        riskLevel: 'HIGH',
        requiresApproval: true,
        reason: 'Direct financial expenditure from merchant account.',
        policyCheck: { isValid: true, violations: [] }
      };
    }

    return {
      riskLevel: 'LOW',
      requiresApproval: false,
      reason: 'Internal analytical query.',
      policyCheck: { isValid: true, violations: [] }
    };
  }
}

export const riskEvaluator = new RiskEvaluator();
