import React from "react";
import { createGlobalStyle } from "styled-components";
import { GlobalProvider } from "../components/context/GlobalContext";
import { SessionProvider } from "next-auth/react";
import { SessionSync } from "./api/SessionSync";


const GlobalStyles = createGlobalStyle`
  body {
    background-color: #FEFEFE;
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
  main {
    flex: 1;
  }
  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider >   {/* for GlobalState*/}
        <SessionSync />  {/* to create Localstorage*/}
        <GlobalStyles />
        <Component {...pageProps} />
      </GlobalProvider>
    </SessionProvider>
  );
}


