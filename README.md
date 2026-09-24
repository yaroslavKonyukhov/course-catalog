# Course Catalog

Semester project for the Advanced Web Technologies course, Labs 1–2. A course
catalog built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
and shadcn/ui.

## Running the project

```
npm install
npm run dev
```

The app starts on http://localhost:3000.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with a link to the course list |
| `/about` | Static page about the project |
| `/courses` | Course list loaded on the server |
| `/courses/[id]` | Course page with a like button |
| `/login` | Sign-in stub inside the `(auth)` route group |

## What is implemented

- `lib/courses.ts` simulates a backend: `getCourses()` and `getCourse(id)`
  resolve after a 300 ms delay.
- `/courses` is a Server Component that awaits the data directly in the
  component body, without `useEffect` or a loading state.
- `components/CourseCard.tsx` is a Server Component; the whole card is a
  `next/link` `Link`, so navigation needs no client-side JavaScript.
- `/courses/[id]` awaits `params` (a `Promise` since Next.js 15), calls
  `notFound()` for an unknown id, and lists every course id in
  `generateStaticParams()` so all six pages are prerendered at build time.
- `app/courses/[id]/loading.tsx` is shown while the 300 ms delay resolves,
  `app/courses/not-found.tsx` is shown by `notFound()`.
- `components/LikeButton.tsx` is the only interactive component: it is a
  Client Component holding the like count in `useState`.

## Bonus tasks

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

`'use client'` is used in four files: `components/LikeButton.tsx` (required by
Lab 1), `components/NavBar.tsx` (optional part of Lab 2),
`components/CourseSearch.tsx` and `app/courses/error.tsx` (both required by the
Lab 1 bonus tasks — an Error Boundary has to be a Client Component).
