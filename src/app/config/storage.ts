import environment from "src/environments/environment";
import { decodeFromBase64, encodeToBase64 } from "./encryption";

const production = environment.production;

export const storage = {
  set: (key: string, data: any) => production ? localStorage.setItem(encodeToBase64(key), encodeToBase64(data)) : localStorage.setItem(key, JSON.stringify(data)),
  get: (key: string) => production ? localStorage.getItem(encodeToBase64(key)) : localStorage.getItem(key),
  remove: (key: string) => production ? localStorage.removeItem(encodeToBase64(key)) : localStorage.removeItem(key),
  decode: (data: any) => production ? decodeFromBase64(data) : JSON.parse(data)
};
