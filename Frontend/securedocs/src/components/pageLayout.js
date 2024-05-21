import Header from "../components/header";
import Footer from "../components/footer";

function PageLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
