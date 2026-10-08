"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ApiError } from "@/lib/api-client";
import { useCategories } from "@/features/categories/hooks";
import { productInputSchema, type Product, type ProductInput } from "../schema";

export function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  onSubmit: (values: ProductInput) => Promise<unknown>;
  onCancel: () => void;
}) {
  const { data: categories = [] } = useCategories();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: product ?? {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      status: "draft",
    },
  });

  const submit = handleSubmit(async (values) => {
    setServerError(undefined);
    try {
      await onSubmit(values);
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't save the product");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (USD)" error={errors.price?.message}>
          <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
        </Field>
        <Field label="Stock" error={errors.stock?.message}>
          <Input type="number" {...register("stock", { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" error={errors.categoryId?.message}>
          <Select {...register("categoryId")}>
            <option value="">Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </Select>
        </Field>
      </div>
      {serverError && (
        <p role="alert" className="rounded bg-danger-tint px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
