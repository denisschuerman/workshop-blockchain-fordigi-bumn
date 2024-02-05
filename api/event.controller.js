import { Router } from "express";
import { prisma } from "./utils.js";

const router = Router();

router.get("/", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const events = await prisma.event.findMany({
    take: limitNumber,
    skip: skip,
  });

  const total = await prisma.event.count();
  res.status(200).send({
    status: [200, "ok"],
    data: events,
    page: pageNumber,
    limit: limitNumber,
    total: total,
  });
});

export default router;
