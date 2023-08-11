import { useEffect, useState } from "react";
import { GetServerSideProps } from "next/types";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";
import { CartModal } from "@/components/CartModal";
import { Navbar } from "@/components/Navbar";
import { ProductItem } from "@/components/ProductItem";
import { useAtom, useSetAtom } from "jotai";
import { checkoutAtom } from "@/store/CheckoutAtom";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  img: string;
};

const fetchProducts = async () => {
  const response = await fetch("/api/products", {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const { data } = await response.json();

  return data as Product[];
};

const Home = () => {
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const { data, isLoading } = useQuery("getProducts", fetchProducts);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!checkout || checkout.length === 0) {
      const idUser = getCookie("user")?.toString() ?? "";

      if (JSON.parse(localStorage.getItem(idUser) ?? "[]").length > 0) {
        setCheckout(JSON.parse(localStorage.getItem(idUser) ?? "[]"));
      }
    }
  }, []);

  return (
    <>
      <Navbar openCart={openModal} setOpenCart={setOpenModal} />
      <div className="flex justify-center mt-10 ">
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="grid grid-cols-3 place-items-center gap-10 max-w-7xl">
            {data?.map((item) => {
              return <ProductItem key={item.id} {...item} />;
            })}
          </div>
        )}
      </div>
      {openModal && (
        <CartModal openCart={openModal} setOpenCart={setOpenModal} />
      )}
    </>
  );
};

export default Home;

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
