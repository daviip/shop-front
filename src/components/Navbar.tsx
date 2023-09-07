import Link from "next/link";
import Image from "next/image";
import { MdShoppingCart } from "react-icons/md";
import { useAtom } from "jotai";
import { openCartAtom } from "@/store/OpenCartAtom";
import { useRouter } from "next/router";
import { Button } from "./Button";
import { logout } from "@/service/auth";

export const Navbar = () => {
  const router = useRouter();
  const [openCart, setOpenCart] = useAtom(openCartAtom);

  return (
    <div className="bg-gray-200 h-20 flex justify-between items-center px-10 w-screen">
      <Link
        href={router.pathname !== "/login" ? "/" : ""}
        className="flex items-center gap-4 text-gray-900 font-bold text-2xl"
      >
        <Image
          src="/assets/logo.jpeg"
          alt="logo"
          width={90}
          height={100}
          className="p-2"
        />{" "}
        Wolf
      </Link>
      {router.pathname !== "/login" && (
        <>
          <Button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
          <div
            className="text-gray-800 cursor-pointer"
            onClick={() => setOpenCart(!openCart)}
          >
            <MdShoppingCart />
          </div>
        </>
      )}
    </div>
  );
};
