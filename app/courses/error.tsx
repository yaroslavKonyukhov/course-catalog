"use client";

type CoursesErrorProps = {
  error: Error;
  retry: () => void;
};

export default function CoursesError({ error, retry }: CoursesErrorProps) {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
      <button
        onClick={retry}
        className="rounded border border-slate-300 bg-white px-4 py-2 text-sm hover:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
      >
        Try again
      </button>
    </section>
  );
}
