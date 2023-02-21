import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "phosphor-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface CardProps {
  id: string;
  imageUrl: string;
  tags: string[];
  title: string;
  description: string;
  price: number;
  active: boolean;
  slug: string;
  priceFormatted: string;
}

export function Card({
  id,
  imageUrl,
  tags,
  title,
  description,
  price,
  active,
  slug,
  priceFormatted,
}: CardProps) {
  const { handleAddNewProductInCart } = useCart();

  const [count, setCount] = useState(1);

  function handleAddNumberInCount() {
    setCount(count + 1);
  }

  function handleRemoveNumberInCount() {
    if (count < 2) {
      return toast.warning(
        "Para adicionar ao carrinho, você precisa pelomenos de uma quantidade!"
      );
    }

    setCount(count - 1);
  }

  return (
    <div className="bg-gray-100 rounded-tl-[6px] rounded-tr-[36px] rounded-bl-[36px] rounded-br-[6px] flex flex-col items-center pb-[23px]">
      <Image
        className="relative -top-[20px] select-none"
        src={imageUrl}
        alt="Coffee"
        width={120}
        height={120}
      />
      <div className="flex items-center gap-[4px]">
        {tags.map((tag) => {
          return (
            <span
              className="bg-yellow-100 py-[4px] px-[8px] text-yellow-700 rounded-full font-roboto font-bold uppercase text-[10px]"
              key={tag}
            >
              {tag}
            </span>
          );
        })}
      </div>
      <h1 className="text-[20px] font-bold font-baloo text-brow-400 mt-[16px] ">
        {title}
      </h1>
      <p className="text-center px-[20px] mt-[8px] text-gray-300 font-roboto font-normal">
        {description}
      </p>
      <div className="flex items-center justify-between gap-[23px] px-[24px] mt-[33px] w-full">
        <strong className="flex items-end leading-3 text-brow-300 text-[24px]">
          {priceFormatted}
        </strong>

        <div className="flex items-center gap-[8px]">
          <div className="bg-gray-200 w-[72px] h-[38px] flex items-center justify-evenly rounded-[6px] font-roboto text-purple-500">
            <button onClick={handleRemoveNumberInCount} type="button">
              <Minus size={14} weight="fill" />
            </button>
            <span className="text-gray-800 select-none">{count}</span>
            <button onClick={handleAddNumberInCount} type="button">
              <Plus size={14} weight="fill" />
            </button>
          </div>

          <button
            onClick={() =>
              handleAddNewProductInCart({
                id,
                imageUrl,
                tags,
                title,
                description,
                price,
                active,
                quantity: count,
              })
            }
            className="text-white bg-gray-500 p-[8px] rounded-[6px] hover:brightness-90 transition-all"
            type="button"
          >
            <ShoppingCart size={19} weight="fill" />
          </button>
        </div>
      </div>
      <div className="px-[24px] w-full">
        <Link
          href={`/produto/${slug}`}
          className="mt-5 bg-purple-500 block text-center w-full py-3 rounded-lg px-4 text-white font-roboto text-[15px] hover:brightness-90 transition-all"
        >
          Ver produto
        </Link>
      </div>
    </div>
  );
}
