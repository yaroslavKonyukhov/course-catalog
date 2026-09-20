import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Course not found</h1>
      <p className="text-slate-600">
        There is no course with this id in the catalog.
      </p>
      <Link href="/courses" className="text-sm text-blue-600 hover:underline">
        Back to all courses
      </Link>
    </section>
  );
}
