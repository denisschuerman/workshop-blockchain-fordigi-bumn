import * as ethers from "ethers";
import SimpleVoting from "../artifacts/contracts/SimpleVoting.sol/SimpleVoting.json" assert { type: "json" };
const CONTRACT_ADDRESS = "0x366d2292Ce5B3379ea08676623DB667d93D238D8";
import { prisma, decrypt } from "./utils.js";
// Example usage:
// sendEther('your-private-key', 'recipient-address', '1.0', 'your-provider-url');
export const providers = (provider) => {
  if (provider === "besu") {
    return new ethers.JsonRpcProvider("https://chain.pchain.id/besu");
  } else if (provider === "edge") {
    return new ethers.JsonRpcProvider("https://chain.pchain.id/edge");
  } else if (provider === "tomo") {
    return new ethers.JsonRpcProvider("https://rpc-testnet.viction.xyz");
  } else if (provider === "mumbai") {
    return new ethers.JsonRpcProvider("https://chain.pchain.id/mumbai");
  } else if (provider === "ganache") {
    return new ethers.JsonRpcProvider("http://localhost:8545");
  } else {
    return new ethers.JsonRpcProvider("https://chain.pchain.id/besu");
  }
};

const readContract = async ({ fn, args }) => {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    SimpleVoting.abi,
    providers("ganache"),
  );

  const result = await contract[fn](...(Array.isArray(args) ? args : []));

  return result;
};

const writeContract = async ({ username, fn, args }) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return "user not found";
  }
  const privKey = decrypt(user.privKey);
  const signAccount = new ethers.Wallet(privKey, providers("ganache"));
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    SimpleVoting.abi,
    signAccount,
  );

  const result = await contract[fn](...(Array.isArray(args) ? args : []));

  return result;
};

async function sendEther(senderPrivateKey, recipientAddress, amountInEther) {
  // Create a wallet instance from a private key and connect it to the provider
  const senderWallet = new ethers.Wallet(
    senderPrivateKey,
    providers("ganache"),
  );

  // Define the transaction
  const tx = {
    to: recipientAddress,
    value: ethers.parseEther(amountInEther),
  };

  // Send the transaction
  const txResponse = await senderWallet.sendTransaction(tx);
  console.log(`Transaction hash: ${txResponse.hash}`);

  // Wait for the transaction to be mined
  const receipt = await txResponse.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
}

// Function for Transfer
sendEther(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0xE85e2b9dFFe4fa390395caACB0E9DFc533e44b8d",
  "10",
);

// const createBallot = await writeContract({
//   username: "user",
//   fn: "createBallot",
//   args: [
//     "Pemilihan DPR RI",
//     ["lutfi-Partai A", "ikbal - Partai B", "majid - Partai C"],
//     new Date().getTime(),
//     6000,
//   ],
// });
