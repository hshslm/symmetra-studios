export default function WorkPage(): React.ReactElement {
  const projects = [
    {
      title: "Neon Drift",
      category: "Commercial",
      year: "2026",
      description:
        "A kinetic brand film for an electric vehicle startup, blending AI-generated landscapes with practical light rigs.",
    },
    {
      title: "Echoes",
      category: "Short Film",
      year: "2025",
      description:
        "Experimental narrative exploring memory through generative visuals and spatial audio design.",
    },
    {
      title: "Terraform",
      category: "Music Video",
      year: "2025",
      description:
        "Fully AI-generated environments paired with motion-captured performance for an electronic artist.",
    },
    {
      title: "Vanta",
      category: "Brand Identity",
      year: "2025",
      description:
        "Visual identity system and launch film for a luxury fashion house entering the digital space.",
    },
    {
      title: "Signal / Noise",
      category: "Documentary",
      year: "2024",
      description:
        "A short documentary on the intersection of machine learning and traditional filmmaking craft.",
    },
    {
      title: "Parallax",
      category: "Commercial",
      year: "2024",
      description:
        "Product launch campaign using volumetric capture and real-time rendering for a tech company.",
    },
  ];

  return (
    <main className="min-h-dvh px-8 pb-32 md:px-16 lg:px-24">
      {/* Header */}
      <section className="pb-16 pt-32 md:pt-40">
        <p
          data-transition-in
          data-transition-in-order="1"
          className="mb-4 font-body text-sm uppercase tracking-[0.2em] text-text-secondary"
        >
          Selected Projects
        </p>
        <h1
          data-transition-in
          data-transition-in-order="2"
          className="font-display text-6xl font-bold text-text md:text-8xl"
        >
          OUR WORK
        </h1>
        <p
          data-transition-in
          data-transition-in-order="3"
          className="mt-6 max-w-xl font-body text-lg leading-relaxed text-text-secondary"
        >
          A curated selection of projects where AI-driven production meets
          cinematic craft. Each piece pushes the boundary of what&apos;s
          possible.
        </p>
      </section>

      {/* Project List */}
      <section className="flex flex-col gap-0">
        {projects.map((project, i) => (
          <article
            key={project.title}
            data-transition-in
            data-transition-in-order={String(i + 4)}
            className="group border-t border-white/10 py-10 md:py-14"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-baseline gap-4">
                  <span className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {project.category}
                  </span>
                  <span className="font-body text-xs text-text-secondary/50">
                    {project.year}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-text transition-colors duration-300 group-hover:text-white md:text-5xl">
                  {project.title}
                </h2>
              </div>
              <p className="max-w-sm font-body text-sm leading-relaxed text-text-secondary md:pt-8">
                {project.description}
              </p>
            </div>
          </article>
        ))}
        <div className="border-t border-white/10" />
      </section>
    </main>
  );
}
