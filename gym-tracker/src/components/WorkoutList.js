'use client';

import WorkoutItem from './WorkoutItem';

export default function WorkoutList({
  workouts,
  loading,
  filterDate,
  onClearHistory,
  onUpdate,
  onDelete
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-300">Training List</h2>
        {workouts.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-red-400 hover:text-red-300 underline"
          >
            Wipe Remote DB
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 italic">Connecting to database...</p>
      ) : workouts.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          {filterDate ? 'No sets found for this date.' : 'No sets found in cloud storage.'}
        </p>
      ) : (
        workouts.map((workout) => (
          <WorkoutItem
            key={workout.id}
            workout={workout}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
