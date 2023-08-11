import { atom } from "jotai";

export type Checkout = {
  id: string;
  name: string;
  price: string;
  image: string;
  amount: number;
};

export const checkoutAtom = atom<Checkout[]>([]);
