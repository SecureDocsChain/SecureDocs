// pages/_app.js
import "../app/styles/globals.css"; // Assurez-vous que le chemin est correct
// import { Web3AuthProvider } from "../context/web3AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    // <Web3AuthProvider>
    <Component {...pageProps} />
    // </Web3AuthProvider>
  );
}

export default MyApp;
