import type { Entry } from '../types';

/**
 * Storage boundary for the journal. Components only talk to this interface,
 * so the localStorage implementation can be replaced by Firestore later.
 * Methods are async on purpose: a remote store will be.
 */
export interface JournalRepository {
  listProductions(): Promise<string[]>;
  addProduction(name: string): Promise<void>;
  removeProduction(name: string): Promise<void>;
  listEntries(): Promise<Entry[]>;
  addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Promise<Entry>;
  duplicateEntry(id: string): Promise<Entry>;
  removeEntry(id: string): Promise<void>;
}

interface Snapshot {
  version: 1;
  productions: string[];
  entries: Entry[];
}

const STORAGE_KEY = 'promptlens.journal.v1';

function emptySnapshot(): Snapshot {
  return { version: 1, productions: [], entries: [] };
}

function isSnapshot(value: unknown): value is Snapshot {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<Snapshot>;
  return v.version === 1 && Array.isArray(v.productions) && Array.isArray(v.entries);
}

export class LocalStorageJournalRepository implements JournalRepository {
  private readonly storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
  }

  private read(): Snapshot {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return emptySnapshot();
      const parsed: unknown = JSON.parse(raw);
      return isSnapshot(parsed) ? parsed : emptySnapshot();
    } catch {
      return emptySnapshot();
    }
  }

  private write(snapshot: Snapshot): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  async listProductions(): Promise<string[]> {
    return this.read().productions;
  }

  async addProduction(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Le nom de la production est vide.');
    const snap = this.read();
    if (snap.productions.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`La production « ${trimmed} » existe déjà.`);
    }
    snap.productions.push(trimmed);
    this.write(snap);
  }

  async removeProduction(name: string): Promise<void> {
    const snap = this.read();
    snap.productions = snap.productions.filter((p) => p !== name);
    snap.entries = snap.entries.filter((e) => e.production !== name);
    this.write(snap);
  }

  async listEntries(): Promise<Entry[]> {
    return this.read().entries;
  }

  async addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Promise<Entry> {
    const snap = this.read();
    if (!snap.productions.includes(entry.production)) {
      throw new Error(`Production inconnue : « ${entry.production} ».`);
    }
    const saved: Entry = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    snap.entries.unshift(saved);
    this.write(snap);
    return saved;
  }

  async duplicateEntry(id: string): Promise<Entry> {
    const snap = this.read();
    const index = snap.entries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Entrée introuvable.');
    const copy: Entry = {
      ...snap.entries[index],
      palette: [...snap.entries[index].palette],
      id: crypto.randomUUID(),
      title: `${snap.entries[index].title} (copie)`,
      createdAt: new Date().toISOString(),
    };
    snap.entries.splice(index, 0, copy);
    this.write(snap);
    return copy;
  }

  async removeEntry(id: string): Promise<void> {
    const snap = this.read();
    snap.entries = snap.entries.filter((e) => e.id !== id);
    this.write(snap);
  }
}

export const repository: JournalRepository = new LocalStorageJournalRepository();
