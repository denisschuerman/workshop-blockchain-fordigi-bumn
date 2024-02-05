import { Router } from "express";
import {
  prisma,
  encrypt,
  decrypt,
  createWallet,
  hashPassword,
  checkPassword,
  KEY_JWT,
  sendEther,
} from "./utils.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const users = await prisma.user.findMany({
    take: limitNumber,
    skip: skip,
  });
  res.status(200).send({
    status: [200, "ok"],
    data: users,
    page: pageNumber,
    limit: limitNumber,
  });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const { privateKey, address } = createWallet();

  await sendEther(
    "0x50916497408a6ab25309f38a1051870fe12145d8536a397507b4e8c54ed34afa",
    address,
    "1",
  );

  const user = await prisma.user.create({
    data: {
      username,
      password: hashPassword(password),
      pubKey: address,
      privKey: encrypt(privateKey),
    },
  });

  res.status(200).send({
    status: [200, "ok"],
    data: user,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  const isPassword = checkPassword(user.password, password);
  if (isPassword) {
    const token = jwt.sign({ id: user.id }, KEY_JWT, {
      expiresIn: 86400, // expires in 24 hours
    });

    res.status(200).send({
      status: [200, "ok"],
      data: {
        username: user.username,
        pubKey: user.pubKey,
        privKey: decrypt(user.privKey),
      },
      token,
    });
  } else {
    res.status(401).send({
      status: [401, "unauthenticate/password wrong"],
    });
  }
});

export default router;
