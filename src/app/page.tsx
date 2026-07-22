"use client";

import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormValues } from "@/types/billing";
import { computeBilling, formatBDT } from "@/lib/billing";
import PartTasksTable from "@/components/billing/PartTasksTable";
import AllowancesForm from "@/components/billing/AllowancesForm";
import DeductionsForm from "@/components/billing/DeductionsForm";
import InvoicePanel from "@/components/billing/InvoicePanel";
import { ThemeToggle } from "@/components/ThemeToggle";

// ─── Demo Default Values ─────────────────────────────────────
const DEFAULT_VALUES: FormValues = {
  operatorName: "Rahim Uddin",
  operatorId:   "OP-2024-047",
  batchId:      "BATCH-2024-001",
  orderDate:    new Date().toISOString().split("T")[0],
  garmentType:  "Formal Shirt",

  partTasks: [
    {
      partName:     "Collar Stitching",
      targetQty:    200,
      submittedQty: 200,
      regularRate:  3.50,
      penaltyRate:  5.00,
      surplusRate:  4.00,
    },
    {
      partName:     "Sleeve Attachment",
      targetQty:    200,
      submittedQty: 185,
      regularRate:  4.00,
      penaltyRate:  7.00,
      surplusRate:  5.00,
    },
    {
      partName:     "Front Placket",
      targetQty:    200,
      submittedQty: 218,
      regularRate:  2.50,
      penaltyRate:  4.00,
      surplusRate:  3.50,
    },
  ],

  allowances: {
    breakfastBill: 500,
    sample:        250,
    sargitNasta:   150,
  },

  deductions: {
    weeklyPayment:    1000,
    advanceDeduction: 500,
    outstandingDues:  0,
    others:           0,
  },
};

