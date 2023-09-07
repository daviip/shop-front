import { useEffect } from "react";
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useAtom } from "jotai";
import { Button } from "@/components/Button";
import { CartItem } from "@/components/CartItem";
import { converterStringToEuro } from "@/lib/converterStringToEuro";
import { checkoutAtom } from "@/store/CheckoutAtom";
import { newOrder } from "@/service/cart";

const Checkout = () => {
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const router = useRouter();

  const totalPrice = () => {
    let total = 0;
    checkout.map((item) => {
      total = total + item.amount * Number(item.price);
    });
    return total.toString();
  };

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
      <div className="flex justify-center ">
        <div className="flex flex-col lg:flex-row px-4 lg:px-0 justify-between lg:max-w-6xl w-full mt-4">
          <div className="flex flex-col justify-center gap-8">
            {checkout.map((item) => {
              return <CartItem key={item.id} {...item} />;
            })}
          </div>
          <div className="flex flex-col mt-20 border-2 p-8 h-fit rounded-lg">
            <p className="text-2xl">
              Total:{" "}
              <span className="font-bold">
                {converterStringToEuro(totalPrice())}€
              </span>
            </p>

            <Button
              className="text-2xl rounded-xl mt-4"
              onClick={async () => {
                await newOrder({ totalPrice, checkout, setCheckout });
                router.push("/");
              }}
            >
              Realizar pedido
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

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
