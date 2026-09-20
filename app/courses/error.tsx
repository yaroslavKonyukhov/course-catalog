"use client";

type CoursesErrorProps = {
  error: Error;
  reset: () => void;
};

export default function CoursesError({ error, reset }: CoursesErrorProps) {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-slate-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded border border-slate-300 bg-white px-4 py-2 text-sm hover:border-blue-500"
      >
        Try again
      </button>
    </section>
  );
}
