import { defineSecret } from 'firebase-functions/params';
import { onCall, type CallableOptions } from 'firebase-functions/v2/https';
import {
  decodeImage,
  describeWithGemini,
  ImageInputSchema,
  imageParts,
  parseInput,
  TextInputSchema,
  textParts,
} from './describeShot';

/** Read from Secret Manager in production, from functions/.secret.local in the emulator. */
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

const options: CallableOptions = {
  region: 'us-central1',
  secrets: [GEMINI_API_KEY],
  timeoutSeconds: 60,
  memory: '512MiB',
  maxInstances: 5,
  cors: true,
};

export const describeShotFromText = onCall(options, async (request) => {
  const { text } = parseInput(TextInputSchema, request.data);
  return describeWithGemini(GEMINI_API_KEY.value(), textParts(text));
});

export const describeShotFromImage = onCall(options, async (request) => {
  const { imageBase64, mimeType } = parseInput(ImageInputSchema, request.data);
  const b64 = decodeImage(imageBase64);
  return describeWithGemini(GEMINI_API_KEY.value(), imageParts(b64, mimeType));
});
