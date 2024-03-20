import { Encryption } from "../models/encryption.model";

export const encodeToBase64 = (data: any) => btoa(JSON.stringify(data));
export const decodeFromBase64 = (data: any) => JSON.parse(atob(data));

export const generateKey = () => {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return crypto.subtle.importKey('raw', buffer, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
};

export const generateEncryptionHash = async (data: any) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

export const encryptData = async (data: any, key: CryptoKey): Promise<Encryption> => {
  const encoded = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encoded);
  const hash = await generateEncryptionHash(data);

  return { iv, data: new Uint8Array(encryptedData), hash };
};

export const decryptData = async (encryptedData: Encryption, key: CryptoKey): Promise<any> => {

  const iv = hexToUint8Array(encryptedData.iv.toString());
  const dataArray = hexToUint8Array(encryptedData.data.toString());

  const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, dataArray);
  const decodedData = new TextDecoder().decode(decryptedData);
  return decodedData;
};

// Convert a Hexadecimal string to a Uint8Array
function hexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// export const decryptData = async (encryptedData: Encryption, key: CryptoKey): Promise<any> => {
//   const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: encryptedData.iv }, key, encryptedData.data);

//   const decodedData = new TextDecoder().decode(decryptedData);
//   new TextDecoder().decode(decryptedData);
//   const hash = await generateEncryptionHash(decodedData);

//   if (hash !== encryptedData.hash) {
//     throw new Error('Hash Verification Failed');
//   }

//   return decodedData;
// };
