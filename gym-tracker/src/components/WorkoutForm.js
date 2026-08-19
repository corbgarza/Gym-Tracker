'use client';

import { useState } from 'react';
import { EXERCISE_OPTIONS } from '../constants/exercises';

const INITIAL_FORM = {
  exercise: '',
  sets: '',
  reps: '',
  weight: '',
  logDate: new Date().toISOString().split('T')[0]
};

const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500";

export default function WorkoutForm({ onAddWorkout }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.exercise || !form.sets || !form.reps || !form.weight) return;

    setSubmitting(true);
    const success = await onAddWorkout(form);
    setSubmitting(false);

    if (success) {
      setForm(prev => ({
        ...INITIAL_FORM,
        logDate: prev.logDate // preserve the chosen date for rapid logging
      }));
    }
  };

  const statsFields = [
    { label: 'Sets', name: 'sets', placeholder: '4' },
    { label: 'Reps', name: 'reps', placeholder: '10' },
    { label: 'Weight', name: 'weight', placeholder: '135' }
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 mb-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Select Exercise
        </label>
        <select
          value={form.exercise}
          onChange={(e) => updateField('exercise', e.target.value)}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="">--- Choose an Exercise ---</option>
          {EXERCISE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {form.exercise && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Date of Workout
            </label>
            <input
              type="date"
              value={form.logDate}
              onChange={(e) => updateField('logDate', e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {statsFields.map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={(e) => updateField(name, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors mt-2"
          >
            {submitting ? 'Saving...' : 'Log to PostgreSQL'}
          </button>
        </div>
      )}
    </form>
  );
}
