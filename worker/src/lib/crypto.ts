import crypto from 'node:crypto';

export type EncryptedSecret = {
  algo: 'aes-256-gcm';
  version: 1;
  iv: string; // base64
  tag: string; // base64
  ciphertext: string; // base64
};

function getKey(): Buffer {
  const raw = process.env.WALLET_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('Missing WALLET_ENCRYPTION_KEY env variable');
  }

  try {
    const buf = Buffer.from(raw, 'base64');
    if (buf.length === 32) return buf;
  } catch {}
  try {
    const buf = Buffer.from(raw, 'hex');
    if (buf.length === 32) return buf;
  } catch {}
  return crypto.createHash('sha256').update(raw).digest();
}

export function decryptSecret(payload: EncryptedSecret): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

export function parseSecretToUint8Array(plaintext: string): Uint8Array {
  const s = plaintext.trim();

  // JSON array de números: "[12,34,...]"
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr) && arr.every((n) => typeof n === 'number')) {
        return new Uint8Array(arr);
      }
    } catch {}
  }

  // base64: 32 ou 64 bytes
  try {
    const buf = Buffer.from(s, 'base64');
    if (buf.length === 32 || buf.length === 64) {
      return new Uint8Array(buf);
    }
  } catch {}

  // hex: 32 ou 64 bytes
  if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) {
    const buf = Buffer.from(s, 'hex');
    if (buf.length === 32 || buf.length === 64) {
      return new Uint8Array(buf);
    }
  }

  // fallback: bytes do UTF-8 (não recomendado, mas evita crash)
  return new Uint8Array(Buffer.from(s, 'utf8'));
}

