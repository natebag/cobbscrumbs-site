export default function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t-2 border-[var(--accent-soft)] flex flex-wrap justify-between items-center gap-4 text-sm text-[var(--text-soft)]">
      <span>&copy; {new Date().getFullYear()} Cobb&apos;s Crumbs &bull; baked with love</span>
      <div className="flex gap-3">
        <a
          href="https://instagram.com/cobbscrumbs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full bg-[#fffbeb] border border-[var(--accent-soft)] text-[var(--accent)] font-semibold hover:bg-[var(--accent-soft)] transition-colors"
        >
          @cobbscrumbs
        </a>
        <a
          href="https://wa.me/12269244889"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full bg-[#fffbeb] border border-[var(--accent-soft)] text-[var(--accent)] font-semibold hover:bg-[var(--accent-soft)] transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
