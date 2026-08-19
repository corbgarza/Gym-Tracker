'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
    } else {
      setWorkouts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ignore) {
        if (error) {
          console.error('Error fetching workouts:', error);
        } else {
          setWorkouts(data || []);
        }
        setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const addWorkout = async ({ exercise, weight, reps, sets, logDate }) => {
    const customTimestamp = new Date(`${logDate}T12:00:00`).toISOString();
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        exercise,
        weight: parseInt(weight, 10),
        reps: parseInt(reps, 10),
        sets: parseInt(sets, 10),
        created_at: customTimestamp
      }])
      .select();

    if (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save to database.');
      return false;
    }

    if (data && data[0]) {
      setWorkouts(prev => [data[0], ...prev]);
      return true;
    }
    return false;
  };

  const updateWorkout = async (id, updates) => {
    const { error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating workout:', error);
      alert('Failed to update workout.');
      return false;
    }

    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    return true;
  };

  const deleteWorkout = async (id) => {
    if (!confirm('Are you sure you want to delete this set?')) return false;

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout.');
      return false;
    }

    setWorkouts(prev => prev.filter(w => w.id !== id));
    return true;
  };

  const clearWorkouts = async () => {
    if (!confirm('Are you sure you want to wipe the database logs?')) return false;

    const { error } = await supabase
      .from('workouts')
      .delete()
      .neq('id', 0);

    if (error) {
      console.error('Error wiping database:', error);
      alert('Failed to clear database logs.');
      return false;
    }

    setWorkouts([]);
    return true;
  };

  return {
    workouts,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    clearWorkouts,
    refetch: fetchWorkouts
  };
}
