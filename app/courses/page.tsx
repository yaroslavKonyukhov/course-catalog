import { CourseCard } from "@/components/CourseCard";
import { CourseSearch } from "@/components/CourseSearch";
import { getCourses } from "@/lib/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  const items = courses.map((course) => ({
    id: course.id,
    title: course.title,
    card: (
      <CourseCard
        id={course.id}
        title={course.title}
        description={course.description}
        credits={course.credits}
        likes={course.likes}
      />
    ),
  }));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Courses</h1>
      <CourseSearch items={items} />
    </section>
  );
}
