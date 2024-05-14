import { createContext, useState, useEffect, useContext } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";

const Web3AuthContext = createContext();

const clientId =
  "BLVu3QO6D_0B1gwr9bLRtZSxuhVYDr8FhXIjb3Xmss-4ncqqPXK0Bu4tpLCs9x9ZRncLXWxL-tQZMdiAJ6Kc2U4";

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

  console.log("Web3AuthProvider");

  useEffect(() => {
    console.log("Web3AuthProvider init");
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

  const connect = async () => {
    try {
      await web3auth.connect();
      if (web3auth.provider) {
        setProvider(new ethers.providers.Web3Provider(web3auth.provider));
      }
      if (web3auth.connected) {
        setLoggedIn(true);
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
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    return user;
  };

  return (
    <Web3AuthContext.Provider
      value={{ provider, loggedIn, connect, disconnect, getUserInfo }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
