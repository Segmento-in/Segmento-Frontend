# Tickets: Pulse Auth Migration & UI Redesign

Migrate Pulse authentication from Firebase to Appwrite and redesign the Login/Signup pages to premium "Soft Structuralism" standards. Ref: `specs/auth-migration.md`.

## Ticket 1: Setup Appwrite Auth Client

**What to build:** Create the base Appwrite client configuration and export the `Account` service, replacing the old Firebase configuration.

**Blocked by:** None — can start immediately.

- [x] Delete `lib/firebase.ts`.
- [x] Create `lib/appwrite.ts`.
- [x] Initialize Appwrite `Client` using `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
- [x] Export `account` from `lib/appwrite.ts`.
- [x] Create basic unit tests confirming the client initializes correctly.

## Ticket 2: Redesign and Migrate Login Page

**What to build:** A high-fidelity Login page that uses Appwrite `account.createEmailPasswordSession` instead of Firebase.

**Blocked by:** Ticket 1

- [x] Write failing test for Login component submitting to Appwrite `account.createEmailPasswordSession`.
- [x] Implement the login logic to pass the test (Green).
- [x] Refactor UI: Apply "Soft Structuralism" CSS (blur, borders, typography, hover states) to the form and container.
- [x] Ensure all tests pass.

## Ticket 3: Redesign and Migrate Signup Page

**What to build:** A high-fidelity Signup page that uses Appwrite `account.create` and retains the `/api/subscription/subscribe` logic.

**Blocked by:** Ticket 1

- [x] Write failing test for Signup component submitting to Appwrite `account.create` and the local subscription API.
- [x] Implement the signup logic to pass the test (Green).
- [x] Refactor UI: Apply "Soft Structuralism" CSS consistent with the new Login page.
- [x] Ensure all tests pass.

## Ticket 4: Cleanup & Ubiquitous Language Update

**What to build:** Finalize the migration by updating terminology in documentation and ensuring no dead Firebase code remains.

**Blocked by:** Ticket 2, Ticket 3

- [x] Audit the codebase for any remaining Firebase imports and remove them.
- [x] Update `UBIQUITOUS_LANGUAGE.md` to define Appwrite Account and deprecate Firebase Auth.
