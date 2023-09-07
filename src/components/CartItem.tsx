import { useState } from "react";
import Image from "next/image";
import { MdOutlineRestoreFromTrash } from "react-icons/md";
import { useSetAtom } from "jotai";
import { checkoutAtom } from "@/store/CheckoutAtom";
import { converterStringToEuro } from "@/lib/converterStringToEuro";
import { Button } from "./Button";
import {
  addOne,
  changeAmountInput,
  deleteOne,
  deleteProduct,
} from "@/service/cart";

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

  return (
    <div
      className={`flex items-center gap-4 border-2 lg:w-[600px] justify-between rounded-lg ${
        props.modal ? "mb-4 border-white w-full lg:w-full flex-col" : ""
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
        <Button
          className="flex items-center justify-center border-2 w-8 h-8 rounded-md bg-white text-gray-800 px-0"
          onClick={() =>
            deleteProduct({ id: props.id, amount, setAmount, setCheckout })
          }
        >
          <MdOutlineRestoreFromTrash />
        </Button>

        <div className="flex">
          <Button
            disabled={amount === 1}
            className="bg-white border-2 w-8 h-8 rounded-r-none text-gray-800"
            onClick={() =>
              deleteOne({ id: props.id, amount, setAmount, setCheckout })
            }
          >
            -
          </Button>
          <input
            type="text"
            value={amount}
            onChange={(e) =>
              changeAmountInput({
                value: e.target.value,
                id: props.id,
                amount,
                setAmount,
                setCheckout,
              })
            }
            className="w-8 h-8 border-y-2 flex items-center justify-center text-center"
          />
          <Button
            className="bg-white border-2 w-8 h-8 rounded-l-none text-gray-800"
            onClick={() =>
              addOne({ id: props.id, amount, setAmount, setCheckout })
            }
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
