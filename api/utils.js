import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as ethers from "ethers";
import SimpleVoting from "../truffle/build/contracts/SimpleVoting.json" assert { type: "json" };
import DemoToken from "../truffle/build/contracts/DemoToken.json" assert { type: "json" };
import NFTMarketplace from "../truffle/build/contracts/NFTMarketplace.json" assert { type: "json" };

const CONTRACT_ADDRESS = SimpleVoting.networks[5777].address;
const ERC20_CONTRACT_ADDRESS = DemoToken.networks[5777].address;
const ERC721_CONTRACT_ADDRESS = NFTMarketplace.networks[5777].address;

export const ADMIN_PUB_KEY = "0x8107050e81038b8c385fDE19FE4AA5Ec3eCbA59d";
export const ADMIN_PRIV_KEY =
  "0x28364c54c465fb53257ae56ac4006e5708564e091187e45687b657323f8b23a3";

export const KEY_JWT = "jAMWuPUnP7tJW8vjJQHs9g==";
export const prisma = new PrismaClient();
const algorithm = "aes-256-gcm";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, KEY_JWT, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const encrypt = (text) => {
  const secretKey = crypto.randomBytes(32);
  console.log("key", secretKey);
  const iv = crypto.randomBytes(16);
  console.log("iv", iv);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const combinedBuffer = Buffer.concat([
    encrypted,
    Buffer.from(iv),
    Buffer.from(secretKey),
  ]);
  return combinedBuffer.toString("base64");
};

export const decrypt = (encrypted) => {
  const combinedBuffer = Buffer.from(encrypted, "base64");
  const encryptedContent = combinedBuffer.slice(
    0,
    combinedBuffer.length - 16 - 32,
  );

  // Extract the IV from the combined buffer
  const iv = combinedBuffer.slice(
    combinedBuffer.length - 16 - 32,
    combinedBuffer.length - 32,
  );

  // Extract the secretKey from the combined buffer
  const secretKey = combinedBuffer.slice(combinedBuffer.length - 32);

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(iv, "hex"),
  );
  let decrypted = decipher.update(Buffer.from(encryptedContent, "hex"));
  // decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  console.log(salt);
  const hash = crypto.pbkdf2Sync(password, salt, 100, 32, "sha512");
  console.log(hash);
  const combinedBuffer = Buffer.concat([salt, hash]);
  return combinedBuffer.toString("base64");
};

export const checkPassword = (hashPassword, password) => {
  const combinedBuffer = Buffer.from(hashPassword, "base64");
  const salt = combinedBuffer.slice(0, 16);
  const hash = combinedBuffer.slice(combinedBuffer.length - 32).toString("hex");
  const inputHash = crypto
    .pbkdf2Sync(password, salt, 100, 32, "sha512")
    .toString("hex");
  if (hash == inputHash) {
    return true;
  } else {
    return false;
  }
};

export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();

  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
  };
};

export const providers = (provider) => {
  if (provider === "ganache") {
    return new ethers.JsonRpcProvider("http://localhost:7545");
  } else if (provider === "tomo") {
    return new ethers.JsonRpcProvider("https://chain.pchain.id/edge");
  }
};

export const readContract = async ({ fn, args, type }) => {
  let contractAddress;
  let abi;

  if (type == "voting") {
    contractAddress = CONTRACT_ADDRESS;
    abi = SimpleVoting.abi;
  } else if (type == "erc20") {
    contractAddress = ERC20_CONTRACT_ADDRESS;
    abi = DemoToken.abi;
  } else {
    contractAddress = ERC721_CONTRACT_ADDRESS;
    abi = NFTMarketplace.abi;
  }

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    providers("ganache"),
  );

  const result = await contract[fn](...(Array.isArray(args) ? args : []));

  return result;
};

export const writeContract = async ({
  username,
  fn,
  args,
  sendValue = 0,
  type,
  isAdmin = false,
}) => {
  let contractAddress;
  let abi;
  let user;
  let privKey;
  if (isAdmin) {
    privKey = ADMIN_PRIV_KEY;
  } else {
    user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return "user not found";
    }

    privKey = decrypt(user.privKey);
  }

  if (type == "voting") {
    contractAddress = CONTRACT_ADDRESS;
    abi = SimpleVoting.abi;
  } else if (type == "erc20") {
    contractAddress = ERC20_CONTRACT_ADDRESS;
    abi = DemoToken.abi;
  } else if (type == "erc721") {
    contractAddress = ERC721_CONTRACT_ADDRESS;
    abi = NFTMarketplace.abi;
  }

  const signAccount = new ethers.Wallet(privKey, providers("ganache"));
  const contract = new ethers.Contract(contractAddress, abi, signAccount);
  const value = sendValue > 0 ? sendValue : 0;

  const result = await contract[fn](...(Array.isArray(args) ? args : []), {
    value,
  });

  return result;
};

export const sendEther = async (
  senderPrivateKey,
  recipientAddress,
  amountInEther,
) => {
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
};
