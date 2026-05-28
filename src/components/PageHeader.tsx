export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-brand-ink">{title}</h1>
      {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
    </div>
  );
}
