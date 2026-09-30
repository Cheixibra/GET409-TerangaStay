export type ShotSize =
  | 'extreme wide'
  | 'wide'
  | 'full'
  | 'medium'
  | 'medium close-up'
  | 'close-up'
  | 'extreme close-up';

export const SHOT_SIZES: readonly ShotSize[] = [
  'extreme wide',
  'wide',
  'full',
  'medium',
  'medium close-up',
  'close-up',
  'extreme close-up',
];

/** French labels for the UI; values stay in English in the data. */
export const SHOT_SIZE_LABELS: Record<ShotSize, string> = {
  'extreme wide': 'Très grand plan large',
  wide: 'Plan large',
  full: 'Plan d’ensemble',
  medium: 'Plan moyen',
  'medium close-up': 'Plan rapproché',
  'close-up': 'Gros plan',
  'extreme close-up': 'Très gros plan',
};

/** The fields that describe a shot, shared by presets, AI results and entries. */
export interface ShotDescription {
  shotSize: ShotSize;
  cameraAngle: string;
  focalLengthMm: number;
  lighting: string;
  palette: string[];
  mood: string;
  generationPrompt: string;
}

export interface Preset extends ShotDescription {
  id: string;
  name: string;
}

export type EntrySource = 'preset' | 'text' | 'image';

export interface Entry extends ShotDescription {
  id: string;
  production: string;
  title: string;
  source: EntrySource;
  presetId?: string;
  createdAt: string;
}