export default function GarmentsBillingPage() {
  const {
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    mode:          "onChange",
  });

  const watchedValues  = useWatch({ control });
  const billingResult  = useMemo(
    () => computeBilling(watchedValues as FormValues),
    [watchedValues]
  );

  const { totalEarnings, totalPenalty, subTotal, finalPayable, partResults } = billingResult;

  const condCounts = partResults.reduce(
    (acc, r) => { acc[r.condition]++; return acc; },
    { equal: 0, shortage: 0, surplus: 0 }
  );

  // ─── Input class reused many times ────────────────────────
  const inputCls = `
    w-full rounded-lg border px-3 py-2.5 text-sm transition-all
    border-slate-200 bg-white text-slate-900 placeholder:text-slate-400
    hover:border-slate-300
    focus:border-sky-500/70 focus:outline-none focus:ring-2 focus:ring-sky-500/30
    dark:border-slate-700/70 dark:bg-slate-800/60 dark:text-slate-100
    dark:placeholder:text-slate-700
    dark:hover:border-slate-600
    dark:focus:border-sky-500/50 dark:focus:ring-sky-500/40
  `;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <header className="
        sticky top-0 z-50 border-b backdrop-blur-xl shadow-sm
        border-slate-200/80 bg-white/80 shadow-slate-200/50
        dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-black/20
      ">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black leading-tight text-slate-900 dark:text-slate-100">
                GarmentERP
              </h1>
              <p className="text-[10px] leading-tight text-slate-400 dark:text-slate-500">
                Cut-to-Sew · Dynamic Billing Module
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="hidden items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 md:flex">
            <span>Production</span>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Operators</span>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">Billing Slip</span>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5
              border-emerald-300/60 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={() => reset(DEFAULT_VALUES)}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all
                border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Demo
            </button>

            {/* 🌙/☀️ Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="mx-auto max-w-[1440px] px-6 py-8">

        {/* Page heading */}
        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-black text-slate-900 dark:text-slate-100">
            Dynamic Production Billing Slip
          </h2>
          <p className="text-sm text-slate-500">
            Assign multiple garment parts per operator. Each row is independently
            calculated with automatic Condition A / B / C detection.
          </p>
        </div>

        {/* ── Stats Strip ─────────────────────────────────── */}
        <div className="mb-7 grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Parts",        value: partResults.length,       unit: "tasks",  color: "text-slate-700 dark:text-slate-200" },
            { label: "Regular (A)",  value: condCounts.equal,         unit: "rows",   color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Shortage (B)", value: condCounts.shortage,      unit: "rows",   color: "text-amber-600 dark:text-amber-400" },
            { label: "Surplus (C)",  value: condCounts.surplus,       unit: "rows",   color: "text-violet-600 dark:text-violet-400" },
            { label: "Sub Total",    value: formatBDT(subTotal),      unit: "",       color: subTotal >= 0 ? "text-slate-700 dark:text-slate-100" : "text-red-500" },
            { label: "Final Payable",value: formatBDT(finalPayable),  unit: "",       color: finalPayable >= 0 ? "text-indigo-600 dark:text-indigo-300" : "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-3.5 transition-all
              border-slate-200 bg-white shadow-sm
              dark:border-slate-700/60 dark:bg-slate-800/50 dark:shadow-none">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                {s.label}
              </p>
              <p className={`text-base font-bold font-mono tabular-nums leading-tight ${s.color}`}>
                {s.value}
              </p>
              {s.unit && (
                <p className="text-[10px] text-slate-400 dark:text-slate-600">{s.unit}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Two Panel Layout ───────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_460px]">

          {/* LEFT: Input Form */}
          <div className="flex flex-col gap-5">

            {/* ── Operator Info ──────────────────────────── */}
            <section className="rounded-xl border p-5 transition-all
              border-slate-200 bg-white shadow-sm
              dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border
                  border-sky-200 bg-sky-50
                  dark:border-sky-500/30 dark:bg-sky-500/20">
                  <svg className="h-4 w-4 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Operator Information
                  </h2>
                  <p className="text-xs text-slate-500">Sewing operator &amp; batch details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Operator Name
                  </label>
                  <input type="text" placeholder="e.g. Rahim Uddin" className={inputCls}
                    {...register("operatorName", { required: "Required" })} />
                  {errors.operatorName && (
                    <p className="mt-0.5 text-[10px] text-red-500">{errors.operatorName.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Operator ID
                  </label>
                  <input type="text" placeholder="OP-XXXX" className={inputCls}
                    {...register("operatorId")} />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Garment Type
                  </label>
                  <input type="text" placeholder="e.g. Formal Shirt" className={inputCls}
                    {...register("garmentType")} />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Batch ID
                  </label>
                  <input type="text" placeholder="BATCH-XXXX" className={inputCls}
                    {...register("batchId")} />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Order Date
                  </label>
                  <input type="date" className={inputCls} {...register("orderDate")} />
                </div>
              </div>
            </section>

            {/* ── Part Tasks ─────────────────────────────── */}
            <PartTasksTable control={control} register={register} errors={errors} />

            {/* ── Allowances & Deductions ────────────────── */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AllowancesForm register={register} errors={errors} />
              <DeductionsForm register={register} errors={errors} />
            </div>

            {/* ── Formula Reference ──────────────────────── */}
            <div className="rounded-xl border p-4 transition-all
              border-slate-200 bg-white shadow-sm
              dark:border-slate-700/40 dark:bg-slate-800/30 dark:shadow-none">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                📐 Per-Row Billing Formula Reference
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-lg border p-3
                  border-emerald-200 bg-emerald-50
                  dark:border-emerald-500/15 dark:bg-emerald-500/5">
                  <p className="mb-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    A — Equal (Submit = Target)
                  </p>
                  <p className="text-[10px] font-mono leading-relaxed text-slate-500 dark:text-slate-600">
                    Earnings = Submitted × Regular Rate<br />Penalty = 0
                  </p>
                </div>
                <div className="rounded-lg border p-3
                  border-amber-200 bg-amber-50
                  dark:border-amber-500/15 dark:bg-amber-500/5">
                  <p className="mb-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    B — Shortage (Submit &lt; Target)
                  </p>
                  <p className="text-[10px] font-mono leading-relaxed text-slate-500 dark:text-slate-600">
                    Earnings = Submitted × Regular Rate<br />Penalty = Shortage × Penalty Rate
                  </p>
                </div>
                <div className="rounded-lg border p-3
                  border-violet-200 bg-violet-50
                  dark:border-violet-500/15 dark:bg-violet-500/5">
                  <p className="mb-1 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    C — Surplus (Submit &gt; Target)
                  </p>
                  <p className="text-[10px] font-mono leading-relaxed text-slate-500 dark:text-slate-600">
                    Earnings = (Target × Regular Rate)<br />+ (Surplus × Surplus Rate)<br />Penalty = 0
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t pt-3 border-slate-200 dark:border-slate-700/40">
                <p className="text-center text-[10px] font-mono text-slate-400 dark:text-slate-600">
                  Final Payable = Σ(Row Earnings) − Σ(Row Penalties) + Allowances − Deductions
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Invoice Panel (desktop) */}
          <div className="hidden xl:block">
            <InvoicePanel
              result={billingResult}
              operatorName={watchedValues.operatorName ?? ""}
              operatorId={watchedValues.operatorId ?? ""}
              batchId={watchedValues.batchId ?? ""}
              garmentType={watchedValues.garmentType ?? ""}
              orderDate={watchedValues.orderDate ?? ""}
            />
          </div>
        </div>

        {/* Invoice panel on smaller screens */}
        <div className="mt-6 block xl:hidden">
          <InvoicePanel
            result={billingResult}
            operatorName={watchedValues.operatorName ?? ""}
            operatorId={watchedValues.operatorId ?? ""}
            batchId={watchedValues.batchId ?? ""}
            garmentType={watchedValues.garmentType ?? ""}
            orderDate={watchedValues.orderDate ?? ""}
          />
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="mt-12 border-t
        border-slate-200 bg-slate-100/60
        dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <p className="text-xs text-slate-400 dark:text-slate-700">
            GarmentERP · Dynamic Cut-to-Sew Billing · Prototype v2.0
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-700">
            useFieldArray · Per-row Condition A/B/C · Real-time
          </p>
        </div>
      </footer>
    </div>
  );
}
