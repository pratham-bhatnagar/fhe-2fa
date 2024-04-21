import React from "react";
import { useState, useEffect } from "react";
import { getInstance, provider, getTokenSignature } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Contract } from "ethers";
import SmartWalletOTPABI from "./abi/SmartWalletOTP";
import toast from "react-hot-toast";

let instance;
const CONTRACT_ADDRESS = "0xFEa531Ec1E4359589B7B98E1C4fD6a9B94075b14";
const SECRET_KEY = 26856;

function SmartWalletOTP() {
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [timestamp, setTimestamp] = useState(0);
  const [secretKey, setSecretKey] = useState("hidden");
  const [TOTP, setTOTP] = useState(0);
  const [isValidTOTP, setIsValidTOTP] = useState("-");
  const [inputTOTP, setInputTOTP] = useState(0);

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  useEffect(() => {
    const regenerateTimestamp = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const last5TimeStamp = currentTimestamp % 100000;
      setTimestamp(currentTimestamp);
      setTOTP(last5TimeStamp * SECRET_KEY);
    };
    const timer = setInterval(() => {
      if (seconds === 30) {
        regenerateTimestamp();
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(timer);
        setSeconds(30);
      }
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup the timer when the component unmounts
    };
  }, [seconds]);

  const handleTOTPChange = (e) => {
    setInputTOTP(Number(e.target.value));
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedData(toHexString(encrypted));
    }
  };

  const reencrypt = async () => {
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(
        CONTRACT_ADDRESS,
        SmartWalletOTPABI,
        signer
      );
      setLoading("Decrypting Secret KEY...");
      const { publicKey, signature } = await getTokenSignature(
        CONTRACT_ADDRESS,
        signer.address,
        signer
      );
      const ciphertext = await contract.viewSecretKey(publicKey, signature);
      console.log(ciphertext);
      const secretKeyDecrypted = instance.decrypt(CONTRACT_ADDRESS, ciphertext);
      console.log(ciphertext, secretKeyDecrypted);
      setSecretKey(String(secretKeyDecrypted));
      setLoading("");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Error during reencrypt!");
    }
  };

  const validateOTP = async (e) => {
    e.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(
        CONTRACT_ADDRESS,
        SmartWalletOTPABI,
        signer
      );
      setLoading('Encrypting "30" and generating ZK proof...');
      setLoading("Validating TOTP...");
      console.log("signer", typeof signer.address);
      const result = await contract.validateTOTP(
        "0x" + encryptedData,
        timestamp
      );
      setLoading("Waiting for transaction validation...");
      setLoading("");
      if (isValidTOTP) {
        toast.success("Auth Code correct! Validated!");
      } else {
        toast.error("Auth Code incorrect!");
      }
      setIsValidTOTP(result.toString());
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Error during validation!");
    }
  };

  return (
    <div className="mt-5 text-slate-700">
      <div className="grid grid-cols-1 ">
        <div className="p-2">
          <h1 className="font-semibold text-lg text-slate-700 mb-1">
            3. Genrate 2FA with FHE
          </h1>
          <div className="rounded p-2 border border-gray-400 w-fit m-2">
            <div className="p-1">
              <h1 className="text-3xl text-center font-semibold text-purple-500">
                {TOTP}
              </h1>
              <p>
                refresh in <span className="text-red-300">{seconds}</span>{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <h1 className="font-semibold text-lg text-slate-700 mb-1">
            4. Verify Code
          </h1>
          <form onSubmit={validateOTP}>
            <input
              type="number"
              placeholder="Enter amount to mint"
              value={inputTOTP}
              onChange={handleTOTPChange}
              className="border rounded-md px-4 py-2 mb-1 bg-white"
            />
            <div className="flex flex-row ">
              <div className=" flex-1">
                {" "}
                <button
                  type="submit"
                  className="bg-purple-400 p-2 mx-2 rounded border-none text-slate-800 font-semibold"
                >
                  Validate
                </button>
                <p className=" mb-2">
                  Is TOTP Valid?:{" "}
                  <span className="text-purple-500">{isValidTOTP}</span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SmartWalletOTP;
