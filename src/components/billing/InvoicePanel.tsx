"use client";

import React from "react";
import { BillingResult } from "@/types/billing";
import { CONDITION_META } from "@/lib/billing";

interface Props {
  result: BillingResult;
  operatorName: string;
  operatorId: string;
  batchId: string;
  garmentType: string;
  orderDate: string;
}

// ─── Currency display — ৳ via system font for correct glyph ──
function Tk({ amount, cls = "" }: { amount: number; cls?: string }) {
  const abs = Math.abs(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <span className={`font-mono tabular-nums ${cls}`}>
      <span style={{ fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>৳</span>
      {abs}
    </span>
  );
}

// ─── Invoice line row ─────────────────────────────────────────
function InvRow({
  label,
  amount,
  dim,
  bold,
  positive,
  negative,
  small,
  prefix,
  showIf = true,
}: {
  label: string;
  amount?: number;
  dim?: boolean;
  bold?: boolean;
  positive?: boolean;
  negative?: boolean;
  small?: boolean;
  prefix?: string;
  showIf?: boolean;
}) {
  if (!showIf || amount === undefined) return null;

  return (
    <div className={`flex items-center justify-between gap-3 ${small ? "py-0.5" : "py-1.5"}`}>
      <span className={`leading-tight ${small ? "text-xs" : "text-sm"} ${
        dim    ? "text-slate-400 dark:text-slate-600"
        : bold ? "font-semibold text-slate-800 dark:text-slate-200"
        :        "text-slate-600 dark:text-slate-400"
      }`}>
        {prefix && <span className="mr-1 font-mono text-slate-400 dark:text-slate-600">{prefix}</span>}
        {label}
      </span>
      <Tk
        amount={amount}
        cls={
          negative && amount > 0 ? "text-red-500 dark:text-red-400"
          : positive && amount > 0 ? "text-emerald-600 dark:text-emerald-400"
          : bold ? "font-bold text-slate-900 dark:text-slate-100"
          : "text-slate-700 dark:text-slate-300"
        }
      />
    </div>
  );
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
      </div>
      {label && (
        <div className="relative flex justify-start">
          <span className="pr-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600
            bg-white dark:bg-slate-800/60">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function InvoicePanel({
  result,
  operatorName,
  operatorId,
  batchId,
  garmentType,
  orderDate,
}: Props) {
  const {
    partResults,
    totalEarnings,
    totalPenalty,
    subTotal,
    totalAllowances,
    totalDeductions,
    allowanceBreakdown,
    deductionBreakdown,
    finalPayable,
  } = result;

  const formattedDate = orderDate
    ? new Date(orderDate + "T00:00:00").toLocaleDateString("en-GB", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—";

  const hasShortage = partResults.some((r) => r.condition === "shortage");
  const hasSurplus  = partResults.some((r) => r.condition === "surplus");

  const barClass =
    hasShortage && hasSurplus ? "bg-gradient-to-r from-amber-400 via-violet-400 to-indigo-400"
    : hasShortage             ? "bg-gradient-to-r from-amber-500 via-orange-400 to-red-400"
    : hasSurplus              ? "bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-400"
    :                           "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400";

  const shortageCount = partResults.filter(r => r.condition === "shortage").length;

  return (
    <div className="sticky top-[72px] flex flex-col gap-4">

      {/* ── PAYSLIP CARD ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border shadow-xl transition-all
        border-slate-200 bg-white shadow-slate-200/60
        dark:border-slate-700/60 dark:bg-gradient-to-br dark:from-slate-800/90 dark:via-slate-900/90 dark:to-slate-950/90 dark:shadow-black/30">
        <div className={`h-1 w-full ${barClass}`} />

        <div className="p-5">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border
                  border-indigo-200 bg-indigo-50
                  dark:border-indigo-500/30 dark:bg-indigo-500/20">
                  <svg className="h-3 w-3 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  Production Payslip
                </span>
              </div>
              <h3 className="truncate text-lg font-black text-slate-900 dark:text-slate-100">
                {operatorName || "Operator Name"}
              </h3>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                ID: {operatorId || "—"} · {garmentType || "Garment"} · Batch {batchId || "—"}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-slate-400">{formattedDate}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                {partResults.length} Part{partResults.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* ── Parts table ────────────────────────────────────── */}
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/50">
            {/* Column headers */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/70">
              <div className="grid text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
                style={{ gridTemplateColumns: "minmax(0,2fr) 44px 44px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)" }}>
                <span>Part</span>
                <span className="text-right">Tgt</span>
                <span className="text-right">Sub</span>
                <span className="text-right">Earnings</span>
                <span className="text-right">Penalty</span>
                <span className="text-right">Net</span>
              </div>
            </div>

            {partResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-600">
                No part tasks added yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {partResults.map((row, i) => {
                  const meta = CONDITION_META[row.condition];
                  return (
                    <div key={i} className="px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <div className="grid items-center"
                        style={{ gridTemplateColumns: "minmax(0,2fr) 44px 44px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)" }}>
                        <span className="truncate pr-1 text-xs font-semibold text-slate-800 dark:text-slate-200" title={row.partName}>
                          {row.partName || <span className="italic text-slate-400 dark:text-slate-600">Unnamed</span>}
                        </span>
                        <span className="text-right text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                          {row.targetQty}
                        </span>
                        <span className="text-right text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {row.submittedQty}
                        </span>
                        <span className="text-right text-xs font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                          <Tk amount={row.rowEarnings} />
                        </span>
                        <span className={`text-right text-xs font-mono tabular-nums ${
                          row.rowPenalty > 0 ? "text-red-500 dark:text-red-400" : "text-slate-300 dark:text-slate-700"
                        }`}>
                          {row.rowPenalty > 0 ? <><span className="mr-0.5">−</span><Tk amount={row.rowPenalty} /></> : "—"}
                        </span>
                        <span className={`text-right text-xs font-bold font-mono tabular-nums ${
                          row.rowNetTotal >= 0 ? "text-slate-900 dark:text-slate-100" : "text-red-500 dark:text-red-400"
                        }`}>
                          <Tk amount={row.rowNetTotal} />
                        </span>
                      </div>
                      {/* Condition badge */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${meta.chip}`}>
                          <span className={`h-1 w-1 rounded-full ${meta.dot}`} />
                          {meta.badge}·{meta.label}
                          {row.condition === "shortage" && ` (−${row.shortageQty})`}
                          {row.condition === "surplus"  && ` (+${row.surplusQty})`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Totals footer */}
            {partResults.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700/60 dark:bg-slate-800/60">
                <div className="grid items-center"
                  style={{ gridTemplateColumns: "minmax(0,2fr) 44px 44px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)" }}>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Totals</span>
                  <span /><span />
                  <span className="text-right text-xs font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-300">
                    <Tk amount={totalEarnings} />
                  </span>
                  <span className={`text-right text-xs font-bold font-mono tabular-nums ${
                    totalPenalty > 0 ? "text-red-500 dark:text-red-300" : "text-slate-300 dark:text-slate-700"
                  }`}>
                    {totalPenalty > 0 ? <><span className="mr-0.5">−</span><Tk amount={totalPenalty} /></> : "—"}
                  </span>
                  <span className={`text-right text-xs font-bold font-mono tabular-nums ${
                    subTotal >= 0 ? "text-slate-900 dark:text-white" : "text-red-500 dark:text-red-300"
                  }`}>
                    <Tk amount={subTotal} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Breakdown lines ─────────────────────────────── */}
          <Divider label="Bill Breakdown" />
          <InvRow label="Total Earnings" amount={totalEarnings} positive />
          <InvRow
            label={`Total Penalty${shortageCount > 0 ? ` (${shortageCount} row${shortageCount > 1 ? "s" : ""})` : ""}`}
            amount={totalPenalty}
            negative={totalPenalty > 0}
            dim={totalPenalty === 0}
          />

          {/* Sub total box */}
          <div className="my-2 flex items-center justify-between rounded-lg border px-3 py-2.5
            border-slate-200 bg-slate-50
            dark:border-slate-700/40 dark:bg-slate-800/50">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Sub Total</span>
            <Tk amount={subTotal} cls={`text-sm font-bold ${subTotal >= 0 ? "text-slate-900 dark:text-slate-100" : "text-red-500 dark:text-red-400"}`} />
          </div>

          <Divider label="Allowances (+)" />
          <InvRow small label="Breakfast Bill"   amount={allowanceBreakdown.breakfastBill} prefix="+" positive={allowanceBreakdown.breakfastBill > 0}   dim={allowanceBreakdown.breakfastBill === 0} />
          <InvRow small label="Sample"           amount={allowanceBreakdown.sample}        prefix="+" positive={allowanceBreakdown.sample > 0}           dim={allowanceBreakdown.sample === 0} />
          <InvRow small label="Sargit Nasta"     amount={allowanceBreakdown.sargitNasta}   prefix="+" positive={allowanceBreakdown.sargitNasta > 0}      dim={allowanceBreakdown.sargitNasta === 0} />
          <InvRow bold  label="Total Allowances" amount={totalAllowances} positive={totalAllowances > 0} />

          <Divider label="Deductions (−)" />
          <InvRow small label="Weekly Payment"    amount={deductionBreakdown.weeklyPayment}    prefix="−" negative={deductionBreakdown.weeklyPayment > 0}    dim={deductionBreakdown.weeklyPayment === 0} />
          <InvRow small label="Advance Deduction" amount={deductionBreakdown.advanceDeduction} prefix="−" negative={deductionBreakdown.advanceDeduction > 0} dim={deductionBreakdown.advanceDeduction === 0} />
          <InvRow small label="Outstanding Dues"  amount={deductionBreakdown.outstandingDues}  prefix="−" negative={deductionBreakdown.outstandingDues > 0}  dim={deductionBreakdown.outstandingDues === 0} />
          <InvRow small label="Others"            amount={deductionBreakdown.others}            prefix="−" negative={deductionBreakdown.others > 0}            dim={deductionBreakdown.others === 0} />
          <InvRow bold  label="Total Deductions"  amount={totalDeductions} negative={totalDeductions > 0} />
        </div>
      </div>

      {/* ── FINAL PAYABLE ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl border shadow-xl transition-all ${
        finalPayable >= 0
          ? "border-indigo-200 shadow-indigo-200/40 dark:border-indigo-500/40 dark:shadow-indigo-500/10"
          : "border-red-200 shadow-red-200/40 dark:border-red-500/40 dark:shadow-red-500/10"
      }`}>
        {/* Light mode: solid gradient; Dark mode: dark gradient */}
        <div className={`absolute inset-0 ${
          finalPayable >= 0
            ? "bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-indigo-950/90 dark:via-slate-900/95 dark:to-slate-950"
            : "bg-gradient-to-br from-red-50 via-white to-slate-50 dark:from-red-950/90 dark:via-slate-900/95 dark:to-slate-950"
        }`} />
        {/* Glow blob */}
        <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-20 ${
          finalPayable >= 0 ? "bg-indigo-400" : "bg-red-400"
        }`} />

        <div className="relative p-5">
          <p className={`mb-0.5 text-[10px] font-bold uppercase tracking-widest ${
            finalPayable >= 0 ? "text-indigo-500 dark:text-indigo-400" : "text-red-500 dark:text-red-400"
          }`}>
            Final Payable — Debts &amp; Dues
          </p>
          <p className="mb-4 text-xs text-slate-500">Net settlement after all calculations</p>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-4xl font-black font-mono tabular-nums tracking-tight leading-none ${
                finalPayable >= 0
                  ? "text-slate-900 dark:text-white"
                  : "text-red-600 dark:text-red-300"
              }`}>
                {finalPayable < 0 && <span className="mr-0.5">−</span>}
                <span style={{ fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>৳</span>
                {Math.abs(finalPayable).toLocaleString("en-BD", {
                  minimumFractionDigits: 2, maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-[10px] font-mono text-slate-400 dark:text-slate-600 leading-relaxed">
                <span style={{ fontFamily: "system-ui,'Segoe UI',Arial,sans-serif" }}>৳</span>{Math.abs(subTotal).toFixed(2)} subtotal
                {totalAllowances > 0 && <> + <span style={{ fontFamily: "system-ui,'Segoe UI',Arial,sans-serif" }}>৳</span>{totalAllowances.toFixed(2)} allow.</>}
                {totalDeductions > 0 && <> − <span style={{ fontFamily: "system-ui,'Segoe UI',Arial,sans-serif" }}>৳</span>{totalDeductions.toFixed(2)} deduct.</>}
              </p>
            </div>
            <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl border ${
              finalPayable >= 0
                ? "border-indigo-200 bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/15"
                : "border-red-200 bg-red-100 dark:border-red-500/30 dark:bg-red-500/15"
            }`}>
              {finalPayable >= 0 ? (
                <svg className={`h-7 w-7 text-indigo-500 dark:text-indigo-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="h-7 w-7 text-red-500 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 dark:text-slate-700">
        Updates instantly as you type · Ctrl+P to print
      </p>
    </div>
  );
}
