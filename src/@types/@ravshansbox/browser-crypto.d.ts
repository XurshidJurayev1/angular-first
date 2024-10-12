// src/@types/ravshansbox-browser-crypto.d.ts
declare module '@ravshansbox/browser-crypto' {
  export function createECDH(curve: string): {
    generateKeys: (encoding?: string) => string;
    computeSecret: (other_public_key: string, input_encoding?: string, output_encoding?: string) => string;
    getPrivateKey: (encoding?: string) => string;
    getPublicKey: (encoding?: string) => string;
  };
}
