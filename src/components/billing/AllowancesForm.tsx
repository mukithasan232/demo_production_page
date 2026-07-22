"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "@/types/billing";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

interface AllowanceRowProps {
  label: string;
  id: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
  errorMessage?: string;
}

function AllowanceRow({ label, id, description, registration, errorMessage }: AllowanceRowProps) {
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
                : "border-slate-200 hover:border-slate-300 focus:border-teal-500/60 focus:ring-teal-500/30 dark:border-slate-700/70 dark:hover:border-slate-600 dark:focus:border-teal-500/50 dark:focus:ring-teal-500/40"
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

export default function AllowancesForm({ register, errors }: Props) {
  return (
    <section className="rounded-xl border p-5 shadow-sm transition-all
      border-slate-200 bg-white
      dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border
          border-teal-200 bg-teal-50
          dark:border-teal-500/30 dark:bg-teal-500/20">
          <svg className="h-4 w-4 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Allowances</h2>
          <p className="text-xs text-slate-500">Additional earnings added to the bill</p>
        </div>
        <span className="ml-auto rounded-full border px-2 py-0.5 text-xs font-bold
          border-teal-200 bg-teal-50 text-teal-600
          dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400">
          ADD (+)
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <AllowanceRow
          label="Breakfast Bill"
          id="allowances.breakfastBill"
          description="Daily meal & refreshment allowance"
          registration={register("allowances.breakfastBill", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.allowances?.breakfastBill?.message}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/40" />
        <AllowanceRow
          label="Sample"
          id="allowances.sample"
          description="Sample garment production allowance"
          registration={register("allowances.sample", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.allowances?.sample?.message}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/40" />
        <AllowanceRow
          label="Sargit Nasta"
          id="allowances.sargitNasta"
          description="Evening snack allowance"
          registration={register("allowances.sargitNasta", { valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
          errorMessage={errors.allowances?.sargitNasta?.message}
        />
      </div>
    </section>
  );
}
