export function langChipClass(active: boolean): string {
  return `rounded-full px-3 py-1 text-sm transition disabled:opacity-40 ${
    active
      ? "bg-ink text-foam"
      : "border border-line bg-paper text-ink-muted hover:border-tide hover:text-ink"
  }`;
}
