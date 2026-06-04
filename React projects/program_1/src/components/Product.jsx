function Product(props) {

  return (

    <div className="mb-8 text-center">

      <h1 className="text-2xl">
        Product Name : {props.name}
      </h1>

      <h1 className="text-2xl mb-3">
        Price : ₹ {props.price}
      </h1>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Buy
      </button>

    </div>
  );
}

export default Product;