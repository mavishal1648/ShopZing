import React, { useEffect, useState } from "react";
import { useUser } from "../Context/userContext";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useProduct } from "../Context/productContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { userId } = useUser(); 
  const { decreaseItemByOne, increaseItemByOne, deleteItemFromCart, placeOrder,setFinalPrice} = useProduct();
  const [cartItems, setCartItems] = useState([]);
  const [cartModified, setCartModified] = useState(false);
  const navigate = useNavigate();




  const handleIncrease = async (productId) => {
    await increaseItemByOne(productId);
    setCartModified(!cartModified);
  };

  const handleDecrease = async (productId) => {
    await decreaseItemByOne(productId);
    setCartModified(!cartModified);
  };

  const handleDeleteItem = async (productId) => {
    await deleteItemFromCart(productId);
    setCartModified(!cartModified);
  };

  const handleOrder = async () => {
    try {
      await placeOrder();
      setCartModified(!cartModified);
      navigate('/orders');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const docRef = doc(db, "ShopZing", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) { // Check if document exists
          const cartData = docSnap.data().cart || [];
          setCartItems(cartData);
        } else {
          console.log("No such document!"); 
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.error("Error fetching cart data!");
      }
    };

    fetchCartData();
  }, [userId, cartModified]);

  // Calculate final price
  const finalPrice = cartItems.reduce((total, item) => {
    const { price, quantity } = item;
    return total + price * quantity;
  }, 0);

  useEffect(() => {
    setFinalPrice(finalPrice); 
  }, [finalPrice, setFinalPrice]);

  return (
    <>
    <h1 className="d-flex justify-content-center my-5">Cart Page</h1>
      <div className="d-flex justify-content-center my-5">
        {cartItems.length > 0 ? (
          <table className="table" style={{ width: "75%" }}>
            <thead className="table-dark">
              <tr>
                <th scope="col">Item Image</th>
                <th scope="col">Item Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="table-secondary">
              {cartItems.map((item) => {
                const { id, title, image, price, quantity } = item;
                const totalPrice = quantity * price;
                return (
                  <tr key={id}>
                    <td>
                      <img
                        src={image}
                        alt={title}
                        style={{ width: "55px", height: "55px" }}
                      />
                    </td>
                    <td>{title}</td>
                    <td>{price}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={() => handleIncrease(id)}
                        size="2xs"
                      />{" "}
                      &nbsp;
                      {quantity} &nbsp;
                      <FontAwesomeIcon
                        icon={faMinus}
                        onClick={() => handleDecrease(id)}
                        size="2xs"
                      />
                    </td>
                    <td>{totalPrice}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="2xs"
                        onClick={() => handleDeleteItem(id)}
                        style={{ color: "#ff0008", marginLeft: "10px" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="table-success">
              <tr>
                <th colSpan="4">Final Price</th>
                <td>{finalPrice.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No items in your cart. Add items to your cart to see them here.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-dark" onClick={handleOrder}>
            Place Order
          </button>
        </div>
      )}
    </>
  );
};

export default Cart;