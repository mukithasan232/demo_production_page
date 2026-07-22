"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  useFieldArray,
  Control,
  useWatch,
} from "react-hook-form";
import { FormValues, EMPTY_PART_TASK } from "@/types/billing";
import { computePartTask, CONDITION_META } from "@/lib/billing";

interface Props {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

// ─── Compact number input ─────────────────────────────────────
function NumInput({
  id,
  placeholder,
  registration,
  error,
  hasCurrency,
}: {
  id: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
  error?: string;
  hasCurrency?: boolean;
}) {
  return (
    <div className="relative">
      {hasCurrency && (
        <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 select-none font-sans text-[9px] font-bold text-slate-400 dark:text-slate-500">
          Tk
        </span>
      )}
      <input
        id={id}
        type="number"
        step="0.01"
        min="0"
        placeholder={placeholder}
        className={`w-full rounded-lg border py-2 text-right text-xs font-mono tabular-nums transition-all duration-150
          text-slate-900 dark:text-slate-100
          bg-white dark:bg-slate-900/70
          placeholder:text-slate-300 dark:placeholder:text-slate-700
          focus:outline-none focus:ring-2
          ${hasCurrency ? "pl-5 pr-2" : "px-2.5"}
          ${error
            ? "border-red-400 focus:ring-red-400/40 dark:border-red-500/60 dark:focus:ring-red-500/40"
            : "border-slate-200 hover:border-slate-300 focus:border-indigo-400/60 focus:ring-indigo-400/30 dark:border-slate-700/60 dark:hover:border-slate-600 dark:focus:ring-indigo-500/50 dark:focus:border-indigo-500/50"
          }`}
        {...registration}
      />
    </div>
  );
}

// ─── Live per-row result badge ────────────────────────────────
function RowResult({ index, control }: { index: number; control: Control<FormValues> }) {
  const task = useWatch({ control, name: `partTasks.${index}` });
  const r    = computePartTask(task);
  const meta = CONDITION_META[r.condition];

  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${meta.chip}`}>
        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
        {meta.badge} · {meta.label}
      </span>
      <span className={`text-sm font-black font-mono tabular-nums ${r.rowNetTotal >= 0 ? "text-slate-800 dark:text-slate-100" : "text-red-500 dark:text-red-400"}`}>
        <span style={{ fontFamily: "system-ui,'Segoe UI',Arial,sans-serif" }}>৳</span>
        {Math.abs(r.rowNetTotal).toFixed(2)}
      </span>
      {r.rowPenalty > 0 && (
        <span className="text-[10px] font-mono text-red-500 dark:text-red-400 tabular-nums">
          −<span style={{ fontFamily: "system-ui,'Segoe UI',Arial,sans-serif" }}>৳</span>{r.rowPenalty.toFixed(2)} penalty
        </span>
      )}
      {r.condition === "surplus" && r.surplusQty > 0 && (
        <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 tabular-nums">
          +{r.surplusQty} extra
        </span>
      )}
    </div>
  );
}

export default function PartTasksTable({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "partTasks" });

  return (
    <section className="rounded-xl border p-5 shadow-sm transition-all
      border-slate-200 bg-white
      dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">

      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border
          border-indigo-200 bg-indigo-50
          dark:border-indigo-500/30 dark:bg-indigo-500/20">
          <svg className="h-4 w-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Part Task Assignment</h2>
          <p className="text-xs text-slate-500">Add one row per garment part or the whole piece</p>
        </div>
        <span className="ml-auto rounded-full border px-2.5 py-0.5 text-xs font-bold
          border-slate-200 bg-slate-100 text-slate-500
          dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          {fields.length} {fields.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Task rows */}
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const rowErrors = errors.partTasks?.[index];
          return (
            <div
              key={field.id}
              className="relative rounded-xl border p-4 transition-all duration-200
                border-slate-100 bg-slate-50 hover:border-slate-200
                dark:border-slate-700/50 dark:bg-slate-900/40 dark:hover:border-slate-600/70"
            >
              {/* Row number badge */}
              <div className="absolute -left-px top-4 flex h-5 w-5 items-center justify-center rounded-r-full border border-l-0 text-[9px] font-black
                border-slate-200 bg-slate-100 text-slate-400
                dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-500">
                {index + 1}
              </div>

              {/* Part name + remove */}
              <div className="mb-3 flex items-center gap-2 pl-4">
                <input
                  type="text"
                  placeholder="Part name (e.g. Collar, Sleeve, Whole Shirt…)"
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150
                    text-slate-900 dark:text-slate-100
                    bg-white dark:bg-slate-800/70
                    placeholder:text-slate-400 dark:placeholder:text-slate-600
                    focus:outline-none focus:ring-2
                    ${rowErrors?.partName
                      ? "border-red-400 focus:ring-red-400/40 dark:border-red-500/60 dark:focus:ring-red-500/40"
                      : "border-slate-200 hover:border-slate-300 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:border-slate-700/60 dark:hover:border-slate-600 dark:focus:ring-indigo-500/50 dark:focus:border-indigo-500/50"
                    }`}
                  {...register(`partTasks.${index}.partName`, { required: "Required" })}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-transparent transition-all duration-150
                    text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500
                    dark:text-slate-600 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400
                    disabled:cursor-not-allowed disabled:opacity-25"
                  title="Remove row"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Qty / Rate inputs + result */}
              <div className="flex flex-col gap-3 pl-4 sm:flex-row sm:items-start sm:gap-4">
                {/* Quantities */}
                <div className="flex flex-1 gap-2">
                  <div className="flex-1">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Target</p>
                    <NumInput
                      id={`pt-${index}-target`}
                      placeholder="0"
                      registration={register(`partTasks.${index}.targetQty`, { required: true, valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
                      error={rowErrors?.targetQty?.message}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Submit</p>
                    <NumInput
                      id={`pt-${index}-submit`}
                      placeholder="0"
                      registration={register(`partTasks.${index}.submittedQty`, { required: true, valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
                      error={rowErrors?.submittedQty?.message}
                    />
                  </div>
                </div>

                <div className="hidden h-auto w-px bg-slate-200 dark:bg-slate-700/50 sm:block" />

                {/* Rates */}
                <div className="flex flex-1 gap-2">
                  <div className="flex-1">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Regular</p>
                    <NumInput id={`pt-${index}-regular`} placeholder="0.00" hasCurrency
                      registration={register(`partTasks.${index}.regularRate`, { required: true, valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
                      error={rowErrors?.regularRate?.message} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Penalty</p>
                    <NumInput id={`pt-${index}-penalty`} placeholder="0.00" hasCurrency
                      registration={register(`partTasks.${index}.penaltyRate`, { required: true, valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
                      error={rowErrors?.penaltyRate?.message} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Surplus</p>
                    <NumInput id={`pt-${index}-surplus`} placeholder="0.00" hasCurrency
                      registration={register(`partTasks.${index}.surplusRate`, { required: true, valueAsNumber: true, min: { value: 0, message: "≥ 0" } })}
                      error={rowErrors?.surplusRate?.message} />
                  </div>
                </div>

                <div className="hidden h-auto w-px bg-slate-200 dark:bg-slate-700/50 sm:block" />

                {/* Live result */}
                <div className="flex-shrink-0 text-right sm:min-w-[110px]">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Row Net</p>
                  <RowResult index={index} control={control} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={() => append({ ...EMPTY_PART_TASK })}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-xs font-semibold transition-all duration-200
          border-indigo-200 bg-indigo-50/50 text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600
          dark:border-indigo-500/30 dark:bg-indigo-500/5 dark:text-indigo-400 dark:hover:border-indigo-400/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300
          focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Part Task
      </button>

      {/* Condition legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 border-slate-100 dark:border-slate-700/40">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Condition:</span>
        {(["equal", "shortage", "surplus"] as const).map((c) => {
          const m = CONDITION_META[c];
          return (
            <span key={c} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${m.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
              {m.badge}: {m.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
