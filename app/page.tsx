import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-semibold">Course Catalog</h1>
      <p className="text-slate-600">
        Welcome! Here you can browse the courses that make up the Advanced Web
        Technologies programme.
      </p>
      <Link
        href="/courses"
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Browse courses
      </Link>
    </section>
  );
}
