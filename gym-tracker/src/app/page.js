'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const EXERCISE_OPTIONS = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Bicep Curl',
  'Tricep Pushdown',
  'Lat Pulldown'
];

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  
  // 1. Change initial state to an empty string
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
	const [sets, setSets] = useState('');
  const [loading, setLoading] = useState(true);
	const [filterDate, setFilterDate] = useState('');
	const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [editingId, setEditingId] = useState(null);
  const [editWeight, setEditWeight] = useState('');
  const [editReps, setEditReps] = useState('');
	const [editSets, setEditSets] = useState('');

  // FETCH FROM DATABASE ON LOAD
  useEffect(() => {
    async function fetchWorkouts() {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setWorkouts(data);
      }
      setLoading(false);
    }
    fetchWorkouts();
  }, []);

  // INSERT INTO DATABASE ON SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exercise || !weight || !reps || !sets) return;

		const customTimestamp = new Date(`${logDate}T12:00:00`).toISOString();
	

    const { data, error } = await supabase
      .from('workouts')
      .insert([{ exercise, weight: parseInt(weight), reps: parseInt(reps), sets: parseInt(sets), created_at: customTimestamp }])
      .select();

    if (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save to database.');
    } else if (data) {
      setWorkouts([data[0], ...workouts]);
      
      // Reset everything, including the dropdown, to hide the inputs again
      setExercise('');
      setWeight('');
      setReps('');
			setSets('');
    }
  };

  const clearHistory = async () => {
    if (confirm('Are you sure you want to wipe the database logs?')) {
      const { error } = await supabase.from('workouts').delete().neq('id', 0);
      if (!error) setWorkouts([]);
    }
  };

	const filteredWorkouts = workouts.filter((workout) => {
    if (!filterDate) return true; // Show all if no date selected

    // Convert UTC database time to local YYYY-MM-DD
    const d = new Date(workout.created_at);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}` === filterDate;
  });

  const submitEdit = async (id) => {
    const { error } = await supabase
      .from('workouts')
      .update({ weight: parseInt(editWeight), reps: parseInt(editReps), sets: parseInt(editSets) })
      .eq('id', id);

    if (error) {
      console.error('Error updating:', error);
    } else {
      // Update the local list instantly
      setWorkouts(workouts.map(w => w.id === id ? { ...w, weight: editWeight, reps: editReps, sets: editSets } : w));
      setEditingId(null); // Close the edit mode
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          💪 Live DB Gym Tracker
        </h1>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Select Exercise
            </label>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {/* Placeholder option */}
              <option value="">--- Choose an Exercise ---</option>
              
              {EXERCISE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* 2. CONDITIONAL SLIDE-IN/POP-UP LOGIC */}
          {exercise && (
            <div className="space-y-4 animate-fadeIn">
							<div>
								<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Date of Workout</label>
								<input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Sets</label>
                  <input
                    type="number"
                    placeholder="4"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Reps</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Weight</label>
                  <input
                    type="number"
                    placeholder="135"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                Log to PostgreSQL
              </button>
            </div>
          )}
        </form>

        {/* HISTORY LIST */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-300">Training List</h2>
            {workouts.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 underline">
                Wipe Remote DB
              </button>
            )}
          </div>
  
				<div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between mb-4">
            <label className="text-sm text-slate-400">Filter by Date:</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')} 
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 italic">Connecting to database...</p>
          ) : workouts.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No sets found in cloud storage.</p>
          ) : (
            filteredWorkouts.map((workout) => (
              <div key={workout.id} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-200">{workout.exercise}</h3>
                  <p className="text-xs text-slate-500">{new Date(workout.created_at).toLocaleDateString()}</p>
                </div>
							{/* REPLACED SECTION: Toggle between Edit inputs and View text */}
                {editingId === workout.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={editSets} 
                      onChange={(e) => setEditSets(e.target.value)} 
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100" 
                    />
                    <span className="text-slate-600">×</span>
                    <input 
                      type="number" 
                      value={editReps} 
                      onChange={(e) => setEditReps(e.target.value)} 
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100" 
                    />
                    <span className="text-slate-600">×</span>
                    <input 
                      type="number" 
                      value={editWeight} 
                      onChange={(e) => setEditWeight(e.target.value)} 
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100" 
                    />
                    <button onClick={() => submitEdit(workout.id)} className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded ml-1">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-slate-300">Cancel</button>
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
                    <button 
                      onClick={() => { setEditingId(workout.id); setEditWeight(workout.weight); setEditReps(workout.reps); setEditSets(workout.sets);  }} 
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
