import { createContext, useState, useEffect, useContext } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import axios from 'axios';

const Web3AuthContext = createContext();

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

const chainConfig = {
  chainId: "0x13882", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc-amoy.polygon.technology",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Polygon Amoy",
  blockExplorerUrl: "https://amoy.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "Polygon",
  logo: "https://images.toruswallet.io/eth.svg",
};

export const Web3AuthProvider = ({ children }) => {
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: new EthereumPrivateKeyProvider({ config: { chainConfig } }),
        });
        await web3authInstance.initModal();
        setWeb3Auth(web3authInstance);

        if (web3authInstance.provider) {
          const ethersProvider = new ethers.providers.Web3Provider(web3authInstance.provider);
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          const userAddress = await signer.getAddress();
          const userInfo = await web3authInstance.getUserInfo();
          const userEmail = userInfo.email;
          setAddress(userAddress);
          setEmail(userEmail);
          setLoggedIn(true);

          // Enregistrer l'utilisateur dans la BDD
          await registerUser(userAddress, userEmail);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const registerUser = async (userAddress, email) => {
    try {
      await axios.post('/api/register', {
        wallet: userAddress,
        email: email,
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const connect = async () => {
    try {
      if (!web3auth) {
        console.error("Web3Auth is not initialized");
        return;
      }
      await web3auth.connect();

      if (web3auth.provider) {
        const ethersProvider = new ethers.providers.Web3Provider(web3auth.provider);
        setProvider(ethersProvider);
        const signer = ethersProvider.getSigner();
        const userAddress = await signer.getAddress();
        const userInfo = await web3auth.getUserInfo();
        const userEmail = userInfo.email;
        setAddress(userAddress);
        setEmail(userEmail);
        setLoggedIn(true);

        // Enregistrer l'utilisateur dans la BDD
        await registerUser(userAddress, userEmail);
        router.push('/account'); // Rediriger après connexion
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    try {
      if (!web3auth) {
        console.error("Web3Auth is not initialized");
        return;
      }
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setAddress(null);
      setEmail(null);
      router.push('/'); // Rediriger après déconnexion
    } catch (error) {
      console.error(error);
    }
  };

  const props = {
    provider,
    loggedIn,
    address,
    email, // Assurez-vous que l'email est inclus dans les props
    connect,
    disconnect,
    loading,
  };

  return (
    <Web3AuthContext.Provider value={props}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);