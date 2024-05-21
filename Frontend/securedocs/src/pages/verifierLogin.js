import Header from "../components/header";
import Footer from "../components/footer";

function VerifierLogin() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1>Verifier Login</h1>
      </main>
      <Footer />
    </div>
  );
}

export default VerifierLogin;
