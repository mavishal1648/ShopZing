
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useProduct } from "../Context/productContext";
import OrderTable from "../Component/Order/orderTable";

const Order = () => {
    const {orders} = useProduct();
    return (
        <div className="container my-4">
        <h1 className="text-center mb-4">Your Orders</h1>
        {orders && orders.length > 0 ? (
          orders.map((order, idx) => (
            <OrderTable order={order} key={idx} />
          ))
        ) : (
          <p className="text-center">No orders found. Place an order to see it here.</p>
        )}
      </div>
    );
};

export default Order;