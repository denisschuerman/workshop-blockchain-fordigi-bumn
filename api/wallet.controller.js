import { Router } from "express";
import * as ethers from "ethers";
import {
  prisma,
  providers,
  readContract,
  decrypt,
  writeContract,
  ADMIN_PUB_KEY,
  ADMIN_PRIV_KEY,
} from "./utils.js";

const router = Router();

router.get("/:username", async (req, res) => {
  let pubKey;
  if (req.params.username === "admin") {
    pubKey = ADMIN_PUB_KEY;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        username: req.params.username,
      },
    });
    pubKey = user.pubKey;
  }

  const provider = providers("ganache");
  let ethBalance = await provider.getBalance(pubKey);
  ethBalance = ethers.formatEther(ethBalance);

  const tokenBalance = await readContract({
    fn: "balanceOf",
    args: [pubKey],
    type: "erc20",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: {
      address: pubKey,
      ethBalance: ethBalance.toString(),
      tokenBalance: tokenBalance.toString(),
    },
  });
});

router.post("/transfer-eth", async (req, res) => {
  const { to, amount, signer } = req.body;
  let privKey;

  if (signer === "admin") {
    privKey = ADMIN_PRIV_KEY;
  } else {
    const userFrom = await prisma.user.findUnique({
      where: {
        username: signer,
      },
    });

    privKey = decrypt(userFrom.privKey);
  }

  const userTo = await prisma.user.findUnique({
    where: {
      username: to,
    },
  });
  // const privKey = decrypt(userFrom.privKey);
  const provider = providers("ganache");
  const signers = new ethers.Wallet(privKey, provider);
  const input = {
    to: userTo.pubKey,
    value: ethers.parseEther(amount),
  };
  const tx = await signers.sendTransaction(input);

  if (tx) {
    await prisma.event.create({
      data: {
        txHash: tx.hash,
        data: tx.data,
        method: "send_eth",
        input: JSON.stringify({
          to: input.to,
          value: input.value.toString(),
        }),
        from: tx.from,
        to: tx.to,
      },
    });
  }

  res.status(200).send({
    status: [200, "ok"],
    data: {
      txHash: tx.hash,
    },
  });
});

router.post("/transfer-eth/admin", async (req, res) => {
  const { to, amount } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: to,
    },
  });

  const provider = providers("ganache");
  const signers = new ethers.Wallet(ADMIN_PRIV_KEY, provider);
  const input = {
    to: user.pubKey,
    value: ethers.parseEther(amount),
  };
  const tx = await signers.sendTransaction(input);

  if (tx) {
    await prisma.event.create({
      data: {
        txHash: tx.hash,
        data: tx.data,
        method: "send_eth",
        input: JSON.stringify({
          to: input.to,
          value: input.value.toString(),
        }),
        from: tx.from,
        to: tx.to,
      },
    });
  }

  res.status(200).send({
    status: [200, "ok"],
    data: {
      txHash: tx.hash,
    },
  });
});

router.post("/transfer-token/admin", async (req, res) => {
  const { username, amount } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  const input = [user.pubKey, amount];
  const transferToken = await writeContract({
    username: "",
    fn: "transfer",
    args: input,
    isAdmin: true,
    type: "erc20",
  });

  if (transferToken) {
    await prisma.event.create({
      data: {
        txHash: transferToken.hash,
        data: transferToken.data,
        method: "transfer",
        input: JSON.stringify(input),
        from: transferToken.from,
        to: transferToken.to,
      },
    });
  }
  res.status(200).send({
    status: [200, "ok"],
    data: transferToken,
  });
});

router.post("/transfer-token", async (req, res) => {
  const { to, amount, signer } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: to,
    },
  });

  const input = [user.pubKey, amount];
  const transferToken = await writeContract({
    username: signer == "admin" ? "" : signer,
    fn: "transfer",
    args: input,
    type: "erc20",
    isAdmin: signer == "admin" ? true : false,
  });
  console.log(transferToken);

  if (transferToken) {
    await prisma.event.create({
      data: {
        txHash: transferToken.hash,
        data: transferToken.data,
        method: "transfer",
        input: JSON.stringify(input),
        from: transferToken.from,
        to: transferToken.to,
      },
    });
  }
  res.status(200).send({
    status: [200, "ok"],
    data: transferToken,
  });
});

export default router;
