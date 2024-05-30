import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "../app/styles/globals.css";
import { useWeb3Auth } from "../context/web3AuthContext";
import { ethers } from "ethers"; // Importez ethers.js

import senderAbi from "../abi/SecureVaultSender.json";
import receiverAbi from "../abi/SecureVaultReceiver.json";
import ERC20Abi from "../abi/ERC20.json";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL de base pour toutes les requêtes
});

const avalancheProvider = new ethers.providers.JsonRpcProvider(
  "https://avalanche-fuji-c-chain-rpc.publicnode.com"
);

const AccountPage = () => {
  const { connect, disconnect, loggedIn, email, loading, signer, address } =
    useWeb3Auth();
  const [userInfo, setUserInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (email) {
      console.log("Fetching user data for email:", email);

      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`/api/users/${email}`);
          console.log("User data:", userResponse.data);
          setUserInfo(userResponse.data);

          // Fetch user documents
          const documentsResponse = await axios.get(
            `/api/users/${email}/documents`
          );
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

  useEffect(() => {
    if (documents.length > 0) {
      documents.forEach(async (doc, index) => {
        const res = await checkIfDocumentAlreadySentToAvalanche(doc);
        console.log("Already sent:", res);
        if (res.success && !documents[index].isSentToAvalanch) {
          const updatedDocuments = [...documents];
          updatedDocuments[index].isSentToAvalanch = true;
          setDocuments(updatedDocuments);
        }
      });
    }
  }, [documents]);

  const handleUserUpdate = async (key, value) => {
    if (email) {
      try {
        const response = await axios.put(`/api/users/${email}`, {
          [key]: value,
        });
        setUserInfo(response.data);
      } catch (error) {
        setError("Error updating user info");
        console.error("Error updating user info:", error);
      }
    }
  };

  const handleDocumentSubmit = async () => {
    try {
      router.push("/upload");
    } catch (error) {
      setError("Error submitting document");
      console.error("Error submitting document:", error);
    }
  };

  const checkIfDocumentAlreadySentToAvalanche = async (document) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_RECEIVER_AVALANCH_CONTRACT_ADDRESS,
      receiverAbi.abi,
      avalancheProvider
    );
    try {
      const result = await contract.getDocumentData(address, document.tokenId);
      if (
        result[3] !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        return { success: true, result };
      }
      return { success: false, result };
    } catch (error) {
      console.error("Error fetching document data from Avalanche:", error);
      return { success: false };
    }
  };

  const approveLinkToken = async () => {
    const tokenAddress = process.env.NEXT_PUBLIC_LINK_CONTRACT_ADDRESS;
    const spenderAddress = process.env.NEXT_PUBLIC_SENDER_CONTRACT_ADDRESS;
    const amount = ethers.constants.MaxUint256;

    const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, signer);

    const allowanceReceipt = await tokenContract.allowance(
      address,
      spenderAddress
    );
    const allowance = Number(allowanceReceipt.toString());

    if (allowance < 1 * 10 ** 18) {
      const approveTx = await tokenContract.approve(spenderAddress, amount);
      const receipt = await approveTx.wait();
      console.log("Token approved successfully:", receipt);
    }
  };

  const sendToAvalanche = async (document) => {
    // Approve LINK token
    await approveLinkToken();

    const avalancheChainSelector = "14767482510784806043";
    const contractSender = new ethers.Contract(
      process.env.NEXT_PUBLIC_SENDER_CONTRACT_ADDRESS,
      JSON.parse(JSON.stringify(senderAbi.abi)),
      signer
    );

    console.log(contractSender);
    console.log(address);
    console.log(document.tokenId);

    const transaction = await contractSender.sendVerifiedDocumentCrossChain(
      address,
      document.tokenId.toString(),
      avalancheChainSelector,
      process.env.NEXT_PUBLIC_RECEIVER_AVALANCH_CONTRACT_ADDRESS
    );

    const receipt = await transaction.wait();

    console.log("Transaction receipt:", receipt);

    // Fonction vide pour interagir avec le contrat Avalanche
    console.log("Sending document to Avalanche:", document);
  };

  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const handleDownload = (base64, fileName, contentType) => {
    const blob = base64ToBlob(base64, contentType);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const shortenName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
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
        <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">
          Account Page
        </h1>
        <div className="w-full max-w-2xl p-4 bg-white rounded-md shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Update Information</h2>
          <input
            type="email"
            placeholder="Email"
            value={userInfo?.email || ""}
            onChange={(e) => handleUserUpdate("email", e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="text"
            placeholder="Name"
            value={userInfo?.name || ""}
            onChange={(e) => handleUserUpdate("name", e.target.value)}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-4 bg-gray-100 rounded-md shadow-md"
                >
                  <div className="flex flex-col items-center justify-between h-full">
                    <span className="block mb-2 text-sm font-medium text-center">
                      {shortenName(doc.fileName)}
                    </span>
                    <span className="block mb-2 text-xs">{doc.status}</span>
                    {doc.status === "validé" && !doc.isSentToAvalanch && (
                      <button
                        onClick={() => sendToAvalanche(doc)}
                        className="w-full px-2 py-1 mb-2 text-xs font-bold text-white bg-green-600 rounded-md hover:bg-green-800"
                      >
                        Send to Avalanche
                      </button>
                    )}
                    {doc.status === "validé" && doc.isSentToAvalanch && (
                      <button className="w-full px-2 py-1 mb-2 text-xs font-bold text-white bg-red-600 rounded-md">
                        Already sent to Avalanche
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleDownload(
                          doc.fileData,
                          doc.fileName,
                          doc.contentType
                        )
                      }
                      className="w-full px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
