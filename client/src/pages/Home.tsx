// import { useAuth } from '../hooks/useAuth';
// import { useState } from 'react';
import WorldRiskMap from '../components/WorldRiskMap';
// import Loading from '../components/Loading';

function Home() {
  // const { user } = useAuth();
  // const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div className="w-screen h-screen">
    {/* //   <h1>Welcome to the Home Page</h1>
    //   {user ? (
    //     <p>Hello, {user.email}!</p>
    //   ) : (
    //     <div>
    //       <p>You are not logged in.</p>
    //       <a href="/auth">Login</a>
    //     </div>
    //   )} */}
      <WorldRiskMap />
    </div>
  );
};

export default Home;