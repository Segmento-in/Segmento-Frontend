## Problem Statement

The Segmento Pulse frontend currently relies on Firebase for authentication (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`), while the backend uses Appwrite databases. This split architecture causes credential fragmentation, maintenance overhead, and security inconsistency. Additionally, the current Login and Signup pages lack the premium, "impeccable" visual engineering (Soft Structuralism) required by the brand standards.

## Solution

Migrate the entire frontend authentication flow to native Appwrite Authentication (Accounts) to unify the infrastructure. Concurrently, redesign the Login and Signup pages into high-fidelity, professional interfaces with editorial typography and micro-animations, eliminating generic UI patterns.

## User Stories

1. As a new user, I want to see a premium, professional Signup page, so that I trust the Segmento Pulse platform.
2. As a new user, I want to create an account using my email and password, so that I can access the Pulse dashboard.
3. As a new user, I want my registration to automatically subscribe me to the newsletter, so that I receive updates without an extra step.
4. As a returning user, I want a visually seamless and responsive Login page, so that I have a frictionless entry into the app.
5. As a returning user, I want to log in securely using my email and password, so that my session is authenticated by the unified Appwrite backend.
6. As a developer, I want all authentication logic decoupled from Firebase, so that the tech stack is simplified and centralized on Appwrite.
7. As a developer, I want the authentication services cleanly abstracted into a `lib/appwrite.ts` file, so that UI components remain agnostic of the underlying SDK implementation.

## Implementation Decisions

- **Infrastructure Integration:** Remove all references to `firebase` in `lib/firebase.ts`.
- **Appwrite Client:** Create `lib/appwrite.ts` exporting a configured `Account` service using `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
- **API Contracts:** 
  - `login` will call Appwrite's `account.createEmailPasswordSession(email, password)`.
  - `register` will call Appwrite's `account.create(ID.unique(), email, password, name)`.
  - Registration will retain the existing `fetch("/api/subscription/subscribe", ...)` call for Brevo integration.
- **Architectural Seams:** The Appwrite `Account` service acts as the primary seam. We will mock this service for all unit tests.
- **Design System:** Use "Soft Structuralism". No generic white boxes; use subtle glass/blur effects, refined borders, and Geist/Cabinet Grotesk typography for forms. 

## Testing Decisions

- **Test Framework:** Vitest + React Testing Library (TDD Red-Green-Refactor).
- **Seams:** We will test the Login and Signup components by mocking the `lib/appwrite.ts` module to prevent actual network calls.
- **What makes a good test:** Tests will verify that submitting the form calls the appropriate Appwrite SDK method with the correct arguments, and that UI elements render the correct premium CSS classes.
- **Modules Tested:** `ThemeToggle` (already covered), `lib/appwrite.ts` (mocked), `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`.

## Out of Scope

- Migrating existing Firebase users to Appwrite. (Assuming fresh start or separate migration script).
- Adding OAuth (Google/GitHub) authentication.
- Password reset and email verification flows (unless explicitly requested later).

## Further Notes

- The `.env` variables have been successfully added by the user.
