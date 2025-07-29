// import { useAuth } from '../hooks/useAuth';
// import WorldRiskMap from '../components/WorldRiskMap';

function Home() {
  // const { user } = useAuth();

  return (
    <div className="bg-red-500 w-screen h-screen">
    {/* //   <h1>Welcome to the Home Page</h1>
    //   {user ? (
    //     <p>Hello, {user.email}!</p>
    //   ) : (
    //     <div>
    //       <p>You are not logged in.</p>
    //       <a href="/auth">Login</a>
    //     </div>
    //   )} */}
      {/* <WorldRiskMap /> */}
      <h1 className="text-xl text-center pt-20">Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;