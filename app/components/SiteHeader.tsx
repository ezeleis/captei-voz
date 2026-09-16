import Link from "next/link";

const links = [
  { href: "/qualify/demo", label: "Qualificar", id: "qualify" as const },
  { href: "/compose/demo", label: "Compor", id: "compose" as const },
  { href: "/connect-ia", label: "Connect IA", id: "connect-ia" as const },
];

export function SiteHeader({
  current,
}: {
  current?: "home" | "qualify" | "compose" | "connect-ia";
}) {
  return (
    <header className="border-b border-line/80 bg-foam/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="min-w-0">
          <span className="block font-display text-[1.35rem] font-semibold leading-none tracking-tight text-ink">
            Captei
          </span>
          <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-tide">
            Captação · FLN
          </span>
        </Link>
        <nav className="flex shrink-0 gap-1 text-sm">
          {links.map((link) => {
            const active = current === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-ink text-foam"
                    : "text-ink-muted hover:bg-sand hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
