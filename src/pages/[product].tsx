import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetServerSideProps } from "next/types";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";
import { MdShoppingCart } from "react-icons/md";
import { useAtom } from "jotai";
import { type Product } from "./index";
import { converterStringToEuro } from "@/lib/converterStringToEuro";
import { Checkout, checkoutAtom } from "@/store/CheckoutAtom";
import { Button } from "@/components/Button";
import { CartModal } from "@/components/CartModal";
import { openCartAtom } from "@/store/OpenCartAtom";

export const fetchProduct = async (id: string) => {
  const response = await fetch(`/api/product?id=${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const { data } = await response.json();

  return data as Product;
};

const Product = () => {
  const router = useRouter();
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const [openCart, setOpenCart] = useAtom(openCartAtom);

  const idProduct = router.query.product as string;

  const { data, isLoading } = useQuery(["getProduct", idProduct], () =>
    fetchProduct(idProduct)
  );

  const addProduct = () => {
    if (!data?.id) {
      return;
    }

    let newCheckout: Checkout[] = [];

    if (checkout?.length > 0) {
      if (checkout.some((item) => item.id === data.id)) {
        newCheckout = checkout.map((item) => {
          if (item.id === data.id) {
            return {
              ...item,
              amount: item.amount + 1,
            };
          }
          return item;
        });

        setCheckout(newCheckout);

        localStorage.setItem(
          getCookie("user")?.toString() ?? "",
          JSON.stringify(newCheckout)
        );
      } else {
        newCheckout = [
          ...checkout,
          {
            id: data.id,
            name: data.name,
            price: data.price,
            image: data.image,
            amount: 1,
          },
        ];
        setCheckout(newCheckout);

        localStorage.setItem(
          getCookie("user")?.toString() ?? "",
          JSON.stringify(newCheckout)
        );
      }
    } else {
      newCheckout = [
        {
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image,
          amount: 1,
        },
      ];

      setCheckout(newCheckout);

      localStorage.setItem(
        getCookie("user")?.toString() ?? "",
        JSON.stringify(newCheckout)
      );
    }
  };

  const openModalSeconds = () => {
    setOpenCart(true);

    setTimeout(() => {
      setOpenCart(false);
    }, 3000);
  };

  return (
    <>
      <div className="flex justify-center mt-10 px-4">
        {!isLoading && data ? (
          <div className="w-full max-w-3xl">
            <div className="flex flex-col lg:flex-row px-4 gap-20 border-2 border-gray-200 rounded-lg">
              <div className="relative w-72 h-80 m-1 self-center">
                <Image
                  src={`${process.env.URL_BACK}/assets/${data.image}`}
                  alt={data.name}
                  fill
                />
              </div>
              <div className="flex flex-col mt-4 justify-between">
                <div>
                  <h3 className="text-4xl mb-4">{data.name}</h3>
                  <p className="mb-4 text-2xl font-bold">
                    {converterStringToEuro(data.price)}€
                  </p>
                </div>
                <Button
                  className="mb-4"
                  onClick={() => {
                    addProduct();
                    openModalSeconds();
                  }}
                >
                  <MdShoppingCart />
                  Añadir al carrito
                </Button>
              </div>
            </div>
            <h6 className="mt-10 text-2xl underline">Descripción</h6>
            <p>{data.description}</p>
          </div>
        ) : (
          <div>Cargando...</div>
        )}
      </div>
      {openCart && <CartModal openCart={openCart} setOpenCart={setOpenCart} />}
    </>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const token = getCookie("token", res);
  const user = getCookie("user", res);

  if (!token || !user) {
    res.writeHead(301, { Location: "/login" });
    res.end();
    return { props: {} };
  }

  return {
    props: {},
  };
};
