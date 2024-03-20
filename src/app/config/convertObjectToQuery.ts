import environment from "src/environments/environment";
import { encodeToBase64 } from "./encryption";

// Convert object into URL params
export const queryParams = (params: any) => {
  if (!params || !Object.keys(params).length) return '';

  const arr = Object.entries(params);
  const strParams = environment.production ? 'data=' + encodeToBase64(params) : arr.map(param => param[0] + '=' + param[1]).join('&');

  return '?' + strParams;
};
