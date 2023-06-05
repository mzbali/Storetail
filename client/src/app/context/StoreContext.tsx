import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Basket } from '../models/basket';

interface StoreContextValue {
  removeItem: (productId: number, quantity: number) => void;
  setBasket: (basket: Basket) => void;
  basket: Basket | null;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const useStoreContext = () => {
  let context = useContext(StoreContext);
  if (context === undefined) {
    throw Error("Oops- we don't seem to be inside a provider");
  }
  return context;
};

export const ContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex((i) => i.productId === productId);
    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1);
    }
    setBasket((prevState) => {
      return { ...prevState!, ...items };
    });
  };

  return (
    <StoreContext.Provider value={{ removeItem, setBasket, basket }}>
      {children}
    </StoreContext.Provider>
  );
};
