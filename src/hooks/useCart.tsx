import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart');

     if (storagedCart) {
        return JSON.parse(storagedCart);//   JSON.parse tranforma o valor em original
     }
        return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updateCart = [...cart]; // pegando tudo de cart e mantendo a imutabilidade
      const productExiste = updateCart.find( product => product.id === productId); // verificando se o produto existe
   
      const stock = await api.get(`/stock/${productId}`); // verificar stock

      const stockAmount = stock.data.amount; 
      const currentAmount = productExiste ? productExiste.amount : 0; // se o produto existe no carrinho ele pega a quantidade 
      const amount = currentAmount + 1; // quantidade desejada

      if(amount > stockAmount){ // verifica se a quantidade desejada não é maior a que tem no stock
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productExiste){
        productExiste.amount = amount; // atualizar quantidade no carrinho
      }else {
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updateCart.push(newProduct);
      }

      setCart(updateCart);
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(updateCart))

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
