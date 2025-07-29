import { useAuth } from '../hooks/useAuth';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
      {user ? (
        <p>Hello, {user.email}!</p>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <a href="/auth">Login</a>
        </div>
      )}
    </div>
  );
};

export default Home;