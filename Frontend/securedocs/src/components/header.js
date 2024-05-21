function Header() {
  return (
    <header className="w-full py-4 bg-white shadow-md">
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center">
          <img src="/Logo.jpg" alt="Secure Logo" className="h-12 rounded-lg" />
          <span className="ml-3 text-xl font-semibold">SecureDocs</span>
        </div>
        <div className="flex items-center"></div>
      </div>
    </header>
  );
}

export default Header;
