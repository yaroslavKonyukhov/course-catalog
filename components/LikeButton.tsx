"use client";

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type LikeButtonProps = {
  courseId: string;
  initialLikes: number;
};

export function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setFailed(false);
    try {
      const res = await fetch(`${API}/courses/${courseId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const course: Course = await res.json();
      setLikes(course.likes);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-fit rounded border border-slate-300 bg-white px-4 py-2 text-sm hover:border-rose-500 dark:border-slate-700 dark:bg-slate-900"
      >
        ❤ {likes}
      </button>
      {failed && <p className="text-red-600">Failed to like the course</p>}
    </div>
  );
}
