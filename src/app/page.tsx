import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate, formatPrice } from "@/lib/format";
import { campaignService } from "@/features/campaigns/service";
import { categoryService } from "@/features/categories/service";
import { productService } from "@/features/products/service";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [{ items: latest, meta }, categories, campaigns] = await Promise.all([
    productService.list({ page: 1, limit: 5 }),
    categoryService.list(),
    campaignService.list(),
  ]);
  const running = campaigns.filter((c) => c.status === "active");

  return (
    <>
      <PageHeader title="Overview" description="What's in the catalogue right now." />

      <dl className="mb-8 grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-white">
        {[
          ["Products", meta.total],
          ["Categories", categories.length],
          ["Campaigns running", running.length],
        ].map(([label, value]) => (
          <div key={label} className="px-5 py-4">
            <dt className="text-sm text-ink-soft">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-semibold">Latest products</h2>
            <Link href="/products" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-line">
            {latest.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{p.name}</span>
                <span className="text-ink-soft">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-semibold">Campaigns</h2>
            <Link href="/campaigns" className="text-sm font-medium text-brand hover:underline">
              Manage
            </Link>
          </header>
          {campaigns.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-soft">No campaigns yet. Create one to discount a set of products.</p>
          ) : (
            <ul className="divide-y divide-line">
              {campaigns.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span>
                    {c.name}
                    <span className="ml-2 text-ink-faint">ends {formatDate(c.endDate)}</span>
                  </span>
                  <Badge tone={c.status === "active" ? "green" : c.status === "scheduled" ? "amber" : "grey"}>{c.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
