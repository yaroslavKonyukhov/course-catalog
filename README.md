# Course Catalog

Semester project for the Advanced Web Technologies course, Labs 1–5. A course
catalog built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
and shadcn/ui. Since Lab 5 the data comes from the FastAPI backend
[course-catalog-api](https://github.com/yaroslavKonyukhov/course-catalog-api).

## Running the project

The frontend needs the backend, so start the backend first and the frontend
second, each in its own terminal window.

Terminal 1 — backend (`course-catalog-api`):

```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
fastapi dev main.py
```

Terminal 2 — frontend (`course-catalog`):

```
npm install
npm run dev
```

The backend runs on http://localhost:8000, the frontend on http://localhost:3000.
Open the frontend exactly as `http://localhost:3000`: that is the only origin the
backend allows.

## Environment variables

Create `.env.local` in the project root, next to `package.json`. The file is not
committed (`.env*` is in `.gitignore`).

| Variable | Example | Used by |
| --- | --- | --- |
| `API_URL` | `http://localhost:8000` | server code: `lib/courses.ts` (Server Components) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | browser code: `ElectiveFilter`, `LikeButton`, `EnrollForm` |

```
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Restart `npm run dev` after creating the file.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with a link to the course list |
| `/about` | Static page about the project |
| `/courses` | Course list, loaded on the server from `GET /courses` |
| `/courses/[id]` | Course page with a like button and an enrollment form |
| `/filter` | "Electives only" filter, loaded in the browser with SWR |
| `/login` | Sign-in stub inside the `(auth)` route group |

## What is implemented

- `lib/courses.ts` calls the backend: `getCourses()` requests `GET /courses`,
  `getCourse(id)` requests `GET /courses/{id}` and returns `undefined` for a 404.
  Both use `cache: "no-store"` and throw on any other unsuccessful status.
- `/courses` is a Server Component that awaits the data directly in the
  component body, without `useEffect` or a loading state.
- `components/CourseCard.tsx` is a Server Component; the whole card is a
  `next/link` `Link`, so navigation needs no client-side JavaScript.
- `/courses/[id]` awaits `params` (a `Promise` since Next.js 15) and calls
  `notFound()` when `getCourse` returns `undefined`.
- `app/courses/[id]/loading.tsx` is shown while the page waits for the backend,
  `app/courses/not-found.tsx` is shown by `notFound()`, `app/courses/error.tsx`
  is shown when the backend is down or answers with an error, and its "Try again"
  button calls `retry` to request the data again.
- `components/ElectiveFilter.tsx` requests `GET /courses?is_elective=true` straight
  from the browser with SWR; the fetcher checks `res.ok`.
- `components/LikeButton.tsx` sends `POST /courses/{id}/like` and shows the number
  from the server's response, so a like survives a page reload.
- `components/EnrollForm.tsx` sends `POST /enrollments` with a JSON body and shows
  the enrollment number, or the server's message when it answers 422.

## Decisions

- `generateStaticParams` was removed from `app/courses/[id]/page.tsx`. It made
  `next build` call `getCourses()`, so the build failed with
  `fetch failed … ECONNREFUSED` whenever the backend was not running, and pages
  built in advance would show stale likes. Lab 1 required it while the data was a
  mock function; now the course list belongs to the backend and both course
  routes are dynamic (`ƒ`). `npm run build` passes with the backend stopped.
- The like is a POST with no body and no custom headers, so it is a simple
  request and the browser sends it without a preflight. The enrollment sends JSON
  with `Content-Type: application/json`, which is not allowed for simple
  requests, so the browser first sends an `OPTIONS` preflight and waits for the
  backend's permission.

## Breakage journal

All entries were reproduced with both servers running, DevTools Network with
Disable cache on, and the protocol from the lab: open `/filter`, click ❤ on
`/courses/web-security`, submit the enrollment form with a proper name, open
`/courses`. Each breakage was rolled back with `git restore` before the next one.

### Breakage 1: CORS removed

- What I did: commented out the whole `app.add_middleware(CORSMiddleware, ...)`
  block in `main.py`.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin
  'http://localhost:3000' has been blocked by CORS policy: No
  'Access-Control-Allow-Origin' header is present on the requested resource.`
  For the form: `Response to preflight request doesn't pass access control check:
  No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: `courses` — CORS error (backend log: 200 OK); `like` — CORS error, but
  the backend log shows `POST /courses/web-security/like 200 OK` and the server
  count went from 21 to 22; `OPTIONS enrollments` — 405, the POST is not sent.
  `/courses` works.
- Cause: no `access-control-allow-origin` in any response because CORS is not
  connected; the server still executes the requests.
- How I found it: step 3 (no `access-control-allow-origin` in Response Headers)
  and step 4 (the preflight gets 405, not 400 — the middleware is missing).

### Breakage 2: trailing slash in allow_origins

- What I did: `allow_origins=["http://localhost:3000"]` →
  `allow_origins=["http://localhost:3000/"]`.
- Console: the same `No 'Access-Control-Allow-Origin' header…` messages as in
  breakage 1, for `courses`, `like` and the preflight of `enrollments`.
- Network: `courses` and `like` — CORS error (backend 200 OK);
  `OPTIONS enrollments` — 400, the POST is not sent. A manual preflight with curl
  answers `400 Disallowed CORS origin`.
- Cause: `"http://localhost:3000/"` is not an origin, so it matches no page and
  nobody gets permission.
- How I found it: step 4 — the preflight gets 400, not 405, so CORS is connected
  but the origin is wrong; the curl body names it.

### Breakage 3: allow_methods removed

- What I did: deleted the `allow_methods=["*"],` line.
- Console: `Access to fetch at 'http://localhost:8000/enrollments' from origin
  'http://localhost:3000' has been blocked by CORS policy: Response to preflight
  request doesn't pass access control check: It does not have HTTP ok status.`
- Network: `courses` — 200, `like` — 200 (both work); `OPTIONS enrollments` — 400
  with `access-control-allow-origin: http://localhost:3000` and
  `access-control-allow-methods: GET`; the POST is not sent. curl:
  `400 Disallowed CORS method`.
- Cause: by default only GET is allowed in a preflight; the like does not need a
  preflight, so only the form breaks.
- How I found it: step 4 — the preflight has the origin header but lists only GET.

### Breakage 4: the page opened at 127.0.0.1

- What I did: `main.py` unchanged; added `allowedDevOrigins: ["127.0.0.1"]` to
  `next.config.ts` and opened `http://127.0.0.1:3000/filter`.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin
  'http://127.0.0.1:3000' has been blocked by CORS policy: No
  'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: `courses` and `like` — CORS error (backend 200 OK);
  `OPTIONS enrollments` — 400. `/courses` works.
- Cause: `127.0.0.1` and `localhost` are different hosts, so
  `http://127.0.0.1:3000` is a different origin that is not in the list.
- How I found it: step 3 — the `Origin` request header is `http://127.0.0.1:3000`,
  not the allowed value.

### Breakage 5: a Python error that looks like CORS

- What I did: in `list_courses`, `p["offset"]` → `p["ofset"]`.
- Console on `/filter`: `Access to fetch at 'http://localhost:8000/courses' from
  origin 'http://localhost:3000' has been blocked by CORS policy: No
  'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: `courses` — CORS error with a raw status of 500; `like` — 200;
  `OPTIONS enrollments` — 200, `POST enrollments` — 201. `/courses` shows
  `error.tsx` with `API error: 500`.
- Cause: `KeyError: 'ofset'` in `main.py`, line 49; the 500 response is produced
  outside `CORSMiddleware`, so it has no CORS headers.
- How I found it: step 1 and step 5 — `/courses`, which the Next.js server loads,
  is broken too, so it is not CORS; the backend terminal shows
  `GET /courses 500 Internal Server Error` and the traceback.

### Breakage 6 (optional): alias_generator removed

- What I did: deleted `alias_generator=to_camel,` from `CamelModel`.
- Console: no CORS messages; only `the server responded with a status of 422` for
  the form.
- Network: everything is 200, the form gets 422 and shows
  `The server rejected the data: Field required`; on `/filter` the "elective"
  marks are gone.
- Cause: the JSON is in snake_case again (`is_elective`, `course_id`), so it no
  longer matches the `Course` type and the form body.
- How I found it: step 2 — statuses are fine, so the problem is in the data;
  compared the JSON on the Response tab with the `Course` type.

### Breakage 7 (optional): NEXT_PUBLIC_API_URL not set

- What I did: commented out `NEXT_PUBLIC_API_URL` in `.env.local` and restarted
  `npm run dev`.
- Console: `Failed to load resource: the server responded with a status of 404
  (Not Found)`, no mention of CORS.
- Network: `GET http://localhost:3000/undefined/courses` — 404; the like went to
  `/courses/undefined/courses/web-security/like` — 404 (a relative address is
  resolved from the current page).
- Cause: the variable is `undefined`, so the address became relative and the
  request went to the frontend itself.
- How I found it: step 1 — the Request URL is not on port 8000.

### Breakage 8 (optional): backend stopped

- What I did: stopped `fastapi dev`.
- Console: `Failed to load resource: net::ERR_CONNECTION_REFUSED`.
- Network: `courses` — failed, `net::ERR_CONNECTION_REFUSED`; `/courses` and the
  course page show `error.tsx` with `fetch failed`.
- Cause: there is no connection at all, CORS is not involved.
- How I found it: step 2 — the status is a connection failure, not a CORS error.

## Lab 1 bonus tasks

- `app/courses/error.tsx` — an Error Boundary for the courses segment.
  Opening `/courses/broken` throws on purpose and the boundary renders
  instead of the app crashing; the navigation bar stays in place.
- Client-side search on `/courses`. The page itself stays a Server Component:
  it renders the cards on the server and passes them to
  `components/CourseSearch.tsx`, which keeps the query in `useState` and
  filters the list locally. Passing the cards as `React.ReactNode` keeps
  `CourseCard` a Server Component.
- `app/(auth)/login/page.tsx` — a route group. The `(auth)` folder groups the
  route without becoming a part of the URL, so the page is served at `/login`.

Deployment to Vercel was not done.

## Lab 2: styling with Tailwind CSS and shadcn/ui

Lab 2 styled the course cards with shadcn/ui `Card` and `Button`, made the course
list a responsive grid (1 / 2 / 3 columns), and styled the navigation with spacing,
hover states and a highlighted current page.

- shadcn/ui was set up with `npx shadcn@latest init` (default answers) and
  `npx shadcn@latest add button card`; the components live in `components/ui/`.
- `components/CourseCard.tsx` uses `Card`, `CardHeader`, `CardTitle`,
  `CardContent` and a ghost `Button`, and is still a Server Component.
- The grid classes `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` sit on the list
  container in `components/CourseSearch.tsx`, which renders the course list.
- `components/NavBar.tsx` is a Client Component that highlights the current page
  with `usePathname()`, so `app/layout.tsx` stays a Server Component.

Bonus tasks:

- a `brand` color in the `@theme` block of `app/globals.css`, used by a new
  `brand` variant in `components/ui/button.tsx` on the home page link;
- dark mode that follows the system setting, using the `dark:` prefix;
- a shadcn/ui `Skeleton` in `app/courses/[id]/loading.tsx`.

## Notes

`'use client'` is used in six files: `components/LikeButton.tsx`,
`components/ElectiveFilter.tsx` and `components/EnrollForm.tsx` (they talk to the
backend from the browser), `components/NavBar.tsx` (uses `usePathname()`),
`components/CourseSearch.tsx` (keeps the search query in state) and
`app/courses/error.tsx` (an Error Boundary has to be a Client Component).
