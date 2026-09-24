import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-slate-500">Loading course…</p>
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-9 w-20" />
    </div>
  );
}
