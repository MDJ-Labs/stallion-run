import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header />
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
