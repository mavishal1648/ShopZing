import React, { useState, createContext, useContext, useEffect } from "react";
import { useUser } from "./userContext";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import data from "../Utils/data"; // Assuming this is your product data

const context = createContext();

export const useProduct = () => {
  return useContext(context);
};

export const ProductProvider = ({ children }) => {
  const [products] = useState(data);
  const { userId } = useUser();
  const [filterSearch, setFilterSearch] = useState([]);
  const [finalPrice, setFinalPrice] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        try {
          const docRef = doc(db, "ShopZing", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const ordersData = docSnap.data().orders || [];
            setOrders(ordersData);
          } else {
            console.log("No such document!");
            setOrders([]);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [userId]);

  const addItemToCart = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      const docRef = doc(db, "ShopZing", userId);
      const docSnap = await getDoc(docRef);
      let currentCart = docSnap.data().cart || [];

      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === productId
      );

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({
          id: productId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }
      await updateDoc(docRef, { cart: currentCart });
      toast.success("Item added successfully to the cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Error adding product to cart!");
    }
  };

  const increaseItemByOne = async (productId) => {
    const docRef = doc(db, "ShopZing", userId);
    const docSnap = await getDoc(docRef);
    const cart = docSnap.data().cart;
    const findCart = cart.find((item) => item.id === productId);
    findCart.quantity += 1;
    await updateDoc(docRef, { cart });
  };

  const decreaseItemByOne = async (productId) => {
    const docRef = doc(db, "ShopZing", userId);
    const docSnap = await getDoc(docRef);
    const cart = docSnap.data().cart;
    const findCart = cart.find((item) => item.id === productId);
    if (findCart.quantity === 1) {
      await deleteItemFromCart(productId);
    } else {
      findCart.quantity -= 1;
      await updateDoc(docRef, { cart });
    }
  };

  const deleteItemFromCart = async (productId) => {
    const docRef = doc(db, "ShopZing", userId);
    const docSnap = await getDoc(docRef);
    const cart = docSnap.data().cart;
    const filterCart = cart.filter((item) => item.id !== productId);
    await updateDoc(docRef, { cart: filterCart });
  };

  const placeOrder = async () => {
    try {
      const docRef = doc(db, "ShopZing", userId);
      const docSnap = await getDoc(docRef);
      const cart = docSnap.data().cart;
      let currentOrders = docSnap.data().orders || [];
      const currentDate = new Date().toISOString();
      const newOrder = {
        items: cart,
        date: currentDate,
        finalPrice,
      };
      currentOrders = [newOrder, ...currentOrders];
      await updateDoc(docRef, { cart: [], orders: currentOrders });
      setOrders(currentOrders);
      toast.success("Order Placed Successfully");
      setFinalPrice(null);
    } catch (error) {
      toast.error("Error placing order");
      console.error("Error placing order:", error);
    }
  };

  const searchProducts = (searchItem) => {
    if (searchItem) {
      const lowerCaseSearchItem = searchItem.toLowerCase();
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseSearchItem)
      );
      setFilterSearch(filteredProducts);
    } else {
      setFilterSearch([]);
    }
  };

  return (
    <context.Provider
      value={{
        products,
        addItemToCart,
        increaseItemByOne,
        decreaseItemByOne,
        deleteItemFromCart,
        placeOrder,
        searchProducts,
        filterSearch,
        setFinalPrice,
        orders,
      }}
    >
      {children}
    </context.Provider>
  );
};