import { ReactNode, useMemo, useState } from "react";
import { CartContext, ItemCart } from "./cart.context";
import { nanoid } from "nanoid";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCart[]>([]);

  const addItem = (item: Omit<ItemCart, "key">) => {
    const nextItem = { ...item, key: nanoid() };
    // @ts-expect-error
    setItems([...items, nextItem]);
  };

  const removeItem = (key: string) => {
    setItems((items) => items.filter((s) => s.key !== key));
  };

  const data_value = useMemo(() => {
    return { items, removeItem, addItem };
  }, [items]);

  return (
    <CartContext.Provider value={data_value}>{children}</CartContext.Provider>
  );
};
