import React from "react";
import ProductCard from "../productCard/productCard";
import { useProduct } from "../../../Context/productContext";

const ProductList = () => {
  const { filterSearch, products } = useProduct();
  
  const productsToDisplay = filterSearch.length > 0 ? filterSearch : products;

  return (
    <div className="container">
      <div className="row">
        {productsToDisplay.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;