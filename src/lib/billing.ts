// ──────────────────────────────────────────────────────────────
//  Pure Billing Calculation Engine v2
//  Per-row Condition A/B/C + global aggregation
// ──────────────────────────────────────────────────────────────

import type {
  FormValues,
  PartTask,
  PartTaskResult,
  PartCondition,
  BillingResult,
} from "@/types/billing";

// ─── Per-row Calculation ──────────────────────────────────────
export function computePartTask(task: PartTask): PartTaskResult {
  const targetQty    = Number(task.targetQty)    || 0;
  const submittedQty = Number(task.submittedQty) || 0;
  const regularRate  = Number(task.regularRate)  || 0;
  const penaltyRate  = Number(task.penaltyRate)  || 0;
  const surplusRate  = Number(task.surplusRate)  || 0;

  let condition: PartCondition;
  let shortageQty    = 0;
  let surplusQty     = 0;
  let rowEarnings    = 0;
  let rowPenalty     = 0;

  if (submittedQty === targetQty) {
    // ── Condition A: Equal ────────────────────────────────────
    condition   = "equal";
    rowEarnings = submittedQty * regularRate;
    rowPenalty  = 0;
  } else if (submittedQty < targetQty) {
    // ── Condition B: Shortage / Penalty ──────────────────────
    condition   = "shortage";
    shortageQty = targetQty - submittedQty;
    rowEarnings = submittedQty * regularRate;
    rowPenalty  = shortageQty * penaltyRate;
  } else {
    // ── Condition C: Surplus / Bonus ─────────────────────────
    condition      = "surplus";
    surplusQty     = submittedQty - targetQty;
    rowEarnings    = (targetQty * regularRate) + (surplusQty * surplusRate);
    rowPenalty     = 0;
  }

  const rowNetTotal = rowEarnings - rowPenalty;

  return {
    ...task,
    targetQty,
    submittedQty,
    regularRate,
    penaltyRate,
    surplusRate,
    condition,
    shortageQty,
    surplusQty,
    rowEarnings,
    rowPenalty,
    rowNetTotal,
  };
}

// ─── Global Aggregation ────────────────────────────────────────
export function computeBilling(values: Partial<FormValues>): BillingResult {
  const tasks = values.partTasks ?? [];

  // Compute each row
  const partResults: PartTaskResult[] = tasks.map((t) => computePartTask(t));

  // Aggregate
  const totalEarnings = partResults.reduce((sum, r) => sum + r.rowEarnings, 0);
  const totalPenalty  = partResults.reduce((sum, r) => sum + r.rowPenalty,  0);
  const subTotal      = totalEarnings - totalPenalty;

  // Allowances
  const allowanceBreakdown = {
    breakfastBill: Number(values.allowances?.breakfastBill) || 0,
    sample:        Number(values.allowances?.sample)        || 0,
    sargitNasta:   Number(values.allowances?.sargitNasta)   || 0,
  };
  const totalAllowances = Object.values(allowanceBreakdown).reduce((a, b) => a + b, 0);

  // Deductions
  const deductionBreakdown = {
    weeklyPayment:    Number(values.deductions?.weeklyPayment)    || 0,
    advanceDeduction: Number(values.deductions?.advanceDeduction) || 0,
    outstandingDues:  Number(values.deductions?.outstandingDues)  || 0,
    others:           Number(values.deductions?.others)           || 0,
  };
  const totalDeductions = Object.values(deductionBreakdown).reduce((a, b) => a + b, 0);

  const finalPayable = subTotal + totalAllowances - totalDeductions;

  return {
    partResults,
    totalEarnings,
    totalPenalty,
    subTotal,
    totalAllowances,
    totalDeductions,
    allowanceBreakdown,
    deductionBreakdown,
    finalPayable,
  };
}

// ─── Formatting Helpers ────────────────────────────────────────
// Uses "Tk" prefix (plain string) — safe for text nodes, aria labels etc.
// For JSX with proper ৳ glyph, use the <Tk /> component in InvoicePanel.
export function formatBDT(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `−Tk${formatted}` : `Tk${formatted}`;
}

export function formatNum(value: number): string {
  return Math.abs(value).toLocaleString("en-BD");
}

export const CONDITION_META: Record<
  "equal" | "shortage" | "surplus",
  { label: string; badge: string; icon: string; chip: string; dot: string }
> = {
  equal: {
    label: "Regular",
    badge: "A",
    icon: "✓",
    chip: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 ring-emerald-500/20",
    dot:  "bg-emerald-400",
  },
  shortage: {
    label: "Shortage",
    badge: "B",
    icon: "↓",
    chip: "bg-amber-500/15 text-amber-400 border-amber-500/25 ring-amber-500/20",
    dot:  "bg-amber-400",
  },
  surplus: {
    label: "Surplus",
    badge: "C",
    icon: "↑",
    chip: "bg-violet-500/15 text-violet-400 border-violet-500/25 ring-violet-500/20",
    dot:  "bg-violet-400",
  },
};
