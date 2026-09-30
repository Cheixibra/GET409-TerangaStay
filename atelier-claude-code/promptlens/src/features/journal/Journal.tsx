import { useState, type FormEvent } from 'react';
import { SHOT_SIZE_LABELS } from '../../types';
import type { JournalState } from './useJournal';

const SOURCE_LABELS = { preset: 'Preset', text: 'Description', image: 'Image' } as const;

export function Journal({ journal }: { journal: JournalState }) {
  const [name, setName] = useState('');
  const { productions, entries, current } = journal;
  const count = (p: string) => entries.filter((e) => e.production === p).length;
  const visible = entries.filter((e) => e.production === current);

  async function create(e: FormEvent) {
    e.preventDefault();
    if (await journal.addProduction(name)) setName('');
  }

  return (
    <section className="panel" aria-labelledby="journal-title">
      <h2 id="journal-title">Journal</h2>

      <form className="new-production" onSubmit={create}>
        <label>
          <span>Nouvelle production</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Clip Saint-Louis" />
        </label>
        <button type="submit" disabled={!name.trim()}>
          Créer
        </button>
      </form>

      {productions.length === 0 ? (
        <p className="empty">Créez une première production pour commencer à y ajouter des plans.</p>
      ) : (
        <div className="productions" role="tablist" aria-label="Productions">
          {productions.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={p === current}
              className={p === current ? 'production active' : 'production'}
              onClick={() => journal.setCurrent(p)}
            >
              {p} <span className="count">{count(p)}</span>
            </button>
          ))}
        </div>
      )}

      {current && (
        <>
          <div className="production-bar">
            <p>
              <strong>{current}</strong> : {visible.length} entrée{visible.length > 1 ? 's' : ''}
            </p>
            <button
              type="button"
              className="link danger"
              onClick={() => {
                if (confirm(`Supprimer la production « ${current} » et ses ${visible.length} entrées ?`)) {
                  void journal.removeProduction(current);
                }
              }}
            >
              Supprimer la production
            </button>
          </div>
          {visible.length === 0 ? (
            <p className="empty">Aucune entrée dans « {current} ». Ajoutez un preset depuis la bibliothèque.</p>
          ) : (
            <ul className="entries">
              {visible.map((e) => (
                <li key={e.id} className="entry">
                  <div className="entry-head">
                    <strong>{e.title}</strong>
                    <span className="tag">{SOURCE_LABELS[e.source]}</span>
                  </div>
                  <p className="meta">
                    {SHOT_SIZE_LABELS[e.shotSize]}, {e.cameraAngle}, {e.focalLengthMm} mm, {e.lighting}
                  </p>
                  <p className="prompt">{e.generationPrompt}</p>
                  <div className="actions">
                    <button type="button" className="link" onClick={() => void journal.duplicateEntry(e.id)}>
                      Dupliquer
                    </button>
                    <button type="button" className="link danger" onClick={() => void journal.removeEntry(e.id)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
