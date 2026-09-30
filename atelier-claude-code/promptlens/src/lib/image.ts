export const MAX_SIDE_PX = 1600;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export interface PreparedImage {
  base64: string;
  mimeType: 'image/jpeg';
  width: number;
  height: number;
  previewUrl: string;
}

/** Resizes so the longest side is at most 1600 px and re-encodes as JPEG before upload. */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    throw new Error('Format non pris en charge : choisissez une image JPEG, PNG ou WebP.');
  }
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('Cette image ne peut pas être lue. Essayez un autre fichier.');
  });
  const scale = Math.min(1, MAX_SIDE_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Votre navigateur ne permet pas de préparer l’image.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const previewUrl = canvas.toDataURL('image/jpeg', 0.85);
  return { base64: previewUrl.split(',')[1], mimeType: 'image/jpeg', width, height, previewUrl };
}
