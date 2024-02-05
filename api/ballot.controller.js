import { Router } from "express";
import { prisma, writeContract, readContract } from "./utils.js";

const router = Router();

router.get("/counter", async (req, res) => {
  const counter = await readContract({
    fn: "counter",
    args: [],
    type: "voting",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: counter.toString(),
  });
});

router.get("/all", async (req, res) => {
  let ballots = [];
  const counter = await readContract({
    fn: "counter",
    args: [],
    type: "voting",
  });

  for (let i = 0; i < counter; i++) {
    const ballot = await readContract({
      fn: "getBallotByIndex",
      args: [i],
      type: "voting",
    });
    let eventObject = {
      id: i,
      event: ballot[0],
      candidates: ballot[1],
      startTime: ballot[2].toString(),
      ballotTime: ballot[3].toString(),
    };
    ballots.push(eventObject);
  }
  res.status(200).send({
    status: [200, "ok"],
    data: ballots,
  });
});

router.post("/create", async (req, res) => {
  const { signer, eventName, candidates, duration } = req.body;
  const createBallot = await writeContract({
    username: signer,
    fn: "createBallot",
    args: [
      eventName,
      candidates,
      Math.floor(new Date().getTime() / 1000) + 2,
      duration,
    ],
    type: "voting",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: createBallot,
  });
});

router.post("/cast", async (req, res) => {
  const { signer, ballotIndex, optionIndex } = req.body;

  const castBallot = await writeContract({
    username: signer,
    fn: "cast",
    args: [ballotIndex, optionIndex],
    type: "voting",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: castBallot,
  });
});

router.post("/has-vote", async (req, res) => {
  const { ballotIndex, username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  const isVotes = await readContract({
    fn: "hasVoted",
    args: [ballotIndex, user.pubKey],
    type: "voting",
  });

  res.status(200).send({
    status: [200, "ok"],
    data: isVotes,
  });
});

router.get("/winners/:id", async (req, res) => {
  const getBallotById = await readContract({
    fn: "getBallotByIndex",
    args: [req.params.id],
    type: "voting",
  });

  const newArray = [];
  for (let i = 0; i < getBallotById[1].length; i++) {
    const tally = await readContract({
      fn: "getTally",
      args: [req.params.id, i],
      type: "voting",
    });
    newArray.push({
      candidate: getBallotById[1][i],
      tally: tally.toString(),
    });
  }

  res.status(200).send({
    status: [200, "ok"],
    data: {
      title: getBallotById[0],
      lists: newArray,
    },
  });
});

router.get("/winners", async (req, res) => {
  const result = [];

  const counter = await readContract({
    fn: "counter",
    args: [],
    type: "voting",
  });

  for (let i = 0; i < Number(counter); i++) {
    const getBallotById = await readContract({
      fn: "getBallotByIndex",
      args: [i],
      type: "voting",
    });

    const ballot = {
      title: getBallotById[0],
      candidates: [],
    };

    for (let j = 0; j < getBallotById[1].length; j++) {
      const tally = await readContract({
        fn: "getTally",
        args: [i, j],
        type: "voting",
      });

      const candidate = {
        candidate: getBallotById[1][j],
        tally: tally.toString(),
      };

      ballot.candidates.push(candidate);
    }

    result.push(ballot);
  }

  res.status(200).send({
    status: [200, "ok"],
    data: result,
  });
});

router.get("/result/:id", async (req, res) => {
  const { id } = req.params;
  const tally = await readContract({
    fn: "results",
    args: [id],
    type: "voting",
  });
  res.status(200).send({
    status: [200, "ok"],
    data: tally.toString(),
  });
});

export default router;
