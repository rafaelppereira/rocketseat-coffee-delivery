import { useCart } from "@/hooks/useCart";
import { api } from "@/lib/axios";
import { unsplashApi } from "@/services/unsplash";
import { formatPrice } from "@/utils/format";
import { GetStaticPaths, GetStaticProps } from "next";

import Head from "next/head";
import {
  ArrowRight,
  Minus,
  Phone,
  Plus,
  ShareNetwork,
  ShoppingCartSimple,
} from "phosphor-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProductProps {
  product: {
    id: string;
    imageUrl: string;
    tags: string[];
    title: string;
    description: string;
    price: number;
    active: boolean;
    slug: string;
    priceFormatted: string;
    images: string[];
  };
}

export default function Product({ product }: ProductProps) {
  const { handleAddNewProductInCart } = useCart();

  const [count, setCount] = useState(1);

  function handleIncrementProduct() {
    setCount(count + 1);
  }

  function handleDecrementProduct() {
    if (count < 2) {
      return toast.warning(
        "Para adicionar ao carrinho, você precisa pelomenos de uma quantidade!"
      );
    }

    setCount(count - 1);
  }

  function handleCreateNewProductInCart(product: any) {
    handleAddNewProductInCart(product);
    setCount(1);
  }

  async function handleShareProduct() {}

  return (
    <>
      <Head>
        <title>{product.title} - Coffee Delivery</title>
      </Head>
      <section className="bg-banner bg-cover bg-top bg-no-repeat w-full">
        <div className="w-full  relative max-w-7xl mx-auto px-8 mt-[104px] min-h-[calc(100vh-104px)] flex flex-col md:flex-row gap-[32px] items-center justify-between py-[72px] ">
          <div className="grid grid-cols-2 gap-5">
            {product.images.map((image) => {
              return (
                <div
                  key={image}
                  className="w-[250px] h-[250px] overflow-hidden rounded-[6px]"
                >
                  <img
                    className="w-full h-full object-cover hover:scale-125 transition-all duration-300"
                    src={image}
                    alt={product.title}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex-1 px-5">
            <div className="leading-[230%]">
              <h1 className="text-brow-400 text-[35px]">{product.title}</h1>
              <p className="text-brow-300 font-roboto font-normal text-[19px]">
                {product.description}
              </p>

              {product.tags.map((tag) => {
                return (
                  <span
                    className="bg-yellow-100 select-none py-[4px] mr-[4px] px-[8px] text-yellow-700 rounded-full font-roboto font-bold uppercase text-[10px]"
                    key={tag}
                  >
                    {tag}
                  </span>
                );
              })}

              <div className="flex items-center gap-[15px] mt-5">
                <strong className="flex items-end leading-3 text-brow-300 text-[24px]">
                  {product.priceFormatted}
                </strong>

                <div className="bg-purple-500 w-[72px] h-[38px]  flex items-center justify-evenly rounded-[6px] font-roboto text-white">
                  <button type="button">
                    <Minus
                      onClick={handleDecrementProduct}
                      size={14}
                      weight="fill"
                    />
                  </button>
                  <span className="text-white select-none">{count}</span>
                  <button onClick={handleIncrementProduct} type="button">
                    <Plus size={14} weight="fill" />
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-4">
                <button
                  type="button"
                  title="Clique para comprar"
                  onClick={() =>
                    handleCreateNewProductInCart({
                      id: product.id,
                      imageUrl: product.imageUrl,
                      tags: product.tags,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      active: product.active,
                      quantity: count,
                    })
                  }
                  className="flex items-center gap-[15px] px-10 bg-orange-500 text-center text-white rounded-[6px] mt-10 font-roboto font-normal py-2 hover:brightness-90 transition-all"
                >
                  <ShoppingCartSimple size={22} weight="fill" />
                  Adicionar ao carrinho
                </button>

                <button
                  type="button"
                  onClick={() => handleShareProduct()}
                  title="Clique para compartilhar página"
                  className="text-white bg-purple-500 w-f px-2 py-2 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:brightness-90 transition-all"
                >
                  <ShareNetwork size={22} />
                </button>
              </div>

              <div className="flex flex-col mt-10 leading-5 text-sm text-brow-300 font-roboto font-bold">
                <span className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  Desconto de 5% na compra de 10 cafés
                </span>
                <span className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  Desconto de 10% na compra de 15 cafés
                </span>
              </div>

              <div className="border-t border-gray-200 mt-10 leading-none pt-5 flex items-center gap-4 text-brow-400 font-bold text-md">
                <div className="bg-purple-500 w-10 h-10 flex items-center justify-center text-white rounded-full shrink-0">
                  <Phone size={20} />
                </div>
                Em caso de dúvidas entre em contato conosco pelo ícone do
                Whatsapp ao lado ou ligue para nós.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  let slug: never[] = [];

  const paths = slug;

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const { slug } = ctx.params;

  const { data } = await api.get("/products");

  const productsFormated = data.map((product: { price: number }) => {
    return { ...product, priceFormatted: formatPrice(product.price) };
  });

  const resultProduct = productsFormated.find(
    (p: { slug: string }) => p.slug === slug
  );

  const unsplashResponse = await unsplashApi.get(
    encodeURI(`/search/photos?page=1&per_page=4&query=${resultProduct.title}`)
  );

  let urls: any[] = [];

  unsplashResponse.data.results.map((item: any) => {
    urls.push(item.urls.raw);
  });

  const product = {
    ...resultProduct,
    images: urls,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
