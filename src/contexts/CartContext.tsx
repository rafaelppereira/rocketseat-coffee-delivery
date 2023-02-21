import { api } from "@/lib/axios";
import { formatPrice } from "@/utils/format";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartContextProps {
  children: ReactNode;
}

interface CardProps {
  id: string;
  imageUrl: string;
  tags: string[];
  title: string;
  description: string;
  price: number;
  active: boolean;
  quantity: number;
}

interface ProductProps {
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

interface CartContextData {
  cart: CardProps[];
  free: number;
  products: ProductProps[];
  handleAddNewProductInCart: (product: CardProps) => void;
  updateProductAmount: ({
    productId,
    amount,
  }: {
    productId: string;
    amount: number;
  }) => void;

  removeProduct: (productId: string) => void;
}

export const CartContext = createContext({} as CartContextData);

export function CartProvider({ children }: CartContextProps) {
  const [cart, setCart] = useState<CardProps[]>([]);
  const [free, setFree] = useState(7.8);
  const [products, setProducts] = useState<ProductProps[]>([]);

  function handleAddNewProductInCart(product: CardProps) {
    const findProduct = cart.find((p) => p.id === product.id);

    if (findProduct) {
      const sumQuantity = findProduct.quantity + product.quantity;
      updateProductAmount({ productId: findProduct.id, amount: sumQuantity });
      toast.success(
        `Esse produto já estava no seu carrinho, atualizamos a quantidade!`
      );
      return;
    }

    setCart([...cart, product]);
    localStorage.setItem(
      "@CoffeeDelivery:cart",
      JSON.stringify([...cart, product])
    );

    toast.success(`Produto adicionado ao carrinho!`);
  }

  async function updateProductAmount({
    productId,
    amount,
  }: {
    productId: string;
    amount: number;
  }) {
    const productExists = cart.some(
      (cartProduct) => cartProduct.id === productId
    );

    if (!productExists) {
      toast.error("Erro na alteração de quantidade do produto");
      return;
    }

    const updatedCart = cart.map((cartItem) =>
      cartItem.id === productId
        ? {
            ...cartItem,
            quantity: amount,
          }
        : cartItem
    );

    setCart(updatedCart);
    localStorage.setItem("@CoffeeDelivery:cart", JSON.stringify(updatedCart));
  }

  async function removeProduct(productId: string) {
    const productExists = cart.some(
      (cartProduct) => cartProduct.id === productId
    );

    if (!productExists) {
      toast.error("Erro na alteração de quantidade do produto");
      return;
    }

    const updatedCart = cart.filter((cartItem) => cartItem.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("@CoffeeDelivery:cart", JSON.stringify(updatedCart));
  }

  useEffect(() => {
    const storagedCart = localStorage.getItem("@CoffeeDelivery:cart");

    if (storagedCart) {
      setCart(JSON.parse(storagedCart));
    } else {
      setCart([]);
    }
  }, []);

  function getProducts() {
    api
      .get("/products")
      .then((response) => {
        const productsFormated = response.data.map((product: ProductProps) => {
          return { ...product, priceFormatted: formatPrice(product.price) };
        });
        setProducts(productsFormated);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        free,
        handleAddNewProductInCart,
        updateProductAmount,
        removeProduct,
        products,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
