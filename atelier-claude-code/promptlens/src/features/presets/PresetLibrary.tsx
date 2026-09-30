import { useMemo, useState } from 'react';
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

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return PRESETS;
    return PRESETS.filter((p) =>
      normalize(
        [p.name, p.shotSize, SHOT_SIZE_LABELS[p.shotSize], p.cameraAngle, p.lighting, p.mood, `${p.focalLengthMm}mm`].join(' '),
      ).includes(q),
    );
  }, [query]);

  return (
    <div>
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
        {results.length} preset{results.length > 1 ? 's' : ''} sur {PRESETS.length}
      </p>
      {results.length === 0 ? (
        <p className="empty">Aucun preset ne correspond à « {query} ». Essayez un cadrage, une focale ou une lumière.</p>
      ) : (
        <ul className="preset-list">
          {results.map((p) => (
            <li key={p.id} className="preset">
              <div className="preset-head">
                <strong>{p.name}</strong>
                <span className="swatches" aria-hidden="true">
                  {p.palette.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
              </div>
              <p className="meta">
                {SHOT_SIZE_LABELS[p.shotSize]}, {p.cameraAngle}, {p.focalLengthMm} mm, {p.lighting}
              </p>
              <p className="prompt">{p.generationPrompt}</p>
              <button type="button" onClick={() => onAdd(p)} disabled={!canAdd}>
                Ajouter au journal
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
