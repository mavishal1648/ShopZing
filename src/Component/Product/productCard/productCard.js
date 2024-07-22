import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../Context/userContext";
import { toast } from "react-toastify";
import { useProduct } from "../../../Context/productContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const ProductCard = ({ product }) => {
  const { user } = useUser();
  const {addItemToCart} = useProduct();
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Pls log in to add items to your cart.");
      navigate("/login");
    }
    else{
        addItemToCart(product.id);
    }
  };

  return (
    <div className="card h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.title}
        style={{ maxHeight: "150px", objectFit: "contain" }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">&#x20B9;{product.price}</p>
        <p className="card-text"><FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} /> &nbsp;{product.rating.rate}</p>

        <button className="btn btn-primary" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
