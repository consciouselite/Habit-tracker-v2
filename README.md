# Habit Tracker

## Overview
A comprehensive habit tracking application built with React, Vite, and Supabase.

## Prerequisites
- Node.js (v18+)
- npm

## Local Development
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Deployment
This project is configured for easy deployment on Netlify.

### Netlify Deployment Steps
1. Fork the repository
2. Connect your Netlify account to the repository
3. Set the following environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Technologies
- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- React Router
- Zod Validation

## Features
- User Authentication
- Habit Tracking
- Goal Setting
- Progress Visualization
- Onboarding Flow
