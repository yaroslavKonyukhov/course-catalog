import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/lib/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Courses</h1>
      <ul className="flex flex-col gap-4">
        {courses.map((course) => (
          <li key={course.id}>
            <CourseCard
              id={course.id}
              title={course.title}
              description={course.description}
              credits={course.credits}
              likes={course.likes}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
