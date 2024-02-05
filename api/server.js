import express from "express";
import user from "./user.controller.js";
import ballot from "./ballot.controller.js";
import wallet from "./wallet.controller.js";
import events from "./event.controller.js";
import NFTMarketplace from "./erc721.controller.js";
import blockchain from "./blockchain.controller.js";
import bodyParser from "body-parser";
import { authMiddleware } from "./utils.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use("/user", user);
app.use("/ballot", ballot);
app.use("/wallet", wallet);
app.use("/events", events);
app.use("/nft-market", NFTMarketplace);
app.use("/blockchain", blockchain);

app.get("/protected-route", authMiddleware, (req, res) => {
  res.status(200).send({ message: "This is a protected route!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
