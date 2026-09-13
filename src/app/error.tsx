"use client";

import { useEffect } from "react";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center bg-background">
      <Container className="py-16">
        <ErrorState onRetry={reset} />
      </Container>
    </div>
  );
}
