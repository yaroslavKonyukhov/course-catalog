import Link from "next/link";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  credits: number;
  likes: number;
};

export function CourseCard({
  id,
  title,
  description,
  credits,
  likes,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-500"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-3 flex gap-4 text-sm text-slate-500">
        <span>{credits} credits</span>
        <span>❤ {likes}</span>
      </div>
    </Link>
  );
}
