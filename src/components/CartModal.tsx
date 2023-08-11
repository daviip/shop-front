import { useRouter } from "next/router";
import { useClickOutside } from "@mantine/hooks";
import { useAtomValue } from "jotai";
import { checkoutAtom } from "@/store/CheckoutAtom";
import { CartItem } from "./CartItem";
import { Button } from "./Button";

type Props = {
  openCart: boolean;
  setOpenCart: (value: boolean) => void;
};

export const CartModal = (props: Props) => {
  const checkout = useAtomValue(checkoutAtom);
  const router = useRouter();

  const ref = useClickOutside(() => {
    props.setOpenCart(false);
  });

  return (
    <div
      className="bg-white h-screen w-[350px] absolute right-0 top-0 shadow-2xl rounded-lg"
      ref={ref}
    >
      {!checkout || checkout?.length === 0 ? (
        <p className="mt-4 text-center">Aún no hay productos en la cesta</p>
      ) : (
        <>
          {checkout?.map((item) => {
            return <CartItem key={item.id} {...item} modal />;
          })}
          <Button
            className="w-80 mx-4"
            onClick={() => router.push("/checkout")}
          >
            Ir al pago
          </Button>
        </>
      )}
    </div>
  );
};
