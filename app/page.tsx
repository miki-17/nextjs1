import Hello from "../components/hello";

const Home = () => {
  console.log("server component rendered");
  return (
    <>
      <Hello />
      <div className="text-5xl underline">Welcome to next.js</div>
    </>
  );
};

export default Home;
