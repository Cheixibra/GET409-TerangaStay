import { useState, type ChangeEvent } from 'react';
import { aiErrorMessage, describeFromImage, type AiShot } from '../../lib/firebase';
import { ACCEPTED_TYPES, prepareImage, type PreparedImage } from '../../lib/image';
import type { ShotDescription } from '../../types';
import { ShotReview } from '../review/ShotReview';

interface Props {
  canSave: boolean;
  onSave(title: string, shot: ShotDescription): void;
}

export function ImageTab({ canSave, onSave }: Props) {
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiShot | null>(null);

  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);
    if (!file) return;
    try {
      setImage(await prepareImage(file));
      setFileName(file.name.replace(/\.[^.]+$/, ''));
    } catch (err) {
      setImage(null);
      setError(err instanceof Error ? err.message : 'Image illisible.');
    }
  }

  async function analyse() {
    if (!image) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await describeFromImage(image.base64, image.mimeType));
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ai-form">
      <label className="file">
        Choisir une image (JPEG, PNG ou WebP)
        <input type="file" accept={ACCEPTED_TYPES.join(',')} onChange={pick} />
      </label>
      {image && (
        <figure className="preview">
          <img src={image.previewUrl} alt={`Aperçu de ${fileName}`} />
          <figcaption>
            {image.width} × {image.height} px, redimensionnée avant envoi
          </figcaption>
        </figure>
      )}
      {image && !result && (
        <div className="actions">
          <button type="button" onClick={analyse} disabled={busy}>
            {busy ? 'Analyse…' : 'Analyser l’image'}
          </button>
          {busy && <span className="spinner" role="status" aria-label="Analyse en cours" />}
        </div>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <ShotReview
          initial={result}
          confidence={result.confidence}
          defaultTitle={fileName || 'Plan depuis une image'}
          canSave={canSave}
          onCancel={() => setResult(null)}
          onSave={(title, shot) => {
            onSave(title, shot);
            setResult(null);
            setImage(null);
          }}
        />
      )}
    </div>
  );
}
