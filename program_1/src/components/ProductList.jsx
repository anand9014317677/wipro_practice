import Product from "./Product";

function ProductList() {

  return (

    <div>

      <h1 className="text-3xl mb-8 text-center">
        Product Listing :
      </h1>

      <Product name="Laptop" price="70000" />

      <Product name="Mouse" price="700" />

      <Product name="Keyboard" price="7000" />

    </div>
  );
}

export default ProductList;