import Link from "next/link";
import Image from "next/image";
import { converterStringToEuro } from "@/lib/converterStringToEuro";

type Props = {
  id: string;
  name: string;
  description: string;
  price: string;
  img: string;
};

export const ProductItem = (props: Props) => {
  return (
    <Link
      href={{
        pathname: `/${props.id}`,
      }}
    >
      <div className="w-80 border-gray-500 border-2 rounded-lg p-2">
        <div className="h-64 w-full relative">
          <Image
            src={`${process.env.URL_BACK}/assets/${props.img}`}
            alt={props.name}
            fill
          />
        </div>
        <p className="font-bold text-xl mt-2">{props.name}</p>
        <p className="text-right pr-4 font-bold mt-2">
          {converterStringToEuro(props.price)}€
        </p>
      </div>
    </Link>
  );
};
