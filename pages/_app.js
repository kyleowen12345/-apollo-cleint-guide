import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../src/apollo";
import { CookiesProvider } from "react-cookie"
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  return(
    <CookiesProvider>
    <ApolloProvider client={client}>
  <Component {...pageProps} />
  </ApolloProvider>
  </CookiesProvider>)
}

export default MyApp
