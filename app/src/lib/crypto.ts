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

  // Accept base64, hex, or plain string; normalize to 32 bytes
  try {
    const buf = Buffer.from(raw, 'base64');
    if (buf.length === 32) return buf;
  } catch {}
  try {
    const buf = Buffer.from(raw, 'hex');
    if (buf.length === 32) return buf;
  } catch {}
  // Fallback: derive 32-byte key via SHA-256 of the input
  return crypto.createHash('sha256').update(raw).digest();
}

export function encryptSecret(plaintext: string): EncryptedSecret {
  const key = getKey();
  const iv = crypto.randomBytes(12); // GCM recommended IV length
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    algo: 'aes-256-gcm',
    version: 1,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  };
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

export function redactSecret(_payload: EncryptedSecret | undefined | null) {
  // For API responses: never expose ciphertext; just indicate presence
  return _payload ? { stored: true } : { stored: false };
}