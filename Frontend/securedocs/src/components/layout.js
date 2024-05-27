import { Web3AuthProvider } from "../context/web3AuthContext";

function Layout({ children }) {
  return (
    <Web3AuthProvider>
      <main>{children}</main>
    </Web3AuthProvider>
  );
}

export default Layout;
