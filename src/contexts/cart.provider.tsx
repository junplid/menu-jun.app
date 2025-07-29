import { ReactNode, useMemo, useState } from "react";
import { CartContext, ItemCart } from "./cart.context";
// import { nanoid } from "nanoid";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCart[]>([]);

  const addItem = (item: ItemCart) => {
    const nextItem = { ...item };
    setItems([...items, nextItem]);
  };

  const removeItem = (key: string) => {
    setItems((items) => items.filter((s) => s.key !== key));
  };

  const incrementQnt = (key: string, value: number) => {
    const itemIndex = items.findIndex((i) => i.key === key);
    if (itemIndex >= 0) {
      const total = items[itemIndex].qnt + value;
      if (total === 0) {
        setItems((prev) => prev.filter((item) => item.key !== key));
      } else {
        setItems((prev) =>
          prev.map((i) => {
            if (i.key === key) i.qnt = total;
            return i;
          })
        );
      }
    }
  };

  const data_value = useMemo(() => {
    return { items, removeItem, addItem, incrementQnt };
  }, [items]);

  return (
    <CartContext.Provider value={data_value}>{children}</CartContext.Provider>
  );
};
