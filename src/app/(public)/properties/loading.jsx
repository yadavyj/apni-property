import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function PropertiesLoading() {
  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-[520px] w-full rounded-2xl" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
