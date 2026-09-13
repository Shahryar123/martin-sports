import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center bg-background">
      <Container className="py-16">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The page you're looking for doesn't exist or has moved."
          action={
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          }
        />
      </Container>
    </div>
  );
}
