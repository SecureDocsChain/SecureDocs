import React from 'react';
import Head from 'next/head';
import '../app/styles/globals.css';

export default function Home() {
  return (
    
    <div className="min-h-screen bg-gradient-to-r from-gray-300 to-gray-200 flex flex-col">
      <header className="w-full py-4 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/Logo.jpg" alt="Secure Logo" className="h-12 rounded-lg" />  {/* Rounded corners */}
            <span className="ml-3 text-xl font-semibold">SecureDocs</span>  {/* Text next to logo */}
          </div>
          <div className="flex items-center">
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-4 w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-center mt-10 mb-4">
          Join Hundreds of Millions <br /> Securing Their Documents
        </h1>
        <p className="text-center text-lg md:text-xl mb-8 px-6">
          Revolutionize how businesses of all sizes secure, manage, and verify their documents using blockchain technology.
        </p>
        <div className="space-x-5">
          <button onClick={handleCreateAccount} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md text-lg">
            Create an Account
          </button>
          <button onClick={handleSignIn} className="bg-gray-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md text-lg">
            Login
          </button>
        </div>
      </main>
      <footer className="w-full py-4 bg-gray-100 text-center text-sm">
        © 2024 SecureDocs, Inc. Tous droits réservés.
      </footer>
    </div>
  );
}

function handleCreateAccount() {
  // Implement Venly account creation logic here
}

function handleSignIn() {
  // Implement Venly sign-in logic here
}