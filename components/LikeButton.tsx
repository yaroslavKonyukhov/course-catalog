"use client";

import { useState } from "react";

type LikeButtonProps = {
  initialLikes: number;
};

export function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);

  function handleClick() {
    setLikes((prev) => prev + 1);
  }

  return (
    <button
      onClick={handleClick}
      className="w-fit rounded border border-slate-300 bg-white px-4 py-2 text-sm hover:border-rose-500"
    >
      ❤ {likes}
    </button>
  );
}
