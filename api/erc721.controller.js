import { Router } from "express";
import { writeContract, readContract } from "./utils.js";

const router = Router();

router.post("/create-token", async (req, res) => {
  const { tokenUri, name, description, imageUrl, attributes, price, signer } =
    req.body;
  const input = [tokenUri, name, description, imageUrl, attributes, price];

  const token = await writeContract({
    username: signer,
    fn: "createToken",
    args: input,
    sendValue: 100000,
    type: "erc721",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: token,
  });
});

router.get("/my-nft/:signer", async (req, res) => {
  try {
    const nfts = await writeContract({
      username: req.params.signer,
      fn: "fetchMyNFTs",
      args: [],
      type: "erc721",
    });

    const objectsArr = [];
    const dataArr = nfts.toString().split(",");
    for (let i = 0; i < dataArr.length; i += 10) {
      const [
        tokenId,
        tokenUri,
        name,
        description,
        imageUrl,
        dataAttributes,
        seller,
        owner,
        price,
        sold,
      ] = dataArr.slice(i, i + 10);

      const attributes = await readContract({
        fn: "decodeAttributes",
        args: [dataAttributes],
        type: "erc721",
      });

      const obj = {
        tokenId,
        tokenUri,
        name,
        description,
        imageUrl,
        attributes,
        seller,
        owner,
        price,
        sold,
      };

      objectsArr.push(obj);
    }

    res.status(200).send({
      status: [200, "ok"],
      data: objectsArr,
    });
  } catch (err) {
    res.status(404).send({
      status: [404, "Not found"],
      data: [],
    });
  }
});

router.get("/market-items", async (req, res) => {
  try {
    const nfts = await readContract({
      fn: "fetchMarketItems",
      args: [],
      type: "erc721",
    });

    const objectsArr = [];
    const dataArr = nfts.toString().split(",");
    for (let i = 0; i < dataArr.length; i += 10) {
      const [
        tokenId,
        tokenUri,
        name,
        description,
        imageUrl,
        dataAttributes,
        seller,
        owner,
        price,
        sold,
      ] = dataArr.slice(i, i + 10);

      const attributes = await readContract({
        fn: "decodeAttributes",
        args: [dataAttributes],
        type: "erc721",
      });

      const obj = {
        tokenId,
        tokenUri,
        name,
        description,
        imageUrl,
        attributes,
        seller,
        owner,
        price,
        sold,
      };

      objectsArr.push(obj);
    }

    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedObjectsArr = objectsArr.slice(startIndex, endIndex);

    res.status(200).send({
      status: [200, "ok"],
      data: paginatedObjectsArr,
      pagination: {
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(objectsArr.length / limit),
      },
    });
  } catch (err) {
    res.status(404).send({
      status: [404, "Not found"],
      data: [],
    });
  }
});

router.get("/my-item-list/:signer", async (req, res) => {
  const nfts = await writeContract({
    username: req.params.signer,
    fn: "fetchItemsListed",
    args: [],
    type: "erc721",
  });

  const objectsArr = [];
  const dataArr = nfts.toString().split(",");
  for (let i = 0; i < dataArr.length; i += 10) {
    const [
      tokenId,
      tokenUri,
      name,
      description,
      imageUrl,
      dataAttributes,
      seller,
      owner,
      price,
      sold,
    ] = dataArr.slice(i, i + 10);

    const attributes = await readContract({
      fn: "decodeAttributes",
      args: [dataAttributes],
      type: "erc721",
    });

    const obj = {
      tokenId,
      tokenUri,
      name,
      description,
      imageUrl,
      attributes,
      seller,
      owner,
      price,
      sold,
    };

    objectsArr.push(obj);
  }

  res.status(200).send({
    status: [200, "ok"],
    data: objectsArr,
  });
});

router.post("/buy", async (req, res) => {
  const { tokenId, signer, value } = req.body;
  const input = [tokenId];

  const token = await writeContract({
    username: signer,
    fn: "createMarketSale",
    args: input,
    sendValue: value,
    type: "erc721",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: token,
  });
});

export default router;
