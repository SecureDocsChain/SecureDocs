import React, { useEffect, useState } from "react";
import "../app/styles/globals.css";
import { ethers } from "ethers";

import { useWeb3Auth } from "../context/web3AuthContext";

export default function Home() {
  const { connect, disconnect, loggedIn } = useWeb3Auth();

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
            <span className="ml-3 text-xl font-semibold">SecureDocs</span>
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
        <div className="space-x-5">
          {loggedIn ? (
            <button
              onClick={disconnect}
              className="px-8 py-3 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-800"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={connect}
                className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
              >
                Create an Account
              </button>
              <button
                onClick={connect}
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
