import Link from "next/link";
import Image from "next/image";
import { MdShoppingCart } from "react-icons/md";

type Props = {
  openCart: boolean;
  setOpenCart: (value: boolean) => void;
};

export const Navbar = (props: Props) => {
  return (
    <div className="bg-gray-200 h-20 flex justify-between items-center px-10">
      <Link
        href="/"
        className="flex items-center gap-4 text-gray-900 font-bold text-2xl"
      >
        <Image
          src={`/assets/logo.jpeg`}
          alt="logo"
          width={90}
          height={100}
          className="p-2"
        />{" "}
        Wolf
      </Link>
      <div
        className="text-gray-800"
        onClick={() => props.setOpenCart(!props.openCart)}
      >
        <MdShoppingCart />
      </div>
    </div>
  );
};
