import { CartContext } from "@/contexts/CartContext";
import { useContext } from "react";

export function useCart() {
  const value = useContext(CartContext);
  return value;
}
