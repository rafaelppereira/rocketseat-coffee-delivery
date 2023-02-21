import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format";

import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPinLine,
  Minus,
  Money,
  Plus,
  Trash,
} from "phosphor-react";
import { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

interface ProductProps {
  id: string;
  quantity: number;
}

interface AddressProps {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function Cart() {
  const { cart, free, updateProductAmount, removeProduct } = useCart();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    logradouro: "",
    bairro: "",
    localidade: "",
    uf: "",
  } as AddressProps);

  const cartFormatted = cart.map((product) => {
    return {
      ...product,
      priceFormatted: formatPrice(product.price),
      subTotal: formatPrice(product.price * product.quantity),
    };
  });

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      sumTotal += product.price * product.quantity;

      return sumTotal;
    }, 0)
  );

  const totalSumFrete = formatPrice(
    cart.reduce((sumTotal, product) => {
      sumTotal += product.price * product.quantity;

      return sumTotal;
    }, 0) + free
  );

  const sumFree = formatPrice(free);

  function handleProductIncrement(product: ProductProps) {
    const incrementArguments = {
      productId: product.id,
      amount: product.quantity + 1,
    };

    updateProductAmount(incrementArguments);
  }

  function handleProductDecrement(product: ProductProps) {
    if (product.quantity < 2) {
      removeProduct(product.id);
      return;
    }

    const decrementArguments = {
      productId: product.id,
      amount: product.quantity - 1,
    };

    updateProductAmount(decrementArguments);
  }

  function handleRemoveProduct(productId: string) {
    removeProduct(productId);
  }

  function changeGetAddress() {
    if (cep === "") {
      return toast.error("Por favor indique um CEP");
    }

    axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        setAddress(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Head>
        <title>Coffee Delivery | Carrinho de compras</title>
      </Head>
      <section className="w-full relative max-w-7xl mx-auto px-8 mt-[104px] min-h-[calc(100vh-104px)] flex flex-col md:flex-row gap-[32px] items-start justify-between py-[72px]">
        <div className="flex-1">
          <h1 className="text-brow-400 text-[18px] font-bold">
            Complete seu pedido
          </h1>

          <div className="bg-gray-100 p-[40px] mt-[15px] rounded-[6px]">
            <div className="flex items-start gap-[8px]">
              <MapPinLine size={22} className="text-yellow-700" />
              <div className="flex flex-col items-start font-roboto">
                <h1 className="text-[16px] text-brow-300">Dados pessoais</h1>
                <p className="text-[14px] text-brow-300">
                  Informe seus dados pessoais para criarmos uma conta
                </p>
              </div>
            </div>

            <form className="mt-[32px] font-roboto text-gray-300 flex flex-col gap-[16px]">
              <input
                className="h-[42px] border border-gray-200 w-full bg-gray-50 pl-[12px] rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all"
                type="text"
                placeholder="Nome completo"
              />

              <input
                className="h-[42px]  border border-gray-200 w-full pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                type="text"
                placeholder="E-mail"
              />

              <div className="flex items-center gap-[16px]">
                <input
                  className="h-[42px]  border border-gray-200 w-[200px] pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="Telefone"
                />

                <input
                  className="h-[42px]  border border-gray-200 w-full pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="CPF"
                />
              </div>

              <select className="h-[42px] text-gray-400  border border-gray-200 w-full px-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não binário">Não binário</option>
                <option value="Outro">Outro</option>
              </select>
            </form>
          </div>

          <div className="bg-gray-100 p-[40px] mt-[15px] rounded-[6px]">
            <div className="flex items-start gap-[8px]">
              <MapPinLine size={22} className="text-yellow-700" />
              <div className="flex flex-col items-start font-roboto">
                <h1 className="text-[16px] text-brow-300">
                  Endereço de Entrega
                </h1>
                <p className="text-[14px] text-brow-300">
                  Informe o endereço onde deseja receber seu pedido
                </p>
              </div>
            </div>

            <form className="mt-[32px] font-roboto text-gray-300 flex flex-col gap-[16px]">
              <input
                className="h-[42px] border border-gray-200 w-[200px] bg-gray-50 pl-[12px] rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all"
                type="text"
                placeholder="CEP"
                value={cep}
                onBlur={changeGetAddress}
                onChange={(e) => setCep(e.target.value)}
              />

              <input
                className="h-[42px]  border border-gray-200 w-full pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                type="text"
                placeholder="Rua"
                disabled
                value={address.logradouro}
              />

              <div className="flex items-center gap-[16px]">
                <input
                  className="h-[42px]  border border-gray-200 w-[200px] pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="Número"
                />

                <input
                  className="h-[42px]  border border-gray-200 w-full pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="Complemento"
                />
              </div>

              <div className="flex items-center gap-[16px]">
                <input
                  className="h-[42px]  border border-gray-200 w-[200px] pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="Bairro"
                  disabled
                  value={address.bairro}
                />

                <input
                  className="h-[42px]  border border-gray-200 w-full pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="Cidade"
                  disabled
                  value={address.localidade}
                />

                <input
                  className="h-[42px]  border border-gray-200 w-[60px] pl-[12px] bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-yellow-700 outline-none transition-all disabled:opacity-90"
                  type="text"
                  placeholder="UF"
                  disabled
                  value={address.uf}
                />
              </div>
            </form>
          </div>

          <div className="bg-gray-100 p-[40px] mt-[15px] rounded-[6px]">
            <div className="flex items-start gap-[8px]">
              <CurrencyDollar size={22} className="text-purple-500" />
              <div className="flex flex-col items-start font-roboto">
                <h1 className="text-[16px] text-brow-300">Pagamento</h1>
                <p className="text-[14px] text-brow-300">
                  O pagamento é feito na entrega. Escolha a forma que deseja
                  pagar
                </p>
              </div>
            </div>

            <div className="mt-[48px] grid grid-cols-1 md:grid-cols-3 gap-[12px]">
              <label
                htmlFor="creditCard"
                className="p-[16px] bg-gray-200 rounded-[6px] flex items-center gap-[12px] uppercase text-gray-500 font-roboto text-[12px] cursor-pointer hover:bg-purple-100 hover:ring-1 hover:ring-purple-500 label-checked:bg-purple-100 label-checked:ring-1 label-checked:ring-purple-500 transition-all"
              >
                <CreditCard size={16} className="text-purple-500" />
                Cartão de crédito
                <input
                  id="creditCard"
                  className="peer"
                  value="creditCard"
                  type="radio"
                  name="pay_method"
                />
              </label>

              <label
                htmlFor="debitCard"
                className="p-[16px] bg-gray-200 rounded-[6px] flex items-center gap-[12px] uppercase text-gray-500 font-roboto text-[12px] cursor-pointer hover:bg-purple-100 hover:ring-1 hover:ring-purple-500 transition-all"
              >
                <Bank size={16} className="text-purple-500" />
                Cartão de débito
                <input
                  id="debitCard"
                  className="peer"
                  value="debitCard"
                  type="radio"
                  name="pay_method"
                />
              </label>

              <label
                htmlFor="money"
                className="p-[16px] checked:bg-red-500 bg-gray-200 rounded-[6px] flex items-center gap-[12px] uppercase text-gray-500 font-roboto text-[12px] cursor-pointer hover:bg-purple-100 hover:ring-1 hover:ring-purple-500 transition-all"
              >
                <Money size={16} className="text-purple-500" />
                Dinheiro
                <input
                  id="money"
                  value="money"
                  type="radio"
                  name="pay_method"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[448px] sticky top-[176px]">
          <h1 className="text-brow-400 text-[18px] font-bold">
            Cafés selecionados
          </h1>

          <div className="bg-gray-100 p-[40px] mt-[15px] rounded-tl-[6px]  rounded-tr-[44px] rounded-br-[6px] rounded-bl-[44px]">
            {cart.length == 0 ? (
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/empty_cart.svg"
                  alt="Carrinho vázio"
                  width={200}
                  height={100}
                />
                <h1 className="mt-[30px] font-roboto font-normal text-brow-400">
                  Você não tem items no carrinho
                </h1>
                <Link
                  className="text-purple-500 underline underline-offset-2 hover:brightness-90 transition-all"
                  href="/"
                >
                  Adicione agora
                </Link>
              </div>
            ) : (
              <div className="flex flex-col ">
                {cartFormatted.map((product) => {
                  return (
                    <div
                      key={product.title}
                      className="flex items-start justify-between border-b border-gray-200 py-[24px]"
                    >
                      <div className="flex items-center gap-[20px]">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          width={64}
                          height={64}
                          priority
                          quality={100}
                        />
                        <div className="flex flex-col">
                          <h1 className="font-roboto text-brow-400 text-[16px]">
                            {product.title}
                          </h1>
                          <div className="flex items-center gap-[8px] mt-[8px]">
                            <div className="bg-gray-200 w-[72px] h-[38px] flex items-center justify-evenly rounded-[6px] font-roboto text-purple-500">
                              <button
                                type="button"
                                onClick={() => handleProductDecrement(product)}
                              >
                                <Minus size={14} weight="fill" />
                              </button>
                              <span className="text-gray-800 select-none">
                                {product.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleProductIncrement(product)}
                              >
                                <Plus size={14} weight="fill" />
                              </button>
                            </div>

                            <button
                              className="flex items-center gap-[4px] h-[38px] text-brow-300 text-[12px] uppercase rounded-[6px] font-roboto group bg-gray-200 p-[8px] hover:bg-purple-500 hover:text-white transition-colors"
                              type="button"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <Trash
                                size={16}
                                className="text-purple-500 group-hover:text-white"
                              />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>

                      <span className="font-roboto text-[16px] font-bold text-brow-300">
                        {product.subTotal}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center font-roboto font-normal text-[14px] text-gray-300 justify-between">
                <span>Total de items</span>
                <span>{total}</span>
              </div>

              {cart.length > 0 && (
                <>
                  <div className="flex items-center font-roboto font-normal text-[14px] text-gray-300 justify-between">
                    <span>Entrega</span>
                    <span>{sumFree}</span>
                  </div>
                  <div className="flex items-center justify-between text-[20px] font-bold text-brow-400">
                    <span>Total</span>
                    <span>{totalSumFrete}</span>
                  </div>
                </>
              )}
            </div>

            <button
              className="mt-[24px] bg-yellow-500 text-white w-full py-[12px] uppercase text-[14px] rounded-[6px] font-roboto font-normal hover:brightness-90 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
              type="button"
              disabled={cep === "" || cart.length <= 0}
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
