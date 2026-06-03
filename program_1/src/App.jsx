import EmployeeCounter from "./components/EmployeeCounter";
import ProductList from "./components/ProductList";

function App() {

  return (

    <div className="p-10">

      <h1 className="text-5xl font-bold text-center text-blue-900 mb-20">
        Content from App.jsx
      </h1>

      <div className="flex justify-between items-start">

        <EmployeeCounter />

        <div className="mr-40">
          <ProductList />
        </div>

      </div>

    </div>

  );
}

export default App;