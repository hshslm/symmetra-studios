import Hero from "@/components/home/Hero";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />

      {/* Placeholder for Phase 9+ sections */}
      <section className="relative bg-bg">
        <p className="py-32 text-center font-body text-sm text-text-secondary">
          Featured projects go here (Phase 9)
        </p>
      </section>
    </main>
  );
}
