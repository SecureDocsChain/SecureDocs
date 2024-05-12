// pages/_app.js
import '../app/styles/globals.css'; // Assurez-vous que le chemin est correct

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;