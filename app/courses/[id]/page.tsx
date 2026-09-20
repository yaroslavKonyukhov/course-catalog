import Link from "next/link";
import { notFound } from "next/navigation";
import { LikeButton } from "@/components/LikeButton";
import { getCourse, getCourses } from "@/lib/courses";

export async function generateStaticParams() {
  const courses = await getCourses();

  return courses.map((course) => ({ id: course.id }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "broken") {
    throw new Error("Failed to load this course.");
  }

  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <article className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-semibold">{course.title}</h1>
      <p className="text-slate-600">{course.description}</p>
      <p className="text-sm text-slate-500">{course.credits} credits</p>
      <LikeButton initialLikes={course.likes} />
      <Link href="/courses" className="text-sm text-blue-600 hover:underline">
        Back to all courses
      </Link>
    </article>
  );
}
