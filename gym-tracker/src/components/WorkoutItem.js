'use client';

import { useState } from 'react';

const btnBase = "text-xs rounded px-2 py-1 transition-colors";
const editInputClass = "w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100";

export default function WorkoutItem({ workout, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    sets: workout.sets,
    reps: workout.reps,
    weight: workout.weight
  });

  const handleStartEdit = () => {
    setEditForm({
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await onUpdate(workout.id, {
      sets: parseInt(editForm.sets, 10),
      reps: parseInt(editForm.reps, 10),
      weight: parseInt(editForm.weight, 10)
    });
    if (success) setIsEditing(false);
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center gap-3">
      <div>
        <h3 className="font-semibold text-slate-200">{workout.exercise}</h3>
        <p className="text-xs text-slate-500">{new Date(workout.created_at).toLocaleDateString()}</p>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editForm.sets}
            onChange={(e) => setEditForm(prev => ({ ...prev, sets: e.target.value }))}
            className={editInputClass}
          />
          <span className="text-slate-600">×</span>
          <input
            type="number"
            value={editForm.reps}
            onChange={(e) => setEditForm(prev => ({ ...prev, reps: e.target.value }))}
            className={editInputClass}
          />
          <span className="text-slate-600">×</span>
          <input
            type="number"
            value={editForm.weight}
            onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
            className={editInputClass}
          />
          <button
            onClick={handleSave}
            className={`${btnBase} bg-green-600 hover:bg-green-500 text-white ml-1`}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={`${btnBase} bg-slate-700 hover:bg-slate-600 text-slate-200 ml-1`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="text-right flex items-center justify-end gap-3">
          <div>
            <span className="text-lg font-bold text-indigo-400">{workout.sets}</span>
            <span className="mx-1 text-slate-600">×</span>
            <span className="text-lg font-bold text-slate-200">{workout.reps}</span>
            <span className="mx-1 text-slate-600">×</span>
            <span className="text-lg font-bold text-slate-200">{workout.weight}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartEdit}
              className={`${btnBase} text-indigo-400 hover:text-indigo-300 underline`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(workout.id)}
              className={`${btnBase} text-red-500 hover:text-red-400 underline`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
