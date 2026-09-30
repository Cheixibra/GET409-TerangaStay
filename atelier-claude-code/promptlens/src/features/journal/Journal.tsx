import { useState, type FormEvent } from 'react';
import { PaletteStrip } from '../../components/PaletteStrip';
import { SHOT_SIZE_LABELS, SHOT_SIZES, type ShotSize } from '../../types';
import type { JournalState } from './useJournal';

const SOURCE_LABELS = { preset: 'Preset', text: 'Description', image: 'Image' } as const;

export function Journal({ journal }: { journal: JournalState }) {
  const [name, setName] = useState('');
  const [filter, setFilter] = useState<ShotSize | 'all'>('all');
  const { productions, entries, current } = journal;
  const count = (p: string) => entries.filter((e) => e.production === p).length;
  const inProduction = entries.filter((e) => e.production === current);
  const sizesPresent = SHOT_SIZES.filter((s) => inProduction.some((e) => e.shotSize === s));
  const activeFilter = filter !== 'all' && sizesPresent.includes(filter) ? filter : 'all';
  const visible = activeFilter === 'all' ? inProduction : inProduction.filter((e) => e.shotSize === activeFilter);
  const coverage = Math.round((sizesPresent.length / SHOT_SIZES.length) * 100);
  const missing = SHOT_SIZES.filter((s) => !sizesPresent.includes(s));

  async function create(e: FormEvent) {
    e.preventDefault();
    if (await journal.addProduction(name)) {
      setName('');
      setFilter('all');
    }
  }

  return (
    <section className="panel journal" aria-labelledby="journal-title">
      <div className="panel-head">
        <h2 id="journal-title">Journal</h2>
        {productions.length > 0 && (
          <span className="hint">
            {entries.length} plan{entries.length > 1 ? 's' : ''} · {productions.length} production
            {productions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <form className="new-production" onSubmit={create}>
        <label>
          <span className="visually-hidden">Nom de la nouvelle production</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nouvelle production, ex. Clip Saint-Louis" />
        </label>
        <button type="submit" disabled={!name.trim()}>
          Créer
        </button>
      </form>

      {productions.length === 0 ? (
        <div className="empty-state">
          <p>
            <strong>Aucune production pour l’instant.</strong>
          </p>
          <p>Donnez un nom à votre projet ci-dessus, puis ajoutez-y des plans depuis les presets, une description ou une image.</p>
        </div>
      ) : (
        <div className="productions" role="tablist" aria-label="Productions">
          {productions.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={p === current}
              className={p === current ? 'production active' : 'production'}
              onClick={() => {
                journal.setCurrent(p);
                setFilter('all');
              }}
            >
              {p} <span className="count">{count(p)}</span>
              <span className="mini-bar" aria-hidden="true">
                <i
                  style={{
                    width: `${(SHOT_SIZES.filter((s) => entries.some((e) => e.production === p && e.shotSize === s)).length / SHOT_SIZES.length) * 100}%`,
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      )}

      {current && (
        <>
          <div className="progress">
            <div className="progress-label">
              <span>
                Couverture des cadrages : <strong>{sizesPresent.length}/{SHOT_SIZES.length}</strong>
              </span>
              <span className="hint">
                {missing.length === 0
                  ? 'Tous les cadrages sont couverts'
                  : `Manque : ${missing.slice(0, 3).map((s) => SHOT_SIZE_LABELS[s].toLowerCase()).join(', ')}${missing.length > 3 ? '…' : ''}`}
              </span>
            </div>
            <div
              className="bar"
              role="progressbar"
              aria-label={`Couverture des cadrages de ${current}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={coverage}
            >
              <i style={{ width: `${coverage}%` }} />
            </div>
          </div>

          {journal.lastRemoved && (
            <div className="undo" role="status">
              <span>« {journal.lastRemoved.title} » supprimé.</span>
              <button type="button" className="link" onClick={() => void journal.undoRemove()}>
                Annuler
              </button>
              <button type="button" className="link muted" onClick={journal.dismissUndo} aria-label="Masquer">
                ✕
              </button>
            </div>
          )}

          {sizesPresent.length > 1 && (
            <div className="filters" role="group" aria-label="Filtrer par cadrage">
              <button type="button" className={activeFilter === 'all' ? 'chip on' : 'chip'} onClick={() => setFilter('all')}>
                Tous <span className="count">{inProduction.length}</span>
              </button>
              {sizesPresent.map((s) => (
                <button key={s} type="button" className={activeFilter === s ? 'chip on' : 'chip'} onClick={() => setFilter(s)}>
                  {SHOT_SIZE_LABELS[s]} <span className="count">{inProduction.filter((e) => e.shotSize === s).length}</span>
                </button>
              ))}
            </div>
          )}

          {inProduction.length === 0 ? (
            <div className="empty-state">
              <p>
                <strong>« {current} » est vide.</strong>
              </p>
              <p>Ajoutez un premier plan avec le bouton Ajouter d’un preset, ou décrivez-le dans l’onglet Décrire.</p>
            </div>
          ) : (
            <ul className="entries">
              {visible.map((e) => (
                <li key={e.id} className="entry">
                  <PaletteStrip colours={e.palette} />
                  <div className="entry-body">
                    <div className="entry-head">
                      <strong>{e.title}</strong>
                      <span className="tag">{SOURCE_LABELS[e.source]}</span>
                    </div>
                    <ul className="specs" aria-label="Caractéristiques">
                      <li>{SHOT_SIZE_LABELS[e.shotSize]}</li>
                      <li>{e.focalLengthMm} mm</li>
                      <li>{e.cameraAngle}</li>
                    </ul>
                    <p className="meta">
                      {e.lighting} · {e.mood}
                    </p>
                    <p className="prompt clamp">{e.generationPrompt}</p>
                    <div className="actions">
                      <button type="button" className="link" onClick={() => void journal.duplicateEntry(e.id)}>
                        Dupliquer
                      </button>
                      <button type="button" className="link danger" onClick={() => void journal.removeEntry(e.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="production-foot">
            <button
              type="button"
              className="link danger"
              onClick={() => {
                if (confirm(`Supprimer la production « ${current} » et ses ${inProduction.length} entrées ?`)) {
                  void journal.removeProduction(current);
                }
              }}
            >
              Supprimer la production « {current} »
            </button>
          </div>
        </>
      )}
    </section>
  );
}
