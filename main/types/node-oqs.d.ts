// types/node-oqs.d.ts

declare module "node-oqs" {
  export class KEM {
    constructor(algorithm: string);
    /**
     * Выполняет encapsulation.
     * @param recipientPublicKey публичный ключ получателя
     */
    encapsulate(recipientPublicKey: Buffer): { sharedSecret: Buffer; encapsulatedKey: Buffer };
    /**
     * Выполняет decapsulation.
     * @param encapsulatedKey encapsulatedKey
     * @param recipientPrivateKey приватный ключ получателя
     */
    decapsulate(encapsulatedKey: Buffer, recipientPrivateKey: Buffer): Buffer;
    /**
     * Возвращает длину ciphertext.
     */
    getCiphertextLength(): number;
  }
}