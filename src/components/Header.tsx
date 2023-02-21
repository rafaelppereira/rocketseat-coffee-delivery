import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MapPin, ShoppingCartSimple } from "phosphor-react";

export function Header() {
  const { cart } = useCart();

  return (
    <header className="w-full z-50 fixed left-0 top-0 bg-white  ">
      <div className="w-full max-w-7xl mx-auto px-8 h-[104px] flex items-center justify-between ">
        <Link href="/">
          <figure>
            <img
              src="/logo.svg"
              alt="Logo do Coffee delivery"
              className="h-[40px] object-cover shrink-0 select-none"
            />
          </figure>
        </Link>

        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            className="flex items-center gap-[4px] p-[8px] text-purple-500 rounded-[6px] select-none bg-purple-100 transition-colors hover:text-white hover:bg-purple-500"
          >
            <MapPin size={22} weight="fill" />
            Porto Alegre, RS
          </button>

          <Link
            href="/carrinho"
            className="bg-yellow-100 duration-400 origin-center  relative text-yellow-700 p-[8px] rounded-[6px] hover:brightness-90 transition-all"
          >
            <span className="absolute -right-2 -top-2 w-[20px] h-[20px] bg-yellow-700 text-white rounded-full flex items-center justify-center font-normal font-roboto text-[12px]">
              {cart.length}
            </span>
            <ShoppingCartSimple size={22} weight="fill" />
          </Link>
        </div>
      </div>
    </header>
  );
}
