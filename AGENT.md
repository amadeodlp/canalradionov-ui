# Agent Context — canalradionov-ui

## Vision — where this app is headed

Canal Radionov is a radio and broadcast streaming platform. The end goal is a working platform where users can sign up, discover live and recorded broadcasts, listen via an audio player that persists across navigation, manage their own broadcast channel, and access their library of saved content. Auth is handled by AWS Amplify/Cognito; all content data goes through the canalradionov-service backend via Axios.

The app's route structure and visual components are in place. The remaining work is fixing broken data flows (infinite re-renders, mismatched service signatures, undefined field access) and completing wiring between the UI and the backend service. The agent should move the app toward a state where a user can log in, browse shows, play audio, and manage their broadcast — all without runtime errors or dead-end buttons.

## Stack

Next.js (App Router), React, TypeScript, Redux Toolkit, Supabase, AWS Amplify (Cognito), Axios, Tailwind CSS, date-fns

## Project structure

- `app/` — Next.js App Router. Key routes: `page.tsx` (home), `dashboard/`, `discover/`, `live/`, `broadcast/`, `library/`, `login/`, `signup/`, `forgotPassword/`, `confirmationCode/`, `logout/`
- `app/api/services/` — `authService.ts`, `mediaService.ts`, `interactionService.ts` (Axios wrappers)
- `app/api/apiClient.ts` — Axios base client
- `app/redux/` — Redux slices: `authSlice`, `playerSlice`
- `app/hooks/hooks.ts` — typed `useAppSelector` / `useAppDispatch`
- `app/components/` — atomic design: `atoms/`, `Molecules/` (capital M), `organisms/`, `pages/`
- `app/lib/supabase.ts` — Supabase client (secondary, for non-auth data)
- `app/utils/` — auth helpers, formatters, regex

## Key patterns

- Auth: Amplify `signIn`/`signOut`/`getCurrentUser` — never call these outside `app/api/services/authService.ts`
- API calls: always via `app/api/apiClient.ts` Axios instance — do not use fetch directly
- `use client` directive is required on any component that uses hooks, state, or event handlers
- Redux state accessed via typed hooks from `app/hooks/hooks.ts` — not raw `useSelector`/`useDispatch`
- `mediaService` methods and their exact signatures are the contract — match them exactly when calling

## Known incomplete areas — prioritize these

- `app/page.tsx` (home) — calls `mediaService.getAllShows()` directly in the render body, causing an infinite re-render loop; move the call into a `useEffect` with an empty dependency array and store the result in local state
- `BroadcasterDashboard` — uses `useEffect` but `useEffect` is not imported from React; also stats are hardcoded mock values — import `useEffect` and replace mocks with real API calls matching `mediaService` signatures
- `AudioPlayer` (`app/components/organisms/AudioPlayer/`) — calls `mediaService.getEpisode` and `mediaService.incrementPlayCount` with arguments that don't match the actual service method signatures; audit the real signatures and fix the call sites
- `app/broadcast/page.tsx` — scheduled broadcasts section renders hardcoded mock data; past broadcasts "Download" buttons have no handler — wire both to the appropriate `mediaService` methods
- `live/page.tsx` — accesses `show.startTime` and `show.listenerCount` but `RadioShow` type does not have those fields; either extend the type if the backend returns them, or remove the field access and display what the type actually has
- `/profile` route — "View Profile" buttons on discover page and avatar in nav both link here; this route does not exist; create a minimal profile page or redirect to dashboard
