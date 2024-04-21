# TOTP (Time-based One-Time-Password) Dapp

On-chain TOPT (Time-based One-Time-Password).

The user client, which also possesses the secret key, generates a TOTP code that can be validated on-chain without the necessity of decrypting the secret key. Employing FHE, it becomes feasible to perform a multiplication operation between the secret key and the timestamp in an encrypted manner, subsequently comparing the product to the TOTP code for verification.

The Solidity contract can be found in [`TOTP.sol`](https://github.com/Inco-fhevm/Contracts/blob/main/inco_contract/TOTP.sol).

## Get Started

Clone the project, then run:

```bash
npm install
npm run dev
```

The dapp should run on http://localhost:5173.
