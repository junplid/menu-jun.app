import { createContext } from "react";

export interface ItemCart {
  key: string;
  uuid: string;
  total: number;
  sections?: Record<string, Record<string, number>>;
  qnt: number;
  obs?: string;
}

interface ICartContext {
  addItem: (item: Omit<ItemCart, "key" | "obs">) => void;
  removeItem: (key: string) => void;
  items: ItemCart[];
  payment_method: string;
  setPaymentMethod: (v: string) => void;
  incrementQnt: (key: string, value: number) => void;
  changeObs: (key: string, value: string) => void;
  replaceItem: (
    itemKey: string,
    { qnt, ...item }: Omit<ItemCart, "obs" | "key" | "uuid">,
  ) => void;
  resetCart(): void;
}

export const CartContext = createContext({} as ICartContext);
