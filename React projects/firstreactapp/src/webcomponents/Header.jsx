import MyButton from "./MyButton";

function Header() {

  function events() {
    return "Multi Techno Solutions- AI";
  }

  let brand_name = "IT Technologies";

  return (

    <div className="p-5 border-b m-2 border-gray-300 w-full px-2 py-5 bg-neutral-900 text-amber-50 flex flex-col items-center justify-center">

      <h1 className="text-3xl font-bold underline">
        Welcome to React JS
      </h1>

      <h1>
        Brand Name : {brand_name}
      </h1>

      <h2>
        Topic : {events()}
      </h2>

      <p className="font-light">
        This is a simple header component.
      </p>

      <MyButton title="About US"/>

    </div>

  );

}

export default Header;