# Next.js User Registration Module (Teaching Example)

A small, complete registration feature built with the Next.js App Router.
It shows form handling, client + server validation, password hashing,
duplicate checks, and a simple data layer.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000/register

## Project structure

| File | Role |
|---|---|
| `app/register/page.js` | The `/register` page (server component) |
| `components/RegisterForm.js` | Form UI, state, and fetch call (client component) |
| `app/api/register/route.js` | `POST /api/register` - validates, hashes, saves |
| `lib/validation.js` | Rules shared by browser and server |
| `lib/db.js` | JSON-file storage (replace with a real database) |
| `app/globals.css` | Styling |
| `.gitignore`, `.env.example` | Keep secrets and generated files out of Git |

## How a registration flows

1. The user fills in the form; the browser validates for instant feedback.
2. The form sends JSON to `POST /api/register`.
3. The server **validates again** (never trust the browser).
4. It checks that the email is not already registered (409 if it is).
5. The password is hashed with **bcrypt**; the plain password is never stored.
6. The user is saved; the response contains only safe fields (no hash).

## Status codes used

| Code | Meaning |
|---|---|
| 201 | Account created |
| 400 | Validation failed or bad request body |
| 409 | Email already registered |
| 500 | Unexpected server error |

## Not included (good student extensions)

- Login with sessions or JWT (for example Auth.js)
- Email verification and password reset
- Rate limiting and CAPTCHA against bots
- A real database (Prisma + PostgreSQL/SQLite)
- Tests (Jest / Playwright)

## Git exercise

1. `git init`, then check that `.gitignore` hides `node_modules/`, `.next/`, `.env.local`, and `data/users.json`.
2. Commit in small steps: `git commit -m "Add validation rules"`, then `"Add registration API"`, then `"Add registration form"`.
3. Create a branch `feature-login` and add a login route there; merge it back into `main`.
4. Push the project to GitHub.
