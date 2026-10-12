const P = {
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  rocket: 'M12 2c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10zM9 15l-2 4 3-1M15 15l2 4-3-1M12 8.5h.01',
  pie: 'M12 3v9h9M20 15a9 9 0 11-11-11',
  wallet: 'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 7l12-3v3M17 13.5h.01',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  search: 'M11 5a6 6 0 100 12 6 6 0 000-12zM21 21l-5-5',
  building: 'M4 21V9l8-5 8 5v12M2 21h20M9 21v-6h6v6M9 12h.01M15 12h.01',
  key: 'M8 11a4 4 0 100 8 4 4 0 000-8zM11 12l9-9M16 7l3 3',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  headset: 'M4 14v-2a8 8 0 0116 0v2M3 14h4v6H3zM17 14h4v6h-4zM19 20c0 1.5-2 2-5 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  tool: 'M14 6l4 4-9 9H5v-4zM12 8l4 4',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  bell: 'M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 21h4',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
};
export type IconName = keyof typeof P;
export function Icon({ n }: { n: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}
