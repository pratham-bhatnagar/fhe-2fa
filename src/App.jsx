import React, { useState, useEffect } from "react";
import { init } from "./utils/fhevm";
import SmartWalletOTP from "./SmartWalletOTP";
import { Web3Provider } from "./web3provider";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import { client } from "@passwordless-id/webauthn";

function App() {
  const [loggedIn, setLogedin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [challenge, setChallenge] = useState();

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  const address = `0x`;
  const API = `https://9407-2402-e280-2011-10a-9520-ddea-861a-83af.ngrok-free.app`;

  const register = async () => {
    try {
      const registerRes = await axios.post(API + "/api/auth/register", {
        walletAddress: address,
      });
      setChallenge(registerRes.data.challenge);
      let res = await client.register(address, registerRes.data.challenge, {
        authenticatorType: "auto",
        userVerification: "required",
        discoverable: "preferred",
        timeout: 60000,
        attestation: true,
      });
      console.log(res);
      let registrationRes = await axios.post(
        API + `/api/auth/register-response`,
        { walletAddress: address, ...res }
      );
      console.log(registrationRes);
    } catch (e) {
      console.log(e);
    }
  };
  const login = async () => {
    console.log("Authenticating...");
    try {
      let res = await client.authenticate([], challenge);
      console.log(res);
      setLogedin(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App flex flex-col justify-center font-press-start text-black">
      <div>
        <Web3Provider>
          <>
            <nav className="w-full  mb-3 flex flex-row justify-between items-center p-3">
              <h1 className="font-semibold text-[#33C6F1]">FHE Auth</h1>
              <ConnectKitButton />
            </nav>

            <div className="p-2">
              {" "}
              <h1 className="font-semibold text-lg">1. Register this device</h1>
              <button
                className="bg-purple-400 p-2 mx-2 rounded border-none text-slate-800 font-semibold"
                onClick={register}
              >
                Register Passkey
              </button>
            </div>

            <div className="p-2">
              <h1 className="font-semibold text-lg text-slate-700 mb-1">
                2. Login With Pass Key
              </h1>
              <button
                className="bg-purple-400 p-2 mx-2 rounded border-none text-slate-800 font-semibold"
                onClick={login}
              >
                Login with Passkey
              </button>
            </div>

            {!loggedIn && (
              <>
                <SmartWalletOTP />
              </>
            )}
          </>
        </Web3Provider>
      </div>
    </div>
  );
}

export default App;
