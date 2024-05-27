import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'; // Importez useRouter
import "../app/styles/globals.css";
import { useWeb3Auth } from "../context/web3AuthContext";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL de base pour toutes les requêtes
});

const AccountPage = () => {
  const { connect, disconnect, loggedIn, email, loading } = useWeb3Auth();
  const [userInfo, setUserInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialisez useRouter

  useEffect(() => {
    if (email) {
      console.log("Fetching user data for email:", email);

      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`/api/users/${email}`);
          console.log("User data:", userResponse.data);
          setUserInfo(userResponse.data);

          // Fetch user documents
          const documentsResponse = await axios.get(`/api/users/${email}/documents`);
          console.log("User documents:", documentsResponse.data);
          setDocuments(documentsResponse.data);
        } catch (error) {
          setError("Error fetching data");
          console.error("Error fetching data:", error);
        }
      };

      fetchUserData();
    }
  }, [email]);

  const handleUserUpdate = async (key, value) => {
    if (email) {
      try {
        const response = await axios.put(`/api/users/${email}`, { [key]: value });
        setUserInfo(response.data);
      } catch (error) {
        setError("Error updating user info");
        console.error("Error updating user info:", error);
      }
    }
  };

  const handleDocumentSubmit = async () => {
    try {
      // Redirigez vers la page /upload directement
      router.push('/upload');
    } catch (error) {
      setError("Error submitting document");
      console.error("Error submitting document:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!userInfo) return <div>No user information available.</div>;

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
          <div className="flex items-center">
            {loggedIn && (
              <button
                onClick={disconnect}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-md hover:bg-red-800"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">Account</h1>
        <div className="w-full max-w-2xl p-4 bg-white rounded-md shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Update Information</h2>
          <input
            type="email"
            placeholder="Email"
            value={userInfo?.email || ''}
            onChange={(e) => handleUserUpdate('email', e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="text"
            placeholder="Name"
            value={userInfo?.name || ''}
            onChange={(e) => handleUserUpdate('name', e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <h2 className="mb-4 text-xl font-semibold">Submit a Document</h2>
          <button
            onClick={handleDocumentSubmit}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
          >
            Submit
          </button>
          <h2 className="mt-8 mb-4 text-xl font-semibold">My Documents</h2>
          {documents.length === 0 ? (
            <div>No documents available.</div>
          ) : (
            <ul className="space-y-2">
              {documents.map(doc => (
                <li key={doc._id} className="px-4 py-2 bg-gray-100 rounded-md">
                  {doc.fileName} - {doc.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer className="w-full py-4 text-sm text-center bg-gray-100">
        © 2024 SecureDocs. All rights reserved.
      </footer>
    </div>
  );
};

export default AccountPage;