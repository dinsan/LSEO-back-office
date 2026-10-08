"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ApiError } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import { useProducts } from "@/features/products/hooks";
import { campaignInputSchema, type CampaignInput } from "../schema";

const today = () => new Date().toISOString().slice(0, 10);

export function CampaignForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: CampaignInput) => Promise<unknown>;
  onCancel: () => void;
}) {
  const { data: products } = useProducts({ limit: 50 });
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CampaignInput>({
    resolver: zodResolver(campaignInputSchema),
    defaultValues: {
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      startDate: today(),
      endDate: today(),
      productIds: [],
    },
  });

  const selected = watch("productIds");
  const discountType = watch("discountType");
  const toggle = (id: string) =>
    setValue("productIds", selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id], {
      shouldValidate: true,
    });

  const submit = handleSubmit(async (values) => {
    setServerError(undefined);
    try {
      await onSubmit(values);
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't create the campaign");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Campaign name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Black Friday keyboards" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Discount type" error={errors.discountType?.message}>
          <Select {...register("discountType")}>
            <option value="percentage">Percentage off</option>
            <option value="fixed">Fixed amount off</option>
          </Select>
        </Field>
        <Field label={discountType === "percentage" ? "Percent off" : "Amount off (USD)"} error={errors.discountValue?.message}>
          <Input type="number" step="0.01" {...register("discountValue", { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Starts" error={errors.startDate?.message}>
          <Input type="date" {...register("startDate")} />
        </Field>
        <Field label="Ends" error={errors.endDate?.message}>
          <Input type="date" {...register("endDate")} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium">Products in this campaign</legend>
        <div className="max-h-48 divide-y divide-line overflow-y-auto rounded border border-line">
          {products?.data.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-canvas">
              <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
              <span className="flex-1">{p.name}</span>
              <span className="text-ink-soft">{formatPrice(p.price)}</span>
            </label>
          )) ?? <p className="px-3 py-2 text-sm text-ink-soft">Loading products…</p>}
        </div>
        {errors.productIds && (
          <p role="alert" className="mt-1 text-sm text-danger">
            {errors.productIds.message}
          </p>
        )}
      </fieldset>

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
          {isSubmitting ? "Creating…" : "Create campaign"}
        </Button>
      </div>
    </form>
  );
}
