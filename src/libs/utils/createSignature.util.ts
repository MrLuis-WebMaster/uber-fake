import * as crypto from 'crypto';
export const createSignature = async (stringFormated: string) => {
  const encondedText = new TextEncoder().encode(stringFormated);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return signature;
};
