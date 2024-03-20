import { Merchant } from "../models/merchant.model";
import { storage } from "./storage";

export const getMerchant = (): Merchant | null => {
  const merchantData = storage.get('merchant');
  if (!merchantData) return null;
  return storage.decode(merchantData) as Merchant;
};
