import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTicketTypes = async (req: any, res: any) => {
  try {
    const types = await prisma.ticketType.findMany();

    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
