'use client';

export default function WorkoutFilter({ filterDate, onFilterChange }) {
  return (
    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between mb-4">
      <label className="text-sm text-slate-400">Filter by Date:</label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
        />
        {filterDate && (
          <button
            type="button"
            onClick={() => onFilterChange('')}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
