import clsx from "clsx";

const tones = {
  green: "bg-brand-tint text-brand-dark",
  grey: "bg-canvas text-ink-soft",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-danger-tint text-danger",
} as const;

export function Badge({ tone = "grey", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={clsx("rounded px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}
