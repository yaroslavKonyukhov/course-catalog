export default function AboutPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">About</h1>
      <p className="text-slate-600">
        Course Catalog is the semester project for the Advanced Web Technologies
        course. It lists the subjects of the programme and shows the details of
        every one of them.
      </p>
      <p className="text-slate-600">
        The application is built with Next.js 16 on the App Router: pages are
        rendered on the server, and only the like button runs in the browser.
        The course data currently comes from a mock module and will be replaced
        by a real FastAPI backend later in the semester.
      </p>
    </section>
  );
}
