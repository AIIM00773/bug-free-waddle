import React, { createContext, useContext, useState, useMemo, ReactNode , useEffect} from 'react';
import type { CartGroupType, CartItemType } from '../types/shop.ts';
import {useProfile} from "./profileContext"; 

export interface CartContextType {
  openCart: boolean;
  CartGroups: CartGroupType[];
  setOpenCart: (state: boolean) => void;
  mpesaPhone?:string;
  setMpesaPhone?:(phone:string)=>void; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [CartGroups, setCartGroups] = useState<CartGroupType[]>([]);
  const [openCart, setCartOpen] = useState<boolean>(false);
  const [  mpesaPhone, setMpesaPhone] = useState<string | null>(null); 


  const {user, isAuthenticated} = useProfile();
  useEffect(()=>{
  if(user){
    setMpesaPhone(user.phone); 
  }else return ;
  },[useProfile])
  
  
  const handleSetOpenCart = (state: boolean) => {
    if (!state) return;
    setCartOpen(state);
  };

  
  

  const value = useMemo<CartContextType>(
    () => ({
      CartGroups,
      setOpenCart: handleSetOpenCart,
      mpesaPhone,
      setMpesaPhone
    }),
    [CartGroups]
  );


  

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
