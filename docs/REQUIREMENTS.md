# Weight Training Application Requirements

## Overview

A Next.js-based weight training application for tracking workouts, managing
exercises, and calculating optimal training weights. The application supports
multiple exercise types including barbell, dumbbell, machine, and bodyweight
exercises.

## Technical Stack

### Core Technologies

- **Framework**: Next.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **UI Library**: Material UI (MUI)
- **Testing**: Vitest for unit tests, Stryker for mutation testing

### Development Tools

- **Package Manager**: pnpm
- **Git Hooks**: Husky for pre-commit validation

## Functional Requirements

### 1. User Authentication

- Users must authenticate to access the application
- Session management with automatic redirects for unauthorized access
- User-specific data isolation

### 2. Exercise Management

#### Exercise Types

The application must support the following exercise categories:

- Barbell Exercises
- Dumbbell Exercises
- Machine Exercises
- Bodyweight Exercises

### 3. Workout Planning and Execution

#### Sets and Reps Configuration

- Support for NxM workout formats (e.g., 5x5, 3x8)
- Configurable ORM (One Rep Max) ratios for intensity targeting
- Automatic calculation of working weights based on training max percentages

#### Workout Execution

- Real-time workout tracking with set-by-set progression
- Visual plate loading diagrams
- Timer functionality for rest periods
- Skip/complete options for individual sets and for exercise_blocks.

### 4. Data Management

#### Exercise Data Structure

- Versioned data structures for backward compatibility
- Type-safe exercise data with discriminated unions
- Support for warmup vs working sets
- Timestamp tracking for all exercise entries

#### User Preferences

- Pinned exercises for quick access
- One Rep Max tracking per exercise
- Training Max tracking per exercise
- Equipment availability configuration

### 5. Plate Management

- Configurable available plate weights
- Minimal plate calculation algorithms using greedy approach
- Visual representation of barbell loading
- Support for calculating plates for one side of barbell or single dumbbell

## Non-Functional Requirements

### 1. Performance

- **Mobile-First**: Optimized for mobile device usage with automatic wrapping
  layouts to work across many phone screen sizes.
- **Efficient Queries**: Optimized database interactions to make it more
  ammenable to mobile internet connections.

### 2. User Experience

- **Intuitive Navigation**: Clear exercise categorization and search with
  obvious places to click.
- **Real-time Updates**: Immediate feedback during workout execution
- **Visual Aids**: Plate diagrams and weight visualizations so it's easy to see
  what the machine/bar, etc. should look like.
- **Error Handling**: Graceful handling of invalid states

### 3. Data Integrity

- **Validation**: Input validation for weights, reps, and user data
- **Consistency**: Referential integrity between exercises and user data
- **Type Safety**: Exhaustive handling of exercise types with compile-time
  checks
