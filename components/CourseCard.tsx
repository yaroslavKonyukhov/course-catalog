import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Link href={`/courses/${id}`} className="block h-full">
      <Card className="h-full hover:shadow-md hover:border-blue-300 hover:ring-blue-300 dark:hover:ring-blue-500 transition">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-slate-600 dark:text-slate-300">{description}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">{credits} credits</span>
            <Button variant="ghost" size="sm">
              ❤ {likes}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
