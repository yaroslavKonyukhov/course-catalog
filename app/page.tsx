import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-semibold">Course Catalog</h1>
      <p className="text-slate-600">
        Welcome! Here you can browse the courses that make up the Advanced Web
        Technologies programme.
      </p>
      <Link href="/courses" className={buttonVariants({ variant: "brand", size: "lg" })}>
        Browse courses
      </Link>
    </section>
  );
}
