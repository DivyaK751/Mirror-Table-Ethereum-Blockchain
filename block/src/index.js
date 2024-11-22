import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import {AuthProvider} from './context/AuthProvider'

import App from "./App";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; 
  return library;
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  </StrictMode>,
  rootElement
);
