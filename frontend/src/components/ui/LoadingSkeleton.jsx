import React from 'react';

export function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel p-6 rounded-2xl animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-800 rounded w-28" />
            <div className="w-10 h-10 bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 bg-slate-800 rounded w-20" />
          <div className="h-3 bg-slate-800/60 rounded w-36" />
        </div>
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-3 animate-pulse">
      <div className="h-10 bg-slate-800/80 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-3 border-b border-slate-800/50">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-6 bg-slate-800 rounded-full w-24" />
          <div className="h-4 bg-slate-800 rounded w-16" />
          <div className="h-4 bg-slate-800 rounded w-16" />
          <div className="h-4 bg-slate-800 rounded w-24 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-sm font-medium text-cyan-400">
            Extracting features & evaluating ML trees...
          </span>
        </div>
        <div className="h-12 bg-slate-800 rounded-xl w-3/4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="h-20 bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
