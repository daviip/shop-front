import { Product } from "@/pages";
import { Checkout, checkoutAtom } from "@/store/CheckoutAtom";
import { getCookie } from "cookies-next";
import { Atom, useSetAtom } from "jotai";
import { Dispatch, SetStateAction } from "react";

type Props = {
  id?: string;
  amount?: number;
  checkout?: Checkout[];
  setAmount?: Dispatch<SetStateAction<number>>;
  setCheckout?: any;
  value?: string;
  data?: Product;
};

type NewOrder = {
  totalPrice: () => string;
  checkout: Checkout[];
  setCheckout: (item: Checkout[]) => void;
};

const addOne = (props: Props) => {
  if (!props.setAmount || !props.amount || !props.setCheckout) {
    return;
  }

  props.setAmount(props.amount + 1);

  props.setCheckout((checkout: Checkout[]) => {
    return checkout.map((item) => {
      if (item.id === props.id) {
        return {
          ...item,
          amount: (props.amount ?? 0) + 1,
        };
      }
      return item;
    });
  });
};

const deleteOne = (props: Props) => {
  if (!props.setAmount || !props.amount || !props.setCheckout) {
    return;
  }

  props.setAmount(props.amount - 1);

  props.setCheckout((checkout: Checkout[]) => {
    return checkout.map((item) => {
      if (item.id === props.id) {
        return {
          ...item,
          amount: (props.amount ?? 0) - 1,
        };
      }
      return item;
    });
  });
};

const changeAmountInput = (props: Props) => {
  if (!props.setAmount || !props.amount || !props.setCheckout) {
    return;
  }

  if (Number(props.value) === 0 || props.value === "") {
    props.setAmount(1);
    return;
  }

  if (isNaN(Number(props.value))) {
    return;
  }

  props.setAmount(Number(props.value));

  props.setCheckout((checkout: Checkout[]) => {
    return checkout.map((item) => {
      if (item.id === props.id) {
        return {
          ...item,
          amount: Number(props.value),
        };
      }
      return item;
    });
  });
};

const addProduct = (props: Props) => {
  if (!props.data || !props.data.id || !props.checkout) {
    return;
  }

  let newCheckout: Checkout[] = [];

  if (props.checkout?.length > 0) {
    if (props.checkout.some((item) => item.id === props.data?.id)) {
      newCheckout = props.checkout.map((item) => {
        if (item.id === props.data?.id) {
          return {
            ...item,
            amount: item.amount + 1,
          };
        }
        return item;
      });

      props.setCheckout(newCheckout);

      localStorage.setItem(
        getCookie("user")?.toString() ?? "",
        JSON.stringify(newCheckout)
      );
    } else {
      newCheckout = [
        ...props.checkout,
        {
          id: props.data.id,
          name: props.data.name,
          price: props.data.price,
          image: props.data.image,
          amount: 1,
        },
      ];
      props.setCheckout(newCheckout);

      localStorage.setItem(
        getCookie("user")?.toString() ?? "",
        JSON.stringify(newCheckout)
      );
    }
  } else {
    newCheckout = [
      {
        id: props.data.id,
        name: props.data.name,
        price: props.data.price,
        image: props.data.image,
        amount: 1,
      },
    ];

    props.setCheckout(newCheckout);

    localStorage.setItem(
      getCookie("user")?.toString() ?? "",
      JSON.stringify(newCheckout)
    );
  }
};

const deleteProduct = (props: Props) => {
  if (!props.setCheckout) {
    return;
  }

  props.setCheckout((checkout: Checkout[]) => {
    return checkout.filter((item) => item.id !== props.id);
  });
};

const newOrder = async (props: NewOrder) => {
  const user = getCookie("user");

  const res = await fetch("/api/order", {
    method: "POST",
    body: JSON.stringify({
      user: user?.toString(),
      price: props.totalPrice(),
    }),
  });

  const { ok, id: orderId } = await res.json();

  if (!ok) {
    return;
  }

  props.checkout.map(async (item) => {
    await fetch("/api/order-detail", {
      method: "POST",
      body: JSON.stringify({
        amount: item.amount,
        price_for_one: item.price,
        order: orderId,
        product: item.id,
      }),
    });
  });

  props.setCheckout([]);
  localStorage.removeItem(user?.toString() ?? "");
};

export {
  addOne,
  deleteOne,
  changeAmountInput,
  addProduct,
  deleteProduct,
  newOrder,
};
