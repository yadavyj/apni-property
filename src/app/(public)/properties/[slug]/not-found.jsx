import { SearchX } from "lucide-react";
import Container from "@/components/layout/Container";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";

export default function PropertyNotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        icon={SearchX}
        title="Property Not Found"
        description="This listing may have been sold, removed, or the link is incorrect. Explore our other available properties instead."
        action={
          <Button href="/properties" size="md">
            Browse Properties
          </Button>
        }
      />
    </Container>
  );
}
