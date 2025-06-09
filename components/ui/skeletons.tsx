export function CardSkeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50" />;
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}
