import { useState } from "react";
import Image from "next/image";
import { MdOutlineRestoreFromTrash } from "react-icons/md";
import { useSetAtom } from "jotai";
import { checkoutAtom } from "@/store/CheckoutAtom";
import { converterStringToEuro } from "@/lib/converterStringToEuro";

type Props = {
  amount: number;
  id: string;
  name: string;
  image: string;
  price: string;
  modal?: boolean;
};

export const CartItem = (props: Props) => {
  const [amount, setAmount] = useState(props.amount);
  const setCheckout = useSetAtom(checkoutAtom);

  const addOne = () => {
    setAmount(amount + 1);

    setCheckout((checkout) => {
      return checkout.map((item) => {
        if (item.id === props.id) {
          return {
            ...item,
            amount: amount + 1,
          };
        }
        return item;
      });
    });
  };

  const deleteOne = () => {
    setAmount(amount - 1);

    setCheckout((checkout) => {
      return checkout.map((item) => {
        if (item.id === props.id) {
          return {
            ...item,
            amount: amount - 1,
          };
        }
        return item;
      });
    });
  };

  const deleteProduct = () => {
    setCheckout((checkout) => {
      return checkout.filter((item) => item.id !== props.id);
    });
  };

  return (
    <div
      className={`flex items-center gap-4 border-2 w-[600px] justify-between rounded-lg ${
        props.modal ? "mb-4 border-white w-full flex-col" : ""
      }`}
    >
      <div className="flex gap-4">
        <Image
          src={`${process.env.URL_BACK}/assets/${props.image}`}
          alt={props.name}
          width={80}
          height={100}
          className="p-2"
        />
        <div>
          <p className="mt-4">{props.name}</p>
          <p>{converterStringToEuro(props.price)}€</p>
        </div>
      </div>
      <div className="flex gap-4 mr-4">
        <button
          className="flex items-center justify-center border-2 w-8 h-8 rounded-md"
          onClick={deleteProduct}
        >
          <MdOutlineRestoreFromTrash />
        </button>

        {/* TODO:cambiar por un input */}
        <div className="flex">
          <button
            disabled={amount === 1}
            className="border-2 w-8 h-8 rounded-l-md"
            onClick={deleteOne}
          >
            -
          </button>
          <div className="w-8 h-8 border-y-2 flex items-center justify-center">
            {amount}
          </div>
          <button className="border-2 w-8 h-8 rounded-r-md" onClick={addOne}>
            +
          </button>
        </div>
        {/* TODO:cambiar por un input */}
      </div>
    </div>
  );
};
