export default function StudioPage(): React.ReactElement {
  const team = [
    { name: "Aria Chen", role: "Creative Director" },
    { name: "Marcus Webb", role: "Technical Director" },
    { name: "Lena Okafor", role: "Lead Producer" },
    { name: "Soren Hale", role: "AI Research Lead" },
    { name: "Priya Nair", role: "Director of Photography" },
    { name: "Kai Strand", role: "Sound Designer" },
  ];

  const capabilities = [
    "AI Video Generation",
    "Motion Capture",
    "Volumetric Filmmaking",
    "Real-Time Rendering",
    "Generative Visual Effects",
    "Spatial Audio Design",
    "Brand Film Production",
    "Creative Direction",
  ];

  return (
    <main className="min-h-dvh px-8 pb-32 md:px-16 lg:px-24">
      {/* Hero */}
      <section className="pb-20 pt-32 md:pt-40">
        <p
          data-transition-in
          data-transition-in-order="1"
          className="mb-4 font-body text-sm uppercase tracking-[0.2em] text-text-secondary"
        >
          About Us
        </p>
        <h1
          data-transition-in
          data-transition-in-order="2"
          className="font-display text-6xl font-bold text-text md:text-8xl"
        >
          THE STUDIO
        </h1>
        <p
          data-transition-in
          data-transition-in-order="3"
          className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-text-secondary"
        >
          Symmetra Studios sits at the intersection of artificial intelligence
          and cinematic storytelling. We build tools, train models, and direct
          films — all under one roof. Every frame is a collaboration between
          human vision and machine capability.
        </p>
      </section>

      {/* Philosophy */}
      <section
        data-transition-in
        data-transition-in-order="4"
        className="border-t border-white/10 py-20"
      >
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="mb-6 font-display text-3xl font-bold text-text">
              Philosophy
            </h2>
            <p className="font-body text-base leading-relaxed text-text-secondary">
              We don&apos;t treat AI as a shortcut. We treat it as a new
              medium — one that demands the same rigor, taste, and intentionality
              as any other filmmaking discipline. The technology serves the
              story, never the other way around.
            </p>
          </div>
          <div>
            <h2 className="mb-6 font-display text-3xl font-bold text-text">
              Process
            </h2>
            <p className="font-body text-base leading-relaxed text-text-secondary">
              Every project starts with a creative brief and ends with a
              deliverable that could run in a theater. Between those two points,
              we move fluidly between traditional production techniques and
              custom AI pipelines built for the specific needs of each project.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-white/10 py-20">
        <h2
          data-transition-in
          data-transition-in-order="5"
          className="mb-12 font-display text-3xl font-bold text-text"
        >
          Capabilities
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
          {capabilities.map((cap) => (
            <p
              key={cap}
              className="border-l border-white/10 pl-4 font-body text-sm text-text-secondary"
            >
              {cap}
            </p>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/10 py-20">
        <h2 className="mb-12 font-display text-3xl font-bold text-text">
          Team
        </h2>
        <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <h3 className="font-display text-xl font-bold text-text">
                {member.name}
              </h3>
              <p className="mt-1 font-body text-sm uppercase tracking-[0.15em] text-text-secondary">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="border-t border-white/10 py-20 text-center"
      >
        <p className="mb-4 font-body text-sm uppercase tracking-[0.2em] text-text-secondary">
          Let&apos;s make something
        </p>
        <a
          href="mailto:hello@symmetrastudios.com"
          data-cursor="email"
          className="font-display text-4xl font-bold text-text transition-colors duration-300 hover:text-white md:text-6xl"
        >
          hello@symmetrastudios.com
        </a>
      </section>
    </main>
  );
}
