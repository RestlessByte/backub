'use client';

import { kyber512 } from '@pqcrystals/kyber';
import argon2 from 'argon2';
import crypto from 'crypto';

interface ICryptoConfig {
  ivLength: number;
  saltLength: number;
  encryptionAlgorithm: string;
}

type ICryptoKey = string[];

// Конфигурация
const CONFIG: ICryptoConfig = {
  ivLength: 120, // Оптимальная длина для AES-GCM
  saltLength: 120, // Достаточная длина соли
  encryptionAlgorithm: 'aes-256-gcm', // Алгоритм шифрования
};

// Генерация соли
const generateSalt = (): Buffer => crypto.randomBytes(CONFIG.saltLength);

// Генерация ключа с использованием Argon2
const deriveKey = async (password: string, salt: Buffer): Promise<Buffer> => {
  const hash = await argon2.hash(password, {
    salt: salt.toString('base64'),
    type: argon2.argon2id,
    hashLength: 32, // 256 бит для AES-256
  });
  return Buffer.from(hash.slice(0, 32), 'base64');
};

// Генерация ключевой пары для Kyber
const generateKyberKeyPair = (): { publicKey: Uint8Array; privateKey: Uint8Array } => {
  const keyPair = kyber512.keypair();
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
};

// Шифрование данных с использованием AES-GCM и добавлением HMAC
export const QuantiumEncryptedDataClient = async (data: any, password: string): Promise<string> => {
  if (data === undefined || data === null) {
    throw new Error('Данные для шифрования отсутствуют.');
  }

  const salt = generateSalt();
  const iv = crypto.randomBytes(CONFIG.ivLength);
  const key = await deriveKey(password, salt);

  // Создаем шифр AES-GCM
  const cipher = crypto.createCipheriv(CONFIG.encryptionAlgorithm, key.slice(0, 32), iv) as crypto.CipherGCM;
  const serializedData = JSON.stringify(data);
  const encryptedContent = Buffer.concat([cipher.update(serializedData, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Вычисляем HMAC для проверки целостности
  const hmac = crypto.createHmac('sha512', key.slice(32)).update(encryptedContent).digest();

  // Формируем результат: salt + iv + authTag + encryptedContent + hmac
  return Buffer.concat([salt, iv, authTag, encryptedContent, hmac]).toString('base64');
};

// Дешифрование данных с проверкой HMAC
export const QuantiumDecryptedDataClient = async (encryptedData: string, password: string): Promise<any> => {
  if (!encryptedData) {
    throw new Error('Данные для дешифровки отсутствуют или некорректны.');
  }

  const bufferData = Buffer.from(encryptedData, 'base64');
  const salt = bufferData.slice(0, CONFIG.saltLength);
  const iv = bufferData.slice(CONFIG.saltLength, CONFIG.saltLength + CONFIG.ivLength);
  const authTag = bufferData.slice(
    CONFIG.saltLength + CONFIG.ivLength,
    CONFIG.saltLength + CONFIG.ivLength + 16
  );
  const encryptedContent = bufferData.slice(
    CONFIG.saltLength + CONFIG.ivLength + 16,
    bufferData.length - 64 // SHA-512 длина HMAC
  );
  const receivedHmac = bufferData.slice(bufferData.length - 64);

  const key = await deriveKey(password, salt);

  // Проверяем HMAC
  const calculatedHmac = crypto.createHmac('sha512', key.slice(32)).update(encryptedContent).digest();
  if (!crypto.timingSafeEqual(calculatedHmac, receivedHmac)) {
    throw new Error('Ошибка проверки целостности данных.');
  }

  // Создаем дешифр AES-GCM
  const decipher = crypto.createDecipheriv(CONFIG.encryptionAlgorithm, key.slice(0, 32), iv) as crypto.DecipherGCM;
  decipher.setAuthTag(authTag);

  try {
    const decryptedContent = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
    return JSON.parse(decryptedContent.toString('utf8'));
  } catch (error) {
    throw new Error('Не удалось расшифровать данные. Проверьте ключи или целостность данных.');
  }
};

// Пример использования Kyber для обмена ключами
export const kyberEncrypt = async (publicKey: Uint8Array, plaintext: string): Promise<{ ciphertext: Uint8Array; sharedSecret: Uint8Array }> => {
  const [ciphertext, sharedSecret] = kyber512.encaps(publicKey);
  return { ciphertext, sharedSecret };
};

export const kyberDecrypt = async (privateKey: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array> => {
  return kyber512.decaps(privateKey, ciphertext);
};