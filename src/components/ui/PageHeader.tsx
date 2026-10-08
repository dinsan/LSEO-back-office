export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
