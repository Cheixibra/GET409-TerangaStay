/** The entry's own colours as a band: the visual signature of every card. */
export function PaletteStrip({ colours, vertical = false }: { colours: string[]; vertical?: boolean }) {
  return (
    <span className={vertical ? 'strip vertical' : 'strip'} aria-hidden="true">
      {colours.map((c, i) => (
        <i key={`${c}-${i}`} style={{ background: c }} />
      ))}
    </span>
  );
}
