import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-ink border border-line hover:bg-canvas",
  danger: "text-danger hover:bg-danger-tint",
  ghost: "text-ink-soft hover:bg-canvas",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded px-3.5 py-2 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
    />
  );
}
