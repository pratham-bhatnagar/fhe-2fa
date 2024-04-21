import "./App.css";
import React, { useState, useEffect } from "react";
import { init } from "./utils/fhevm";
import SmartWalletOTP from "./SmartWalletOTP";
import { Web3Provider } from "./web3provider";
import { ConnectKitButton } from "connectkit";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="App flex flex-col justify-center font-press-start text-black">
      <div>
        <Web3Provider>
          
            <SmartWalletOTP />
            <ConnectKitButton/>
         
       </Web3Provider>
      </div>
    </div>
  );
}

export default App;
