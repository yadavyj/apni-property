import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function PropertyDetailLoading() {
  return (
    <Container className="flex flex-col gap-12 py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-4/3 w-full rounded-2xl sm:aspect-video" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    </Container>
  );
}
