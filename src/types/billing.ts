// ──────────────────────────────────────────────────────────────
//  Garments Cut-to-Sew & Billing Module — TypeScript Types v2
//  Dynamic useFieldArray architecture
// ──────────────────────────────────────────────────────────────

// ─── Single Part / Task Row ─────────────────────────────────
export interface PartTask {
  partName: string;
  targetQty: number;
  submittedQty: number;
  regularRate: number;
  penaltyRate: number;
  surplusRate: number;
}

// ─── Per-row computed result ─────────────────────────────────
export type PartCondition = "equal" | "shortage" | "surplus";

export interface PartTaskResult extends PartTask {
  condition: PartCondition;
  shortageQty: number;
  surplusQty: number;
  rowEarnings: number;   // gross pay for this row
  rowPenalty: number;    // penalty deducted for this row
  rowNetTotal: number;   // rowEarnings - rowPenalty
}

// ─── Allowances ─────────────────────────────────────────────
export interface AllowanceFields {
  breakfastBill: number;
  sample: number;
  sargitNasta: number;
}

// ─── Deductions ──────────────────────────────────────────────
export interface DeductionFields {
  weeklyPayment: number;
  advanceDeduction: number;
  outstandingDues: number;
  others: number;
}

// ─── Full Form Shape ─────────────────────────────────────────
export interface FormValues {
  // Operator Info
  operatorName: string;
  operatorId: string;
  batchId: string;
  orderDate: string;
  garmentType: string;

  // Dynamic part tasks (useFieldArray)
  partTasks: PartTask[];

  // Global Allowances
  allowances: AllowanceFields;

  // Global Deductions
  deductions: DeductionFields;
}

// ─── Aggregate Billing Result ────────────────────────────────
export interface BillingResult {
  // Per-row breakdown
  partResults: PartTaskResult[];

  // Aggregates
  totalEarnings: number;   // sum of all rowEarnings
  totalPenalty: number;    // sum of all rowPenalties
  subTotal: number;        // totalEarnings - totalPenalty

  // Allowances & Deductions
  totalAllowances: number;
  totalDeductions: number;
  allowanceBreakdown: AllowanceFields;
  deductionBreakdown: DeductionFields;

  // Final
  finalPayable: number;    // subTotal + totalAllowances - totalDeductions
}

// ─── Default / Empty Part Task ───────────────────────────────
export const EMPTY_PART_TASK: PartTask = {
  partName: "",
  targetQty: 0,
  submittedQty: 0,
  regularRate: 0,
  penaltyRate: 0,
  surplusRate: 0,
};
