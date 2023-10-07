const Home = () => {
  const firstname = localStorage.getItem("firstname");
  return (
    <div className="flex flex-col items-center ">
      <h1 className="font-bold text-xl">Home</h1>
      {firstname && <p>Welcome {firstname}</p>}
    </div>
  );
};

export default Home;
