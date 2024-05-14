import React from "react";
import Head from "next/head";
import "../app/styles/globals.css";

import { Web3AuthProvider } from "../context/web3AuthContext";
import { useWeb3Auth } from "../context/web3AuthContext";

export default function Home() {
  return (
    <Web3AuthProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
        <header className="w-full py-4 bg-white shadow-md">
          <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
            <div className="flex items-center">
              <img
                src="/Logo.jpg"
                alt="Secure Logo"
                className="h-12 rounded-lg"
              />{" "}
              {/* Rounded corners */}
              <span className="ml-3 text-xl font-semibold">
                SecureDocs
              </span>{" "}
              {/* Text next to logo */}
            </div>
            <div className="flex items-center"></div>
          </div>
        </header>
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
          <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">
            Join Hundreds of Millions <br /> Securing Their Documents
          </h1>
          <p className="px-6 mb-8 text-lg text-center md:text-xl">
            Revolutionize how businesses of all sizes secure, manage, and verify
            their documents using blockchain technology.
          </p>
          {/* <div className="space-x-5"> */}
          {/* <button
              onClick={handleCreateAccount}
              className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
            >
              Create an Account
            </button> */}
          {/* <button
              onClick={handleSignIn}
              className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-md hover:bg-blue-800"
            >
              Login
            </button> */}
          <ButtonLoginLogout />
          {/* </div> */}
        </main>
        <footer className="w-full py-4 text-sm text-center bg-gray-100">
          © 2024 SecureDocs. All rights reserved.
        </footer>
      </div>
    </Web3AuthProvider>
  );
}

const ButtonLoginLogout = () => {
  const { connect, disconnect, loggedIn } = useWeb3Auth();

  return (
    <button
      onClick={loggedIn ? disconnect : connect}
      className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
    >
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
};

function handleCreateAccount() {
  // Implement Venly account creation logic here
}

function handleSignIn() {
  // Implement Venly sign-in logic here
}
