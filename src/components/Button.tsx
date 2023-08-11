import { ComponentPropsWithoutRef } from "react";

export const Button = (props: ComponentPropsWithoutRef<"button">) => {
  return (
    <button
      {...props}
      className={`flex justify-center items-center gap-4 bg-gray-800 text-gray-100 p-3 px-4 rounded-lg ${props.className}`}
    >
      {props.children}
    </button>
  );
};
