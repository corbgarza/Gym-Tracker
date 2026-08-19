# Gym Tracker

A workout tracking web application built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **Supabase (PostgreSQL)**.

## Project Structure

```
Gym-Tracker/
└── gym-tracker/
    ├── src/
    │   ├── app/
    │   │   ├── layout.js          # Root HTML layout and font loading
    │   │   ├── page.js            # Main dashboard controller
    │   │   └── globals.css        # Global CSS and Tailwind directives
    │   ├── components/
    │   │   ├── WorkoutForm.js     # Form for logging workout sets
    │   │   ├── WorkoutFilter.js   # Date filtering component
    │   │   ├── WorkoutList.js     # Workout history container
    │   │   └── WorkoutItem.js     # Individual workout row with inline editing
    │   ├── constants/
    │   │   └── exercises.js       # Exercise, bar type, and modifier constants
    │   ├── hooks/
    │   │   └── useWorkouts.js     # Supabase CRUD operations & state management
    │   └── lib/
    │       └── supabase.js        # Supabase client instantiation
```

## Adding Features

The condensed modular architecture makes extending the app straightforward:

1. **Adding New Exercises, Bars, or Modifiers:**
   - Update [`src/constants/exercises.js`](file:///home/corbgarza/Gym-Tracker/gym-tracker/src/constants/exercises.js).

2. **Adding New Input Fields (e.g. RPE, Notes, Bar Type):**
   - Add the initial state key and input in [`src/components/WorkoutForm.js`](file:///home/corbgarza/Gym-Tracker/gym-tracker/src/components/WorkoutForm.js).
   - Pass the payload to [`src/hooks/useWorkouts.js`](file:///home/corbgarza/Gym-Tracker/gym-tracker/src/hooks/useWorkouts.js).
   - Display the new fields in [`src/components/WorkoutItem.js`](file:///home/corbgarza/Gym-Tracker/gym-tracker/src/components/WorkoutItem.js).

3. **Database Queries & Mutations:**
   - All Supabase interactions are isolated in [`src/hooks/useWorkouts.js`](file:///home/corbgarza/Gym-Tracker/gym-tracker/src/hooks/useWorkouts.js).

## Development

```bash
cd gym-tracker
npm run dev
```
