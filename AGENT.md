# Agent Context — canalradionov-ui

## What this app is

Canal Radionov is a radio/broadcast streaming platform. Users can discover and listen to live and recorded broadcasts, manage their own broadcast channel, and explore a library of content.

## Stack

Next.js (App Router), React, TypeScript, Redux Toolkit, Supabase, AWS Amplify, Axios, Tailwind CSS, date-fns

## Project structure

- `app/` — Next.js App Router. Key routes:
  - `page.tsx` — home/landing
  - `dashboard/` — user dashboard
  - `discover/` — browse broadcasts
  - `live/` — live streaming view
  - `broadcast/` — broadcast management
  - `library/` — recorded content library
  - `login/`, `signup/`, `forgotPassword/`, `confirmationCode/`, `logout/` — auth flow
  - `api/` — Next.js API routes
- `app/redux/` — Redux slices for state management
- `app/hooks/` — custom React hooks
- `app/lib/` — utilities, Supabase client
- `app/components/` — shared UI components
- `app/providers/` — Redux + auth providers

## Key patterns

- Auth via AWS Amplify (Cognito) + Supabase for data
- State in Redux slices, accessed via `useSelector` / `useDispatch`
- API calls via Axios to canalradionov-service backend
- `use client` directive required for interactive components in App Router

## Known incomplete areas

- `broadcast/page.tsx` — scheduled broadcasts section shows hardcoded mock data; past broadcasts "Download" buttons have no handler
- `BroadcasterDashboard` — uses `useEffect` but `useEffect` is not imported; stats are hardcoded mock values
- `AudioPlayer` — calls `mediaService.getEpisode` and `mediaService.incrementPlayCount` with signatures that don't match the actual `mediaService` implementation
- `home/page.tsx` — calls `mediaService.getAllShows()` directly in the render body (not in a useEffect), causing infinite re-renders
- `live/page.tsx` — `RadioShow` type does not have `startTime` or `listenerCount` fields, so those render as undefined
- Navigation — "View Profile" buttons on discover page and avatar in nav link to `/profile` which has no route
