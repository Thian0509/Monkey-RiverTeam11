import { useAuth } from "./hooks/useAuth";

export const TestConsumer = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <p>User: {user?.email || "None"}</p>
      <button onClick={() => login("test@example.com", "pass")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
