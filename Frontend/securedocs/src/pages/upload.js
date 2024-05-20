import { useState } from 'react';
import { useWeb3Auth } from '../context/web3AuthContext.js';

export default function Upload() {
  const [file, setFile] = useState(null);
  const { address } = useWeb3Auth(); // Récupérer l'adresse depuis le contexte

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', address); // Ajouter userId au formData

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Document uploaded successfully!');
      } else {
        alert('Failed to upload document.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the document.');
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
            <span className="ml-3 text-xl font-semibold">SecureDocs</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 ml-4 text-lg font-bold text-white bg-gray-600 rounded-md hover:bg-gray-800"
            >
              Back
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">
          Upload Your Document
        </h1>
        <p className="px-6 mb-8 text-lg text-center md:text-xl">
          Securely upload your document using blockchain technology.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2 text-lg font-medium text-gray-700">
              Choose a file:
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
          >
            Upload
          </button>
        </form>
      </main>
      <footer className="w-full py-4 text-sm text-center bg-gray-100">
        © 2024 SecureDocs. All rights reserved.
      </footer>
    </div>
  );
}