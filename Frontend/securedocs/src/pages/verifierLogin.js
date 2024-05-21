import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";

import { useWeb3Auth } from "../context/web3AuthContext";

function VerifierLogin() {
  const { connect, disconnect, loggedIn, user, address } = useWeb3Auth();
  const [verifier, setVerifier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  if (verifier === null && error === "Verifier not found") {
    router.push("/verifierSignup");
  }

  if (verifier !== null) {
    router.push("/verifierDashboard");
  }

  useEffect(() => {
    if (address) {
      fetch(`/api/verifier/${address}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            setVerifier(data.data);
          } else {
            setError(data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [address]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="mt-10 mb-8 text-3xl font-bold text-center md:text-5xl">
          Log in to Your Verifier Account
        </h1>
        <p className="px-6 mb-4 text-lg text-center md:text-xl">
          Welcome to our platform dedicated to document verification entities.
        </p>
        <p className="mb-8 text-lg text-center md:text-xl">
          Log in to access your verification tools and manage your documents
          securely.
        </p>
        <button
          onClick={connect}
          className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
        >
          Login
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default VerifierLogin;
