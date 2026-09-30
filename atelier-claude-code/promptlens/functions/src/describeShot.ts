import { createPartFromBase64, createPartFromText, GoogleGenAI, type Part } from '@google/genai';
import { HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';

/** Alias documented by the official @google/genai README; always points at the current Flash model. */
export const GEMINI_MODEL = 'gemini-flash-latest';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export const SHOT_SIZES = [
  'extreme wide',
  'wide',
  'full',
  'medium',
  'medium close-up',
  'close-up',
  'extreme close-up',
] as const;

/** Mirrors ShotDescription in src/types.ts, plus the model's confidence. */
export const ShotDescriptionSchema = z.object({
  shotSize: z.enum(SHOT_SIZES),
  cameraAngle: z.string().min(1).max(60),
  focalLengthMm: z.number().int().min(8).max(800),
  lighting: z.string().min(1).max(120),
  palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(1).max(8),
  mood: z.string().min(1).max(60),
  generationPrompt: z.string().min(10).max(1200),
  confidence: z.number().min(0).max(1),
});
export type ShotDescriptionResult = z.infer<typeof ShotDescriptionSchema>;

export const TextInputSchema = z.object({
  text: z.string().trim().min(3, 'Describe the shot in at least 3 characters.').max(2000),
});

export const ImageInputSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});

const RESPONSE_JSON_SCHEMA = z.toJSONSchema(ShotDescriptionSchema, { target: 'draft-2020-12' });

const INSTRUCTIONS = `You are a director of photography. Describe the shot as structured data.
- shotSize: one of ${SHOT_SIZES.join(', ')}.
- cameraAngle: e.g. eye level, high angle, low angle, bird's-eye, dutch, over-the-shoulder.
- focalLengthMm: an integer full-frame equivalent in millimetres.
- lighting: the lighting setup in a few words.
- palette: 3 to 5 dominant colours as #RRGGBB.
- mood: one or two words, in French.
- generationPrompt: one English prompt for a video generation model, reusing every field.
- confidence: 0 to 1, how sure you are given the input.
Answer with JSON only.`;

/** Parses and validates the request payload, throwing a client-facing error. */
export function parseInput<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpsError('invalid-argument', result.error.issues.map((i) => i.message).join('; '));
  }
  return result.data;
}

/** Strips an optional data-URL prefix and enforces the 4 MB limit. */
export function decodeImage(imageBase64: string): string {
  const b64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) {
    throw new HttpsError('invalid-argument', 'imageBase64 is not valid base64.');
  }
  const bytes = Math.floor((b64.length * 3) / 4) - (b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0);
  if (bytes > MAX_IMAGE_BYTES) {
    throw new HttpsError('invalid-argument', `Image is ${(bytes / 1048576).toFixed(1)} MB; the limit is 4 MB.`);
  }
  return b64;
}

/** Calls Gemini with a JSON schema and validates the answer. Never logs the key or the payload. */
export async function describeWithGemini(apiKey: string, parts: Part[]): Promise<ShotDescriptionResult> {
  if (!apiKey) {
    throw new HttpsError('failed-precondition', 'GEMINI_API_KEY is not set on the server.');
  }
  const ai = new GoogleGenAI({ apiKey });
  let raw: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [createPartFromText(INSTRUCTIONS), ...parts] }],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_JSON_SCHEMA,
        temperature: 0.4,
      },
    });
    raw = response.text;
  } catch (err) {
    console.error('Gemini call failed', { model: GEMINI_MODEL, error: (err as Error).message });
    throw new HttpsError('unavailable', 'The AI service did not answer. Try again in a moment.');
  }
  let json: unknown;
  try {
    json = JSON.parse(raw ?? '');
  } catch {
    throw new HttpsError('internal', 'The AI answer was not valid JSON.');
  }
  const parsed = ShotDescriptionSchema.safeParse(json);
  if (!parsed.success) {
    console.warn('Gemini JSON failed validation', { issues: parsed.error.issues.length });
    throw new HttpsError('internal', 'The AI answer did not match the expected shot format.');
  }
  return parsed.data;
}

export function textParts(text: string): Part[] {
  return [createPartFromText(`Shot description from the user:\n${text}`)];
}

export function imageParts(b64: string, mimeType: string): Part[] {
  return [createPartFromText('Describe the shot in this frame.'), createPartFromBase64(b64, mimeType)];
}
