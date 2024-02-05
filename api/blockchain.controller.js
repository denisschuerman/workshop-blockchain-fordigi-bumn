import { Router } from "express";
import { prisma } from "./utils.js";
import * as crypto from "crypto";
import fs from "fs";

const router = Router();
// Proof-of-Work difficulty
const DIFFICULTY = 4;

// Block class
class Block {
  constructor(index, previousHash, timestamp, data, nonce, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = nonce;
    this.hash = hash;
  }
}

router.get("/blocks", async (req, res) => {
  // const blocks = getBlocks();
  const blocks = await prisma.blockchain.findMany();
  let isChainValid = true;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHash = block.hash;
    const calculatedHash = hashBlock(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data,
      block.nonce,
    );

    console.log(`Block ${i + 1}:`);
    console.log(`Calculated Hash: ${calculatedHash}`);
    console.log(`Block Hash: ${blockHash}`);
    console.log(`Validation Result: ${blockHash === calculatedHash}`);
    console.log("--------------------");

    if (blockHash !== calculatedHash) {
      isChainValid = `false at index ${blocks[i + 1].index} or block number ${i + 1}`;
    }
  }
  res.status(200).send({
    status: [200, "ok"],
    data: {
      isChainValid,
      blocks,
    },
  });
});

router.post("/blocks", async (req, res) => {
  const blockData = JSON.stringify(req.body);
  const index = Date.now().toString();
  const previousHash = await getPreviousHash();
  const timestamp = Date.now().toString();
  const nonce = mineBlock(index, previousHash, timestamp, blockData);

  const block = new Block(
    index,
    previousHash,
    timestamp,
    blockData,
    nonce,
    hashBlock(index, previousHash, timestamp, blockData, nonce),
  );
  console.log(block);

  if (!isValidBlock(block)) {
    res.status(400).send({
      status: [400, "Invalid block data"],
    });
    return;
  }

  if (!isValidChain(block)) {
    res.status(400).send({
      status: [400, "Invalid chain"],
    });
    return;
  }

  saveBlock(block);

  res.status(201).send({
    status: [201, "Block saved successfully"],
    data: block,
  });
});

function getBlocks() {
  try {
    const data = fs.readFileSync("./data.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return [];
  }
}

async function saveBlock(block) {
  try {
    // const blocks = getBlocks();
    // blocks.push(block);
    // fs.writeFileSync("./data.json", JSON.stringify(blocks));
    await prisma.blockchain.create({
      data: {
        index: block.index,
        previousHash: block.previousHash,
        timestamp: block.timestamp,
        nonce: block.nonce,
        data: block.data,
        hash: block.hash,
      },
    });
  } catch (error) {
    console.error("Error saving block:", error);
  }
}

async function getPreviousHash() {
  // const blocks = getBlocks();
  const block = await prisma.blockchain.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (block) {
    return block.hash;
  } else {
    return "";
  }
}

function mineBlock(index, previousHash, timestamp, data) {
  let nonce = 0;
  let hash = "";
  while (!isValidHash(hash)) {
    nonce++;
    hash = hashBlock(index, previousHash, timestamp, data, nonce);
  }
  return nonce;
}

function hashBlock(index, previousHash, timestamp, data, nonce) {
  const blockString = `${index}${previousHash}${timestamp}${JSON.stringify(data)}${nonce}`;
  return crypto.createHash("sha256").update(blockString).digest("hex");
}

// proof-of-work difficulty
function isValidHash(hash) {
  return hash.startsWith("0".repeat(DIFFICULTY));
}

function isValidBlock(block) {
  const { index, previousHash, timestamp, data, nonce, hash } = block;
  const calculatedHash = hashBlock(index, previousHash, timestamp, data, nonce);

  return hash === calculatedHash;
}

async function isValidChain(newBlock) {
  // const blocks = getBlocks();
  const blocks = await prisma.blockchain.findMany();

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHash = block.hash;
    const calculatedHash = hashBlock(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data,
      block.nonce,
    );

    console.log(`Block ${i + 1}:`);
    console.log(`Calculated Hash: ${calculatedHash}`);
    console.log(`Block Hash: ${blockHash}`);
    console.log(`Validation Result: ${blockHash === calculatedHash}`);
    console.log("--------------------");

    if (blockHash !== calculatedHash) {
      return false;
    }

    if (!isValidBlock(block)) {
      return false;
    }
  }

  if (!isValidBlock(newBlock)) {
    return false;
  }

  return true;
}

export default router;
