import NavBar from './components/NavBar';
import { useAuth } from './hooks/useAuth';

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-gray-600">Please <a href="/authenticate" className="underline" role="link">log in</a> to access this page.</p>
      </div>
    );
  }

  return (
    <div className="layout">
      <main className="flex flex-col max-h-screen">
        <NavBar />
        {children}
      </main>
    </div>
  );
}

export default Layout;