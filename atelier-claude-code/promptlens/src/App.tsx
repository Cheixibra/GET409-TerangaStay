import { Journal } from './features/journal/Journal';
import { useJournal } from './features/journal/useJournal';
import { PresetLibrary } from './features/presets/PresetLibrary';

export default function App() {
  const journal = useJournal();

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
          <PresetLibrary
            canAdd={journal.current !== null}
            onAdd={(p) =>
              void journal.addEntry({
                title: p.name,
                source: 'preset',
                presetId: p.id,
                shotSize: p.shotSize,
                cameraAngle: p.cameraAngle,
                focalLengthMm: p.focalLengthMm,
                lighting: p.lighting,
                palette: [...p.palette],
                mood: p.mood,
                generationPrompt: p.generationPrompt,
              })
            }
          />
          <Journal journal={journal} />
        </main>
      )}
    </div>
  );
}
