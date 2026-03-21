export interface ClientLogo {
  id: string;
  name: string;
  src: string;
  width: number;
}

// Placeholder logos for development. Replace with real client
// logos from Symmetra Studios. If fewer than 6 real logos exist,
// this section should be hidden entirely (better no logos than
// unrecognizable ones).
export const clientLogos: ClientLogo[] = [
  { id: "logo-1", name: "Client One", src: "/logos/client-1.svg", width: 100 },
  { id: "logo-2", name: "Client Two", src: "/logos/client-2.svg", width: 120 },
  {
    id: "logo-3",
    name: "Client Three",
    src: "/logos/client-3.svg",
    width: 90,
  },
  {
    id: "logo-4",
    name: "Client Four",
    src: "/logos/client-4.svg",
    width: 110,
  },
  {
    id: "logo-5",
    name: "Client Five",
    src: "/logos/client-5.svg",
    width: 100,
  },
  { id: "logo-6", name: "Client Six", src: "/logos/client-6.svg", width: 130 },
  {
    id: "logo-7",
    name: "Client Seven",
    src: "/logos/client-7.svg",
    width: 95,
  },
  {
    id: "logo-8",
    name: "Client Eight",
    src: "/logos/client-8.svg",
    width: 115,
  },
];

// Seeded shuffle for row 2 (deterministic, no layout shift).
// Row 1 uses logos in original order. Row 2 uses this shuffled
// version so the same logos appear in different positions,
// doubling visual variety without halving logos per row.
export const clientLogosShuffled: ClientLogo[] = [
  clientLogos[4],
  clientLogos[1],
  clientLogos[6],
  clientLogos[3],
  clientLogos[0],
  clientLogos[7],
  clientLogos[2],
  clientLogos[5],
];
