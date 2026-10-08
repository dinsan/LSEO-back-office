"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api-client";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useCategories, useDeleteCategory } from "@/features/categories/hooks";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const remove = useDeleteCategory();
  const [error, setError] = useState<string>();

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setError(undefined);
    remove.mutate(id, { onError: (e) => setError(e instanceof ApiError ? e.message : "Couldn't delete the category") });
  };

  return (
    <>
      <PageHeader title="Categories" description="Group products so they're easy to find and discount." />

      <section className="mb-6 rounded-lg border border-line bg-white p-5">
        <CategoryForm />
      </section>

      {error && (
        <p role="alert" className="mb-4 rounded bg-danger-tint px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-ink-soft">Loading categories…</p>
        ) : categories?.length === 0 ? (
          <EmptyState title="No categories yet" hint="Add your first category above, then assign products to it." />
        ) : (
          <table className="w-full min-w-[520px] text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories?.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.slug}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.description || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="danger" onClick={() => onDelete(c.id, c.name)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
