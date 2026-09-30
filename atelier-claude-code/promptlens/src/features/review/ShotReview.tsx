import { useState, type FormEvent } from 'react';
import { SHOT_SIZE_LABELS, SHOT_SIZES, type ShotDescription, type ShotSize } from '../../types';

interface Props {
  initial: ShotDescription;
  confidence?: number;
  defaultTitle: string;
  canSave: boolean;
  onSave(title: string, shot: ShotDescription): void;
  onCancel(): void;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Editable card shown after an AI analysis, before the entry is saved to the journal. */
export function ShotReview({ initial, confidence, defaultTitle, canSave, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [shot, setShot] = useState<ShotDescription>(initial);
  const [palette, setPalette] = useState(initial.palette.join(', '));
  const colours = palette.split(/[\s,]+/).filter(Boolean);
  const paletteOk = colours.length > 0 && colours.every((c) => HEX.test(c));

  const set = <K extends keyof ShotDescription>(key: K, value: ShotDescription[K]) =>
    setShot((s) => ({ ...s, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!paletteOk) return;
    onSave(title.trim() || defaultTitle, { ...shot, palette: colours });
  }

  return (
    <form className="review" onSubmit={submit}>
      <div className="review-head">
        <h3>Fiche proposée</h3>
        {confidence !== undefined && <span className="tag">Confiance {Math.round(confidence * 100)} %</span>}
      </div>
      <label>
        Titre
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <div className="grid-2">
        <label>
          Cadrage
          <select value={shot.shotSize} onChange={(e) => set('shotSize', e.target.value as ShotSize)}>
            {SHOT_SIZES.map((s) => (
              <option key={s} value={s}>
                {SHOT_SIZE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Focale (mm)
          <input
            type="number"
            min={8}
            max={800}
            value={shot.focalLengthMm}
            onChange={(e) => set('focalLengthMm', Number(e.target.value))}
          />
        </label>
        <label>
          Angle
          <input value={shot.cameraAngle} onChange={(e) => set('cameraAngle', e.target.value)} />
        </label>
        <label>
          Ambiance
          <input value={shot.mood} onChange={(e) => set('mood', e.target.value)} />
        </label>
      </div>
      <label>
        Lumière
        <input value={shot.lighting} onChange={(e) => set('lighting', e.target.value)} />
      </label>
      <label>
        Palette (codes #RRGGBB séparés par des virgules)
        <input value={palette} onChange={(e) => setPalette(e.target.value)} aria-invalid={!paletteOk} />
        <span className="swatches" aria-hidden="true">
          {colours.filter((c) => HEX.test(c)).map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        {!paletteOk && <span className="field-error">Chaque couleur doit être au format #RRGGBB.</span>}
      </label>
      <label>
        Prompt de génération (anglais)
        <textarea rows={4} value={shot.generationPrompt} onChange={(e) => set('generationPrompt', e.target.value)} />
      </label>
      <div className="actions">
        <button type="submit" disabled={!canSave || !paletteOk}>
          Ajouter au journal
        </button>
        <button type="button" className="link" onClick={onCancel}>
          Annuler
        </button>
      </div>
      {!canSave && <p className="hint">Créez ou choisissez une production pour enregistrer cette fiche.</p>}
    </form>
  );
}
