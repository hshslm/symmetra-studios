import Hero from "@/components/home/Hero";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />

      {/* Placeholder for Phase 8+ sections */}
      <section className="flex h-screen items-center justify-center bg-bg">
        <p className="font-body text-sm text-text-secondary">
          Featured projects go here (Phase 9)
        </p>
      </section>
    </main>
  );
}
