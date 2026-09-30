import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import type { ShotDescription } from '../types';

/**
 * Public Firebase web config only (it ships in the bundle by design).
 * The Gemini key never reaches the client: it lives in the Cloud Functions secret.
 * Without a config, the app targets the local emulator with a demo project.
 */
const env = import.meta.env;
const useEmulator = env.DEV && env.VITE_USE_EMULATOR !== 'false';

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-no-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'demo-promptlens',
  appId: env.VITE_FIREBASE_APP_ID || undefined,
});

const functions = getFunctions(app, 'us-central1');
if (useEmulator) connectFunctionsEmulator(functions, '127.0.0.1', 5001);

export interface AiShot extends ShotDescription {
  confidence: number;
}

const fromText = httpsCallable<{ text: string }, AiShot>(functions, 'describeShotFromText', { timeout: 70_000 });
const fromImage = httpsCallable<{ imageBase64: string; mimeType: string }, AiShot>(functions, 'describeShotFromImage', {
  timeout: 70_000,
});

const MESSAGES: Record<string, string> = {
  'functions/invalid-argument': 'La demande n’est pas valide',
  'functions/failed-precondition': 'Le service IA n’est pas configuré : la clé Gemini manque côté serveur.',
  'functions/unavailable': 'Le service IA ne répond pas. Réessayez dans un instant.',
  'functions/internal': 'La réponse de l’IA est inexploitable. Reformulez ou réessayez.',
  'functions/deadline-exceeded': 'L’analyse a pris trop de temps. Réessayez avec une image plus légère.',
  'functions/not-found': 'Fonction introuvable : l’émulateur Functions est-il lancé ?',
};

/** Turns a callable error into a French message for the UI. */
export function aiErrorMessage(err: unknown): string {
  const code = (err as { code?: string }).code ?? '';
  const detail = (err as { message?: string }).message ?? '';
  if (code === 'functions/invalid-argument') return `${MESSAGES[code]} : ${detail}`;
  if (code === 'functions/internal' && /fetch|network/i.test(detail)) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion ou que l’émulateur tourne.';
  }
  return MESSAGES[code] ?? 'Une erreur inattendue est survenue pendant l’analyse.';
}

export async function describeFromText(text: string): Promise<AiShot> {
  return (await fromText({ text })).data;
}

export async function describeFromImage(imageBase64: string, mimeType: string): Promise<AiShot> {
  return (await fromImage({ imageBase64, mimeType })).data;
}
