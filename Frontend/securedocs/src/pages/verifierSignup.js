import { useState } from "react";
import PageLayout from "../components/pageLayout";
import { useWeb3Auth } from "../context/web3AuthContext";
import { useRouter } from "next/router";

function VerifierSignup() {
  const router = useRouter();
  const { connect, user, address } = useWeb3Auth();
  const [formData, setFormData] = useState({
    wallet: "",
    occupation: "Notary",
    email: "",
    name: "",
    address: "",
    phoneNumber: "",
    kbisNumber: "",
    professionalInfo: "",
    kycStatus: "en attente",
  });

  if (address && formData.wallet !== address) {
    setFormData({ ...formData, wallet: address, email: user.email });
  }

  if (address === null) {
    connect();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/verifier/verifierUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.status === 201) {
        router.push("/verifierDashboard");
      } else {
        console.error("Verifier not created");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout>
      <h1 className="mt-10 mb-8 text-3xl font-bold text-center md:text-5xl">
        Don't have an Account, Create One
      </h1>
      <p className="px-6 mb-4 text-lg text-center md:text-xl">
        Welcome to our platform dedicated to document verification entities.
      </p>
      <p className="mb-8 text-lg text-center md:text-xl">
        Create an account to access our verification tools and manage your
        documents securely.
      </p>
      <div className="mb-4 text-lg md:text-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">Occupation:</label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            >
              <option value="Notary">Notary</option>
            </select>
          </div>
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            />
          </div>
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            />
          </div>
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            />
          </div>
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">KBIS Number:</label>
            <input
              type="text"
              name="kbisNumber"
              value={formData.kbisNumber}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            />
          </div>
          <div className="flex flex-col mb-2 md:flex-row md:items-center">
            <label className="md:w-1/4 min-w-max">Professional Info:</label>
            <input
              type="text"
              name="professionalInfo"
              value={formData.professionalInfo}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md md:w-3/4"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 mb-6 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
          >
            Create Account
          </button>
        </form>
      </div>
    </PageLayout>
  );
}

export default VerifierSignup;
