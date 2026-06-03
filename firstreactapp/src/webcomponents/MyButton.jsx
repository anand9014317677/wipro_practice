function MyButton(props) {

  return (

    <button className="bg-blue-600 text-white px-4 py-2 rounded-full mt-3">
      {props.title}
    </button>

  );

}

export default MyButton;