import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderTable = ({ order }) => {
  const { items, date, finalPrice } = order;

  // Inline date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div className="container my-4">
      {date && <h2 className="text-center mb-4">Ordered On: {formatDate(date)}</h2>}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product, idx) => (
            <tr key={idx}>
              <td>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  style={{ width: "40px", height: "40px", objectFit: "cover" }} 
                />
              </td>
              <td>{product.title}</td>
              <td>{`₹ ${product.price.toFixed(2)}`}</td>
              <td>{product.quantity}</td>
              <td>{`₹ ${(product.price * product.quantity).toFixed(2)}`}</td>
            </tr>
          ))}
          <tr className="table-success">
            <td colSpan="4" className="text-end"><strong>Total Price</strong></td>
            <td>{`₹ ${finalPrice.toFixed(2)}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;