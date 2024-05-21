import { createContext, useState, useEffect, useContext } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";
// import { useRouter } from "next/router";

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

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});

export const Web3AuthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  // const Router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(new ethers.providers.Web3Provider(web3auth.provider));
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      getUserInfo().then((user) => setUser(user));
      getAccounts().then((address) => setAddress(address));
    } else {
      setUser(null);
      setAddress(null);
    }
  }, [loggedIn]);

  const connect = async () => {
    try {
      await web3auth.connect();
      if (web3auth.provider) {
        setProvider(new ethers.providers.Web3Provider(web3auth.provider));
      }
      if (web3auth.connected) {
        setLoggedIn(true);
        // Router.push("/dashboard"); // Redirige vers le tableau de bord après la connexion
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      // Router.push("/"); // Redirige vers la page d'accueil après la déconnexion
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    return user;
  };

  const getAccounts = async () => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  };

  const props = {
    provider,
    loggedIn,
    user,
    address,
    connect,
    disconnect,
    getUserInfo,
  };

  return (
    <Web3AuthContext.Provider value={props}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
