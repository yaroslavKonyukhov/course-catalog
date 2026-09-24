"use client";

import { useState } from "react";

type CourseSearchItem = {
  id: string;
  title: string;
  card: React.ReactNode;
};

type CourseSearchProps = {
  items: CourseSearchItem[];
};

export function CourseSearch({ items }: CourseSearchProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  const found = items.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search courses..."
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      />
      {found.length === 0 ? (
        <p className="text-slate-500">No courses match your search.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {found.map((item) => (
            <li key={item.id}>{item.card}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
