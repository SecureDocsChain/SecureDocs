// pages/_app.js
import "../app/styles/globals.css"; // Assurez-vous que le chemin est correct
import Layout from "../components/layout";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
