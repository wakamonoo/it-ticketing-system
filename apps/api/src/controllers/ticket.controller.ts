import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTicket = async (req: any, res: any) => {
  try {
    const { title, description, ticketTypeId } = req.body;

    const userId = req.user.userId;

    const firstStep = await prisma.ticketPipeline.findFirst({
      where: {
        ticketTypeId,
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!firstStep) {
      return res.status(400).json({
        error: "pipeline not found",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        ticketTypeId,
        createdById: userId,
        currentDepartmentId: firstStep.departmentId,
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId: ticket.id,
        userId,
        type: "CREATED",
        message: "ticket created",
      },
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
