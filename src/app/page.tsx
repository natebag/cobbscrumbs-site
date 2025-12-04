import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThisWeekSection from '@/components/ThisWeekSection';

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Header />

      {/* Hero Section */}
      <section className="card p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-10 w-32 h-32 rounded-full bg-orange-200/30" />
        <div className="absolute -bottom-20 -left-16 w-36 h-36 rounded-full bg-pink-200/30" />

        <div className="relative z-10">
          <h1
            className="text-4xl md:text-5xl text-[var(--accent)] mb-2"
            style={{ fontFamily: 'var(--font-pacifico), cursive' }}
          >
            Cobb&apos;s Crumbs
          </h1>
          <p className="text-[var(--text-soft)] mb-4">
            cozy bakes &bull; tiny batches &bull; big love
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-4">
            Homemade treats for birthdays, movie nights &amp; &quot;just because.&quot;
          </h2>

          <p className="text-[var(--text-soft)] mb-6 max-w-xl">
            Emily bakes small-batch goodies from her kitchen &ndash; from sprinkle truffle boxes
            to themed cupcakes and seasonal desserts. Browse the shop and place your order!
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <Link href="/shop" className="btn-main">
              🧁 Browse the Shop
            </Link>
            <a
              href="https://instagram.com/cobbscrumbs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              📸 See more on Instagram
            </a>
          </div>

          <p className="text-sm text-[var(--text-soft)]">
            P.S. Allergies or special requests? Let Emily know when you order!
          </p>
        </div>
      </section>

      {/* This Week Section - fetched from database */}
      <ThisWeekSection />

      {/* About Section */}
      <section className="mb-8">
        <h2
          className="text-2xl text-[var(--accent)] mb-2"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          Meet Emily
        </h2>
        <div className="card p-5 border-dashed">
          <p className="text-[var(--text-soft)]">
            Cobb&apos;s Crumbs started as &quot;I&apos;ll bring dessert&quot; and turned into
            &quot;wait, can I order some too?&quot;. Emily bakes in tiny batches, experiments
            with flavours, and loves turning birthdays and random Tuesdays into something
            a little sweeter.
          </p>
          <p className="text-[var(--text-soft)] mt-3">
            Follow <strong className="text-[var(--accent)]">@cobbscrumbs</strong> on Instagram
            to see new treats, kitchen experiments, and last-minute &quot;I have extra!&quot; boxes.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-8">
        <h2
          className="text-2xl text-[var(--accent)] mb-2"
          style={{ fontFamily: 'var(--font-pacifico), cursive' }}
        >
          Get in Touch
        </h2>
        <p className="text-[var(--text-soft)] mb-4">
          Want to order or have questions? Reach out!
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/12269244889"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-main"
          >
            💬 Message on WhatsApp
          </a>
          <a
            href="https://instagram.com/cobbscrumbs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            📸 DM on Instagram
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
