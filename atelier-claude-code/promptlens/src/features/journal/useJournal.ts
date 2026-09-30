import { useCallback, useEffect, useState } from 'react';
import { repository } from '../../lib/repository';
import type { Entry } from '../../types';

export interface JournalState {
  productions: string[];
  entries: Entry[];
  current: string | null;
  loading: boolean;
  error: string | null;
  setCurrent(name: string): void;
  addProduction(name: string): Promise<boolean>;
  removeProduction(name: string): Promise<void>;
  addEntry(entry: Omit<Entry, 'id' | 'createdAt' | 'production'>): Promise<void>;
  duplicateEntry(id: string): Promise<void>;
  removeEntry(id: string): Promise<void>;
  lastRemoved: Entry | null;
  undoRemove(): Promise<void>;
  dismissUndo(): void;
  clearError(): void;
}

const CURRENT_KEY = 'promptlens.currentProduction';

function message(err: unknown): string {
  return err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
}

export function useJournal(): JournalState {
  const [productions, setProductions] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [current, setCurrentState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<Entry | null>(null);

  const reload = useCallback(async () => {
    const [p, e] = await Promise.all([repository.listProductions(), repository.listEntries()]);
    setProductions(p);
    setEntries(e);
    return p;
  }, []);

  useEffect(() => {
    reload()
      .then((p) => {
        const saved = localStorage.getItem(CURRENT_KEY);
        setCurrentState(saved && p.includes(saved) ? saved : (p[0] ?? null));
      })
      .catch((err: unknown) => setError(message(err)))
      .finally(() => setLoading(false));
  }, [reload]);

  const setCurrent = useCallback((name: string) => {
    setCurrentState(name);
    localStorage.setItem(CURRENT_KEY, name);
  }, []);

  const run = useCallback(
    async (op: () => Promise<unknown>): Promise<boolean> => {
      try {
        await op();
        await reload();
        setError(null);
        return true;
      } catch (err) {
        setError(message(err));
        return false;
      }
    },
    [reload],
  );

  return {
    productions,
    entries,
    current,
    loading,
    error,
    setCurrent,
    addProduction: async (name) => {
      const ok = await run(() => repository.addProduction(name));
      if (ok) setCurrent(name.trim());
      return ok;
    },
    removeProduction: async (name) => {
      await run(() => repository.removeProduction(name));
      if (current === name) {
        const next = productions.find((p) => p !== name) ?? null;
        setCurrentState(next);
        if (next) localStorage.setItem(CURRENT_KEY, next);
        else localStorage.removeItem(CURRENT_KEY);
      }
    },
    addEntry: async (entry) => {
      if (!current) {
        setError('Créez ou choisissez une production avant d’ajouter une entrée.');
        return;
      }
      await run(() => repository.addEntry({ ...entry, production: current }));
    },
    duplicateEntry: async (id) => {
      await run(() => repository.duplicateEntry(id));
    },
    removeEntry: async (id) => {
      const removed = entries.find((e) => e.id === id) ?? null;
      if (await run(() => repository.removeEntry(id))) setLastRemoved(removed);
    },
    lastRemoved,
    undoRemove: async () => {
      if (!lastRemoved) return;
      const entry = lastRemoved;
      setLastRemoved(null);
      await run(() => repository.restoreEntry(entry));
    },
    dismissUndo: () => setLastRemoved(null),
    clearError: () => setError(null),
  };
}
