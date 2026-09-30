import { useState } from 'react';
import { DescribeTab } from './features/describe/DescribeTab';
import { ImageTab } from './features/image/ImageTab';
import { Journal } from './features/journal/Journal';
import { useJournal } from './features/journal/useJournal';
import { PresetLibrary } from './features/presets/PresetLibrary';
import type { EntrySource, ShotDescription } from './types';

type Tab = 'presets' | 'describe' | 'image';
const TABS: { id: Tab; label: string }[] = [
  { id: 'presets', label: 'Presets' },
  { id: 'describe', label: 'Décrire' },
  { id: 'image', label: 'Image' },
];

export default function App() {
  const journal = useJournal();
  const [tab, setTab] = useState<Tab>('presets');
  const canSave = journal.current !== null;

  const save = (title: string, shot: ShotDescription, source: EntrySource, presetId?: string) =>
    void journal.addEntry({
      title,
      source,
      presetId,
      shotSize: shot.shotSize,
      cameraAngle: shot.cameraAngle,
      focalLengthMm: shot.focalLengthMm,
      lighting: shot.lighting,
      palette: [...shot.palette],
      mood: shot.mood,
      generationPrompt: shot.generationPrompt,
    });

  return (
    <div className="app">
      <header className="app-header">
        <h1>PromptLens</h1>
        <p>Références visuelles pour vos productions vidéo IA</p>
      </header>

      {journal.error && (
        <div className="alert" role="alert">
          <span>{journal.error}</span>
          <button type="button" className="link" onClick={journal.clearError}>
            Fermer
          </button>
        </div>
      )}

      {journal.loading ? (
        <p className="empty">Chargement du journal…</p>
      ) : (
        <main className="layout">
          <section className="panel" aria-labelledby="add-title">
            <h2 id="add-title">Ajouter une entrée</h2>
            <div className="tabs" role="tablist" aria-label="Façon d’ajouter une entrée">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  className={tab === t.id ? 'tab active' : 'tab'}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              {tab === 'presets' && <PresetLibrary canAdd={canSave} onAdd={(p) => save(p.name, p, 'preset', p.id)} />}
              {tab === 'describe' && <DescribeTab canSave={canSave} onSave={(title, shot) => save(title, shot, 'text')} />}
              {tab === 'image' && <ImageTab canSave={canSave} onSave={(title, shot) => save(title, shot, 'image')} />}
            </div>
          </section>
          <Journal journal={journal} />
        </main>
      )}
    </div>
  );
}
