import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardStats = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const myTickets = await prisma.ticket.count({
      where: { createdById: userId },
    });

    const openTickets = await prisma.ticket.count({
      where: { status: "OPEN" },
    });

    const inProgressTickets = await prisma.ticket.count({
      where: { status: "IN_PROGRESS" },
    });

    const escalatedTickets = await prisma.ticket.count({
      where: { status: "ESCALATED" },
    });

    const resolvedTickets = await prisma.ticket.count({
      where: { status: "RESOLVED" },
    });

    const closedTickets = await prisma.ticket.count({
      where: { status: "CLOSED" },
    });

    res.json({
      myTickets,
      openTickets,
      inProgressTickets,
      escalatedTickets,
      resolvedTickets,
      closedTickets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
