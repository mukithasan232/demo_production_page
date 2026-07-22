"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "@/types/billing";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

interface DeductionRowProps {
  label: string;
  id: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
  errorMessage?: string;
}

function DeductionRow({ label, id, description, registration, errorMessage }: DeductionRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-600">{description}</p>
      </div>
      <div className="w-36 flex-shrink-0">
        <div className="relative">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 select-none font-sans text-[9px] font-bold text-slate-400 dark:text-slate-500">
            Tk
          </span>
          <input
            id={id}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`w-full rounded-lg border py-2 pl-7 pr-3 text-right text-sm transition-all duration-150 focus:outline-none focus:ring-2
              text-slate-900 dark:text-slate-100
              bg-white dark:bg-slate-800/70
              placeholder:text-slate-300 dark:placeholder:text-slate-700
              ${errorMessage
                ? "border-red-400 focus:ring-red-400/40 dark:border-red-500/60 dark:focus:ring-red-500/40"
                : "border-slate-200 hover:border-slate-300 focus:border-rose-500/60 focus:ring-rose-500/30 dark:border-slate-700/70 dark:hover:border-slate-600 dark:focus:border-rose-500/50 dark:focus:ring-rose-500/40"
              }`}
            {...registration}
          />
        </div>
        {errorMessage && (
          <p className="mt-0.5 text-right text-[10px] text-red-500 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default function DeductionsForm({ register, errors }: Props) {
  return (
    <section className="rounded-xl border p-5 shadow-sm transition-all
      border-slate-200 bg-white
      dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border
          border-rose-200 bg-rose-50
          dark:border-rose-500/30 dark:bg-rose-500/20">
          <svg className="h-4 w-4 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Deductions</h2>
          <p className="text-xs text-slate-500">Amounts subtracted from the payable</p>
        </div>
        <span className="ml-auto rounded-full border px-2 py-0.5 text-xs font-bold
          border-rose-200 bg-rose-50 text-rose-500
          dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
          DEDUCT (−)
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <DeductionRow
          label="Weekly Payment"
          id="deductions.weeklyPayment"
          description="Advance paid during the week"
          registration={register("deductions.weeklyPayment", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.deductions?.weeklyPayment?.message}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/40" />
        <DeductionRow
          label="Advance Deduction"
          id="deductions.advanceDeduction"
          description="Previously taken salary advance"
          registration={register("deductions.advanceDeduction", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.deductions?.advanceDeduction?.message}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/40" />
        <DeductionRow
          label="Outstanding Dues"
          id="deductions.outstandingDues"
          description="Unpaid dues from previous month"
          registration={register("deductions.outstandingDues", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.deductions?.outstandingDues?.message}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/40" />
        <DeductionRow
          label="Others"
          id="deductions.others"
          description="Miscellaneous deductions"
          registration={register("deductions.others", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.deductions?.others?.message}
        />
      </div>
    </section>
  );
}
