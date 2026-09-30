import { useMemo, useState } from 'react';
import { PaletteStrip } from '../../components/PaletteStrip';
import { PRESETS } from '../../data/presets';
import { SHOT_SIZE_LABELS, type Preset } from '../../types';

interface Props {
  canAdd: boolean;
  onAdd(preset: Preset): void;
}

function normalize(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function PresetLibrary({ canAdd, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return PRESETS;
    return PRESETS.filter((p) =>
      normalize(
        [p.name, p.shotSize, SHOT_SIZE_LABELS[p.shotSize], p.cameraAngle, p.lighting, p.mood, `${p.focalLengthMm}mm`].join(' '),
      ).includes(q),
    );
  }, [query]);

  function add(p: Preset) {
    onAdd(p);
    setAdded(p.id);
    window.setTimeout(() => setAdded((id) => (id === p.id ? null : id)), 1400);
  }

  return (
    <div className="library">
      <label className="search">
        <span className="visually-hidden">Rechercher un preset</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher : gros plan, néon, 85mm…"
        />
      </label>
      <p className="hint">
        {results.length === PRESETS.length
          ? `${PRESETS.length} presets`
          : `${results.length} sur ${PRESETS.length} presets`}
        {!canAdd && ' · créez une production pour les ajouter'}
      </p>
      {results.length === 0 ? (
        <div className="empty-state">
          <p>Aucun preset ne correspond à « {query} ».</p>
          <button type="button" className="link" onClick={() => setQuery('')}>
            Effacer la recherche
          </button>
        </div>
      ) : (
        <>
        <ul className={expanded || query ? 'preset-list' : 'preset-list collapsible'}>
          {results.map((p) => (
            <li key={p.id} className="preset">
              <PaletteStrip colours={p.palette} vertical />
              <div className="preset-body">
                <strong>{p.name}</strong>
                <span className="meta">
                  {SHOT_SIZE_LABELS[p.shotSize]} · {p.focalLengthMm} mm · {p.lighting}
                </span>
                <details>
                  <summary>Prompt</summary>
                  <p className="prompt">{p.generationPrompt}</p>
                </details>
              </div>
              <button
                type="button"
                className={added === p.id ? 'add done' : 'add'}
                onClick={() => add(p)}
                disabled={!canAdd}
                aria-label={`Ajouter « ${p.name} » au journal`}
              >
                {added === p.id ? 'Ajouté' : 'Ajouter'}
              </button>
            </li>
          ))}
        </ul>
        {!expanded && !query && (
          <button type="button" className="show-all" onClick={() => setExpanded(true)}>
            Afficher les {PRESETS.length} presets
          </button>
        )}
        </>
      )}
    </div>
  );
}
