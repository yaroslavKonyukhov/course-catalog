import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollForm } from "@/components/EnrollForm";
import { LikeButton } from "@/components/LikeButton";
import { getCourse } from "@/lib/courses";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (id === "broken") {
    throw new Error("Failed to load this course.");
  }

  if (!course) {
    notFound();
  }

  return (
    <article className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-semibold">{course.title}</h1>
      <p className="text-slate-600 dark:text-slate-400">{course.description}</p>
      <p className="text-sm text-slate-500">{course.credits} credits</p>
      <LikeButton courseId={course.id} initialLikes={course.likes} />
      <h2 className="text-xl font-semibold">Enroll in this course</h2>
      <EnrollForm courseId={course.id} />
      <Link href="/courses" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        Back to all courses
      </Link>
    </article>
  );
}
