import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Course not found</h1>
      <p className="text-slate-600 dark:text-slate-400">
        There is no course with this id in the catalog.
      </p>
      <Link href="/courses" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        Back to all courses
      </Link>
    </section>
  );
}
