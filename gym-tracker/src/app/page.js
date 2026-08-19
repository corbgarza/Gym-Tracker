'use client';

import { useState, useMemo } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutFilter from '../components/WorkoutFilter';
import WorkoutList from '../components/WorkoutList';

export default function Home() {
  const { workouts, loading, addWorkout, updateWorkout, deleteWorkout, clearWorkouts } = useWorkouts();
  const [filterDate, setFilterDate] = useState('');

  const filteredWorkouts = useMemo(() => {
    if (!filterDate) return workouts;
    return workouts.filter((workout) => {
      const d = new Date(workout.created_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}` === filterDate;
    });
  }, [workouts, filterDate]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          💪 Live DB Gym Tracker 💪
        </h1>

        <WorkoutForm onAddWorkout={addWorkout} />

        <WorkoutFilter filterDate={filterDate} onFilterChange={setFilterDate} />

        <WorkoutList
          workouts={filteredWorkouts}
          loading={loading}
          filterDate={filterDate}
          onClearHistory={clearWorkouts}
          onUpdate={updateWorkout}
          onDelete={deleteWorkout}
        />
      </div>
    </main>
  );
}
