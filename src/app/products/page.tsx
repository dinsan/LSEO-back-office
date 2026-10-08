"use client";

import { useDeferredValue, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { formatPrice } from "@/lib/format";
import { useCategories } from "@/features/categories/hooks";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from "@/features/products/hooks";
import type { Product } from "@/features/products/schema";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, isFetching } = useProducts({ page, limit: 8, search: deferredSearch, categoryId });
  const { data: categories = [] } = useCategories();
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();

  const close = () => setEditing(null);

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything you sell, with price, stock and visibility."
        action={<Button onClick={() => setEditing("new")}>New product</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          aria-label="Search products"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Select
          aria-label="Filter by category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="max-w-[12rem]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-ink-soft">Loading products…</p>
        ) : isError ? (
          <p role="alert" className="px-6 py-10 text-sm text-danger">
            Couldn&apos;t load products. Refresh the page to try again.
          </p>
        ) : data && data.data.length === 0 ? (
          <EmptyState
            title="No products match"
            hint="Try a different search or category, or add a new product."
            action={<Button onClick={() => setEditing("new")}>New product</Button>}
          />
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className={isFetching ? "opacity-60" : undefined}>
              {data?.data.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{categoryName(p.categoryId)}</td>
                  <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock === 0 ? <Badge tone="red">Out of stock</Badge> : p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.status === "active" ? "green" : "grey"}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button variant="ghost" onClick={() => setEditing(p)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      disabled={remove.isPending}
                      onClick={() => window.confirm(`Delete "${p.name}"?`) && remove.mutate(p.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
          <span>
            Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} products
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="secondary" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {editing && (
        <Modal title={editing === "new" ? "New product" : "Edit product"} onClose={close}>
          <ProductForm
            product={editing === "new" ? undefined : editing}
            onCancel={close}
            onSubmit={async (values) => {
              if (editing === "new") await create.mutateAsync(values);
              else await update.mutateAsync({ id: editing.id, ...values });
              close();
            }}
          />
        </Modal>
      )}
    </>
  );
}
