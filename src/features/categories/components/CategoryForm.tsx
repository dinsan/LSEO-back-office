"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { ApiError } from "@/lib/api-client";
import { useCreateCategory } from "../hooks";
import { categoryInputSchema, type CategoryInput } from "../schema";

export function CategoryForm() {
  const create = useCreateCategory();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values);
      reset();
    } catch (e) {
      setError("name", { message: e instanceof ApiError ? e.message : "Couldn't create the category" });
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-start" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Keyboards" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Input {...register("description")} placeholder="What belongs here" />
      </Field>
      <Button type="submit" disabled={create.isPending} className="sm:mt-6">
        {create.isPending ? "Adding…" : "Add category"}
      </Button>
    </form>
  );
}
