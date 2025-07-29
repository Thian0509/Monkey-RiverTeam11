import NavBar from './components/NavBar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout bg-white text-black">
      <main className="flex flex-col max-h-screen">
        <NavBar />
        {children}
      </main>
    </div>
  );
}

export default Layout;