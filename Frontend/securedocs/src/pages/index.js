import React, { useEffect, useState } from "react";
import "../app/styles/globals.css";
import { ethers } from "ethers";
import { useRouter } from 'next/router';

import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

const chainConfig = {
  chainId: "0x13882", // Utiliser 0x1 pour Mainnet
  rpcTarget: "https://rpc-amoy.polygon.technology",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Polygon Amoy",
  blockExplorerUrl: "https://amoy.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "Polygon",
  logo: "https://images.toruswallet.io/eth.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleCreateAccount = async () => {
    try {
      const provider = await web3auth.connect();
      setProvider(provider);
      setLoggedIn(true);
      router.push('/dashboard'); // Redirige vers la page de tableau de bord après la connexion
    } catch (error) {
      console.error("Error creating account: ", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const provider = await web3auth.connect();
      setProvider(provider);
      setLoggedIn(true);
      router.push('/dashboard'); // Redirige vers la page de tableau de bord après la connexion
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      router.push('/'); // Redirige vers la page d'accueil après la déconnexion
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <header className="w-full py-4 bg-white shadow-md">
        <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
          <div className="flex items-center">
            <img
              src="/Logo.jpg"
              alt="Secure Logo"
              className="h-12 rounded-lg"
            />
            <span className="ml-3 text-xl font-semibold">
              SecureDocs
            </span>
          </div>
          <div className="flex items-center"></div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">
          Join Hundreds of Millions <br /> Securing Their Documents
        </h1>
        <p className="px-6 mb-8 text-lg text-center md:text-xl">
          Revolutionize how businesses of all sizes secure, manage, and verify their documents using blockchain technology.
        </p>
        <div className="space-x-5">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="px-8 py-3 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-800"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={handleCreateAccount}
                className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
              >
                Create an Account
              </button>
              <button
                onClick={handleSignIn}
                className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-md hover:bg-blue-800"
              >
                Login
              </button>
            </>
          )}
        </div>
      </main>
      <footer className="w-full py-4 text-sm text-center bg-gray-100">
        © 2024 SecureDocs. All rights reserved.
      </footer>
    </div>
  );
}