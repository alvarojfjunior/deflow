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

function base58ToBytes(s: string): Uint8Array {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const BASE = 58;
  const zeros = [];
  let i = 0;

  while (i < s.length && s[i] === '1') {
    zeros.push(0);
    i++;
  }

  const bytes: number[] = [0];
  for (; i < s.length; i++) {
    const val = ALPHABET.indexOf(s[i]);
    if (val === -1) {
      throw new Error(`Invalid base58 character: "${s[i]}"`);
    }
    let carry = val;
    for (let j = 0; j < bytes.length; j++) {
      const x = bytes[j] * BASE + carry;
      bytes[j] = x & 0xff;
      carry = x >> 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  const decoded = Uint8Array.from(bytes.reverse());
  if (zeros.length > 0) {
    const res = new Uint8Array(zeros.length + decoded.length);
    res.set(zeros, 0);
    res.set(decoded, zeros.length);
    return res;
  }
  return decoded;
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

  // base58 (Solana): normalmente ~88 chars para 64 bytes
  try {
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    if (base58Regex.test(s)) {
      const buf = base58ToBytes(s);
      if (buf.length === 32 || buf.length === 64) {
        return buf;
      }
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

