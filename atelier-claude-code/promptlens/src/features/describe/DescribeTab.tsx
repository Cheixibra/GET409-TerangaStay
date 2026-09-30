import { useState, type FormEvent } from 'react';
import { aiErrorMessage, describeFromText, type AiShot } from '../../lib/firebase';
import type { ShotDescription } from '../../types';
import { ShotReview } from '../review/ShotReview';

interface Props {
  canSave: boolean;
  onSave(title: string, shot: ShotDescription): void;
}

export function DescribeTab({ canSave, onSave }: Props) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiShot | null>(null);

  async function analyse(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setResult(await describeFromText(text.trim()));
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <ShotReview
        initial={result}
        confidence={result.confidence}
        defaultTitle={text.trim().slice(0, 60)}
        canSave={canSave}
        onCancel={() => setResult(null)}
        onSave={(title, shot) => {
          onSave(title, shot);
          setResult(null);
          setText('');
        }}
      />
    );
  }

  return (
    <form className="ai-form" onSubmit={analyse}>
      <label>
        Décrivez le plan
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex. Gros plan d’une danseuse sous un projecteur unique, fond noir, poussière dans le faisceau"
          maxLength={2000}
        />
      </label>
      <div className="actions">
        <button type="submit" disabled={busy || text.trim().length < 3}>
          {busy ? 'Analyse…' : 'Analyser la description'}
        </button>
        {busy && <span className="spinner" role="status" aria-label="Analyse en cours" />}
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
